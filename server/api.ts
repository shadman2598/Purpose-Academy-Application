import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import type { IncomingMessage, ServerResponse } from "node:http";
import { PrismaClient } from "@prisma/client";
import type { Block, SourceRef, TrainingModule } from "../src/content/model";
import type { EngineQuestion } from "../src/content/questions";
import { hashPassword, newToken, verifyPassword } from "./passwords";

const prisma = new PrismaClient();
const COOKIE = "sitewise_session";

function send(res: ServerResponse, status: number, body: unknown, extra?: Record<string, string>) {
  res.statusCode = status;
  for (const [key, value] of Object.entries(extra ?? {})) res.setHeader(key, value);
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(body));
}

function cookie(req: IncomingMessage, name: string): string {
  const raw = req.headers.cookie ?? "";
  const hit = raw.split(";").map((part) => part.trim()).find((part) => part.startsWith(`${name}=`));
  return hit ? decodeURIComponent(hit.slice(name.length + 1)) : "";
}

function readBody(req: IncomingMessage): Promise<Record<string, unknown>> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on("data", (chunk) => chunks.push(Buffer.from(chunk)));
    req.on("end", () => {
      const text = Buffer.concat(chunks).toString("utf8");
      if (!text) {
        resolve({});
        return;
      }
      try {
        resolve(JSON.parse(text) as Record<string, unknown>);
      } catch (error) {
        reject(error);
      }
    });
    req.on("error", reject);
  });
}

async function currentUser(req: IncomingMessage) {
  const token = cookie(req, COOKIE);
  if (!token) return null;
  const session = await prisma.session.findUnique({
    where: { token },
    include: { user: { include: { profile: true, admin: true } } },
  });
  if (!session || session.expiresAt.getTime() < Date.now()) return null;
  return session.user;
}

function sessionCookie(token: string) {
  return `${COOKIE}=${token}; HttpOnly; Path=/; SameSite=Lax; Max-Age=1209600`;
}

function clearCookie() {
  return `${COOKIE}=; HttpOnly; Path=/; SameSite=Lax; Max-Age=0`;
}

function slug(value: string) {
  const next = value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  return next || `module-${Date.now()}`;
}

function lessonBlock(row: { id: string; title: string; body: string; jurisdictionId: string }): Block {
  return {
    type: "lesson",
    id: row.id,
    phase: "learn",
    xpKind: "lesson",
    jurisdiction: row.jurisdictionId as TrainingModule["jurisdiction"],
    title: row.title,
    paragraphs: row.body.split(/\n+/).filter(Boolean),
  };
}

function questionBlock(row: { id: string; prompt: string; payload: string }): Block {
  const question = JSON.parse(row.payload) as EngineQuestion;
  question.id = row.id;
  question.prompt = question.prompt || row.prompt;
  return {
    type: "engine",
    id: row.id,
    phase: "practice",
    xpKind: "practice",
    title: row.prompt,
    question,
  };
}

function scenarioBlock(row: { id: string; speaker: string; line: string; payload: string }): Block {
  const payload = JSON.parse(row.payload) as {
    choices: { id: string; label: string; correct: boolean; feedback: string }[];
  };
  return {
    type: "dialogue",
    id: row.id,
    phase: "play",
    xpKind: "game",
    speaker: row.speaker,
    line: row.line,
    dimension: "decision",
    choices: payload.choices ?? [],
  };
}

async function extraBlocks(moduleId: string): Promise<Block[]> {
  const [lessons, questions, scenarios] = await Promise.all([
    prisma.lesson.findMany({ where: { moduleId, published: true }, orderBy: { position: "asc" } }),
    prisma.question.findMany({ where: { moduleId, published: true }, orderBy: { position: "asc" } }),
    prisma.scenario.findMany({ where: { moduleId, published: true } }),
  ]);
  return [
    ...lessons.map(lessonBlock),
    ...questions.map(questionBlock),
    ...scenarios.map(scenarioBlock),
  ];
}

async function catalogPayload() {
  const rows = await prisma.module.findMany({ include: { jurisdiction: true } });
  const overrides = rows.map((row) => ({
    id: row.id,
    title: row.title,
    mapLabel: row.mapLabel,
    description: row.description,
    completionXp: row.completionXp,
    passingScore: row.passingScore,
    published: row.published,
    jurisdictionId: row.jurisdictionId,
    warnings: row.warnings,
    createdInAdmin: row.createdInAdmin,
    estimatedMinutes: row.estimatedMinutes,
  }));
  const blocks: Record<string, Block[]> = {};
  const created: TrainingModule[] = [];
  const sourceRows = await prisma.source.findMany();
  const sourceMap = new Map<string, SourceRef[]>();
  for (const source of sourceRows) {
    if (!source.moduleId) continue;
    const list = sourceMap.get(source.moduleId) ?? [];
    list.push({
      sourceTitle: source.sourceTitle,
      organization: source.organization,
      url: source.url,
      jurisdiction: source.jurisdiction,
      lastReviewed: source.lastReviewed,
      contentVersion: source.contentVersion,
      sourceReference: source.id,
    });
    sourceMap.set(source.moduleId, list);
  }
  for (const row of rows) {
    const extra = await extraBlocks(row.id);
    if (row.createdInAdmin) {
      created.push({
        id: row.id,
        title: row.title,
        mapLabel: row.mapLabel,
        description: row.description,
        estimatedMinutes: row.estimatedMinutes,
        difficulty: row.difficulty === "Field" || row.difficulty === "Core" ? row.difficulty : "Starter",
        completionXp: row.completionXp,
        passingScore: row.passingScore,
        jurisdiction: row.jurisdictionId as TrainingModule["jurisdiction"],
        warnings: row.warnings ? (row.warnings.split(",").filter(Boolean) as TrainingModule["warnings"]) : [],
        objectives: ["Practise the lesson your admin published."],
        blocks: extra,
        sources: sourceMap.get(row.id) ?? [],
      });
    } else if (extra.length) {
      blocks[row.id] = extra;
    }
  }
  return { overrides, blocks, created, sources: Object.fromEntries(sourceMap) };
}

async function audit(actorId: string, action: string, target: string, detail = "") {
  await prisma.auditLog.create({ data: { actorId, action, target, detail } });
}

export async function handleApi(req: IncomingMessage, res: ServerResponse) {
  const url = new URL(req.url ?? "/", "http://sitewise.local");
  const route = url.pathname;
  const method = req.method ?? "GET";
  try {
    if (route === "/api/health") {
      send(res, 200, { ok: true });
      return;
    }

    if (route === "/api/auth/register" && method === "POST") {
      const body = await readBody(req);
      const email = String(body.email ?? "").trim().toLowerCase();
      const name = String(body.name ?? "").trim();
      const password = String(body.password ?? "");
      const jurisdiction = String(body.jurisdiction ?? "ALBERTA");
      const crewRole = String(body.crewRole ?? "new");
      if (!email || !name || password.length < 8) {
        send(res, 400, { error: "Name, email, and a password of at least 8 characters are required." });
        return;
      }
      const existing = await prisma.user.findUnique({ where: { email } });
      if (existing) {
        send(res, 409, { error: "That email already has an account. Sign in instead." });
        return;
      }
      const user = await prisma.user.create({
        data: {
          email,
          name,
          passwordHash: hashPassword(password),
          role: "learner",
          profile: { create: { displayName: name, jurisdiction, crewRole } },
        },
      });
      const token = newToken();
      await prisma.session.create({
        data: { token, userId: user.id, expiresAt: new Date(Date.now() + 14 * 86400000) },
      });
      send(res, 201, { id: user.id, email, name, role: "learner" }, { "Set-Cookie": sessionCookie(token) });
      return;
    }

    if (route === "/api/auth/login" && method === "POST") {
      const body = await readBody(req);
      const email = String(body.email ?? "").trim().toLowerCase();
      const password = String(body.password ?? "");
      const user = await prisma.user.findUnique({ where: { email }, include: { profile: true } });
      if (!user || !verifyPassword(password, user.passwordHash)) {
        send(res, 401, { error: "Email or password is wrong." });
        return;
      }
      const token = newToken();
      await prisma.session.create({
        data: { token, userId: user.id, expiresAt: new Date(Date.now() + 14 * 86400000) },
      });
      send(res, 200, { id: user.id, email: user.email, name: user.name, role: user.role, profile: user.profile }, {
        "Set-Cookie": sessionCookie(token),
      });
      return;
    }

    if (route === "/api/auth/logout" && method === "POST") {
      const token = cookie(req, COOKIE);
      if (token) await prisma.session.deleteMany({ where: { token } });
      send(res, 200, { ok: true }, { "Set-Cookie": clearCookie() });
      return;
    }

    if (route === "/api/auth/me" && method === "GET") {
      const user = await currentUser(req);
      if (!user) {
        send(res, 401, { error: "Sign in required." });
        return;
      }
      send(res, 200, { id: user.id, email: user.email, name: user.name, role: user.role, profile: user.profile });
      return;
    }

    if (route === "/api/catalog" && method === "GET") {
      send(res, 200, await catalogPayload());
      return;
    }

    if (route === "/api/sync" && method === "POST") {
      const user = await currentUser(req);
      if (!user) {
        send(res, 401, { error: "Sign in required." });
        return;
      }
      const body = await readBody(req);
      const jurisdiction = String(body.jurisdiction ?? user.profile?.jurisdiction ?? "ALBERTA");
      const crewRole = String(body.crewRole ?? user.profile?.crewRole ?? "new");
      await prisma.profile.upsert({
        where: { userId: user.id },
        update: { jurisdiction, crewRole, displayName: user.name },
        create: { userId: user.id, jurisdiction, crewRole, displayName: user.name },
      });
      const modules = (body.modules ?? {}) as Record<string, {
        cursor?: number;
        completed?: boolean;
        seconds?: number;
        answered?: { prompt: string; correct: boolean; feedback: string; dimension: string }[];
      }>;
      for (const [moduleId, save] of Object.entries(modules)) {
        const exists = await prisma.module.findUnique({ where: { id: moduleId } });
        if (!exists) continue;
        const answers = save.answered ?? [];
        const total = answers.length;
        const correct = answers.filter((item) => item.correct).length;
        const score = total ? Math.round((correct / total) * 100) : 0;
        await prisma.progress.upsert({
          where: { userId_moduleId: { userId: user.id, moduleId } },
          update: {
            cursor: save.cursor ?? 0,
            completed: Boolean(save.completed),
            seconds: save.seconds ?? 0,
            score,
          },
          create: {
            userId: user.id,
            moduleId,
            cursor: save.cursor ?? 0,
            completed: Boolean(save.completed),
            seconds: save.seconds ?? 0,
            score,
          },
        });
        for (const answer of answers) {
          await prisma.answer.upsert({
            where: { userId_moduleId_prompt: { userId: user.id, moduleId, prompt: answer.prompt } },
            update: {},
            create: {
              userId: user.id,
              moduleId,
              prompt: answer.prompt,
              correct: answer.correct,
              feedback: answer.feedback,
              dimension: answer.dimension,
            },
          });
        }
      }
      send(res, 200, { ok: true });
      return;
    }

    if (route === "/api/sync" && method === "GET") {
      const user = await currentUser(req);
      if (!user) {
        send(res, 401, { error: "Sign in required." });
        return;
      }
      const progress = await prisma.progress.findMany({ where: { userId: user.id } });
      const answers = await prisma.answer.findMany({ where: { userId: user.id } });
      send(res, 200, { profile: user.profile, progress, answers });
      return;
    }

    if (route === "/api/certificates" && method === "POST") {
      const user = await currentUser(req);
      if (!user) {
        send(res, 401, { error: "Sign in required." });
        return;
      }
      const body = await readBody(req);
      const id = String(body.id ?? "");
      if (!id.startsWith("SW-")) {
        send(res, 400, { error: "Record id is missing." });
        return;
      }
      const saved = await prisma.certificateRecord.upsert({
        where: { id },
        update: {},
        create: {
          id,
          userId: user.id,
          learnerName: String(body.learnerName ?? user.name),
          course: String(body.course ?? "SiteWise"),
          modules: String(body.modules ?? ""),
          completedOn: String(body.completedOn ?? ""),
          score: Number(body.score ?? 0),
          version: String(body.version ?? "1.0.0"),
          jurisdiction: String(body.jurisdiction ?? "CANADA"),
        },
      });
      send(res, 200, saved);
      return;
    }

    const user = await currentUser(req);
    if (!route.startsWith("/api/admin")) {
      send(res, 404, { error: "Not found." });
      return;
    }
    if (!user || user.role !== "admin") {
      send(res, 401, { error: "Admin sign-in required." });
      return;
    }

    if (route === "/api/admin/summary" && method === "GET") {
      const [learners, modules, questions, scenarios, versions] = await Promise.all([
        prisma.user.count({ where: { role: "learner" } }),
        prisma.module.count(),
        prisma.question.count(),
        prisma.scenario.count(),
        prisma.contentVersion.findMany({ orderBy: { publishedAt: "desc" } }),
      ]);
      send(res, 200, { learners, modules, questions, scenarios, versions });
      return;
    }

    if (route === "/api/admin/users" && method === "GET") {
      const users = await prisma.user.findMany({
        include: { profile: true, progress: true },
        orderBy: { createdAt: "desc" },
      });
      send(res, 200, users.map((item) => ({
        id: item.id,
        email: item.email,
        name: item.name,
        role: item.role,
        jurisdiction: item.profile?.jurisdiction ?? "",
        modulesCompleted: item.progress.filter((row) => row.completed).length,
        seconds: item.progress.reduce((sum, row) => sum + row.seconds, 0),
      })));
      return;
    }

    if (route === "/api/admin/modules" && method === "GET") {
      send(res, 200, await prisma.module.findMany({ orderBy: { title: "asc" } }));
      return;
    }

    if (route === "/api/admin/modules" && method === "POST") {
      const body = await readBody(req);
      const title = String(body.title ?? "").trim();
      if (!title) {
        send(res, 400, { error: "A module needs a title." });
        return;
      }
      const id = slug(title);
      const created = await prisma.module.create({
        data: {
          id,
          title,
          mapLabel: String(body.mapLabel ?? title),
          description: String(body.description ?? ""),
          estimatedMinutes: Number(body.estimatedMinutes ?? 5),
          difficulty: "Starter",
          completionXp: Number(body.completionXp ?? 500),
          passingScore: Number(body.passingScore ?? 70),
          jurisdictionId: String(body.jurisdictionId ?? "CANADA"),
          published: Boolean(body.published),
          warnings: String(body.warnings ?? ""),
          createdInAdmin: true,
          versionId: "version-1",
        },
      });
      await audit(user.id, "create-module", id, title);
      send(res, 201, created);
      return;
    }

    if (route.startsWith("/api/admin/modules/") && method === "PATCH") {
      const id = route.slice("/api/admin/modules/".length);
      const body = await readBody(req);
      const updated = await prisma.module.update({
        where: { id },
        data: {
          title: body.title ? String(body.title) : undefined,
          description: body.description !== undefined ? String(body.description) : undefined,
          completionXp: body.completionXp !== undefined ? Number(body.completionXp) : undefined,
          passingScore: body.passingScore !== undefined ? Number(body.passingScore) : undefined,
          jurisdictionId: body.jurisdictionId ? String(body.jurisdictionId) : undefined,
          published: body.published !== undefined ? Boolean(body.published) : undefined,
          warnings: body.warnings !== undefined ? String(body.warnings) : undefined,
          estimatedMinutes: body.estimatedMinutes !== undefined ? Number(body.estimatedMinutes) : undefined,
        },
      });
      await audit(user.id, "edit-module", id);
      send(res, 200, updated);
      return;
    }

    if (route === "/api/admin/lessons" && method === "POST") {
      const body = await readBody(req);
      const created = await prisma.lesson.create({
        data: {
          moduleId: String(body.moduleId),
          title: String(body.title ?? "Lesson"),
          body: String(body.body ?? ""),
          minutes: Number(body.minutes ?? 5),
          jurisdictionId: String(body.jurisdictionId ?? "CANADA"),
          published: true,
        },
      });
      await audit(user.id, "create-lesson", created.id, created.title);
      send(res, 201, created);
      return;
    }

    if (route === "/api/admin/lessons" && method === "GET") {
      send(res, 200, await prisma.lesson.findMany({ orderBy: { position: "asc" } }));
      return;
    }

    if (route === "/api/admin/questions" && method === "GET") {
      send(res, 200, await prisma.question.findMany({ orderBy: { position: "asc" } }));
      return;
    }

    if (route === "/api/admin/questions" && method === "POST") {
      const body = await readBody(req);
      const payload = body.payload as EngineQuestion;
      const created = await prisma.question.create({
        data: {
          moduleId: String(body.moduleId),
          prompt: String(payload?.prompt ?? body.prompt ?? ""),
          type: String(payload?.type ?? "multiple-choice"),
          payload: JSON.stringify(payload),
          difficulty: Number(payload?.difficulty ?? 1),
          published: true,
          options: {
            create: (payload?.options ?? []).map((option, index) => ({
              label: option.label,
              correct: option.correct,
              position: index,
            })),
          },
        },
      });
      await audit(user.id, "create-question", created.id, created.prompt);
      send(res, 201, created);
      return;
    }

    if (route === "/api/admin/scenarios" && method === "GET") {
      send(res, 200, await prisma.scenario.findMany());
      return;
    }

    if (route === "/api/admin/scenarios" && method === "POST") {
      const body = await readBody(req);
      const choices = (body.choices ?? []) as { id: string; label: string; correct: boolean; feedback: string }[];
      const created = await prisma.scenario.create({
        data: {
          moduleId: String(body.moduleId),
          speaker: String(body.speaker ?? "Maya"),
          line: String(body.line ?? ""),
          payload: JSON.stringify({ choices }),
          published: true,
          choices: {
            create: choices.map((choice) => ({
              label: choice.label,
              correct: choice.correct,
              feedback: choice.feedback,
            })),
          },
        },
      });
      await audit(user.id, "create-scenario", created.id);
      send(res, 201, created);
      return;
    }

    if (route === "/api/admin/sources" && method === "POST") {
      const body = await readBody(req);
      const created = await prisma.source.create({
        data: {
          moduleId: String(body.moduleId),
          sourceTitle: String(body.sourceTitle ?? ""),
          organization: String(body.organization ?? ""),
          url: String(body.url ?? ""),
          jurisdiction: String(body.jurisdiction ?? "Canada"),
          lastReviewed: String(body.lastReviewed ?? new Date().toISOString().slice(0, 10)),
          contentVersion: String(body.contentVersion ?? "1.0.0"),
        },
      });
      await audit(user.id, "add-source", created.id, created.sourceTitle);
      send(res, 201, created);
      return;
    }

    if (route === "/api/admin/upload" && method === "POST") {
      const body = await readBody(req);
      const name = String(body.name ?? "image.png").replace(/[^a-zA-Z0-9._-]/g, "");
      const data = String(body.dataUrl ?? "");
      const match = data.match(/^data:image\/(png|jpeg|jpg|webp);base64,(.+)$/);
      if (!match) {
        send(res, 400, { error: "Upload a PNG, JPEG, or WebP image." });
        return;
      }
      const buffer = Buffer.from(match[2], "base64");
      if (buffer.length > 1_500_000) {
        send(res, 400, { error: "Image must be under 1.5 MB." });
        return;
      }
      const folder = path.resolve("public/uploads");
      mkdirSync(folder, { recursive: true });
      const file = `${Date.now()}-${name}`;
      writeFileSync(path.join(folder, file), buffer);
      await audit(user.id, "upload-image", file);
      send(res, 201, { url: `/uploads/${file}` });
      return;
    }

    if (route === "/api/admin/progress" && method === "GET") {
      send(res, 200, await prisma.progress.findMany({ include: { user: true, module: true } }));
      return;
    }

    if (route === "/api/admin/versions" && method === "GET") {
      send(res, 200, await prisma.contentVersion.findMany({ orderBy: { publishedAt: "desc" } }));
      return;
    }

    if (route === "/api/admin/versions" && method === "POST") {
      const body = await readBody(req);
      const created = await prisma.contentVersion.create({
        data: { label: String(body.label ?? "1.0.1"), notes: String(body.notes ?? "") },
      });
      await audit(user.id, "content-version", created.id, created.label);
      send(res, 201, created);
      return;
    }

    if (route === "/api/admin/analytics" && method === "GET") {
      const learners = await prisma.user.findMany({ where: { role: "learner" }, include: { progress: true } });
      const moduleRows = await prisma.module.findMany({ where: { published: true, createdInAdmin: false } });
      const coreIds = moduleRows.map((row) => row.id);
      const finished = learners.filter((learner) => coreIds.every((id) => learner.progress.some((row) => row.moduleId === id && row.completed))).length;
      const answers = await prisma.answer.findMany();
      const byPrompt = new Map<string, { correct: number; total: number }>();
      const byModule = new Map<string, { correct: number; total: number }>();
      let hazardMisses = new Map<string, number>();
      let whmis = { correct: 0, total: 0 };
      for (const answer of answers) {
        const prompt = byPrompt.get(answer.prompt) ?? { correct: 0, total: 0 };
        prompt.total += 1;
        if (answer.correct) prompt.correct += 1;
        byPrompt.set(answer.prompt, prompt);
        const moduleScore = byModule.get(answer.moduleId) ?? { correct: 0, total: 0 };
        moduleScore.total += 1;
        if (answer.correct) moduleScore.correct += 1;
        byModule.set(answer.moduleId, moduleScore);
        if (answer.dimension === "hazard" && !answer.correct) {
          hazardMisses.set(answer.prompt, (hazardMisses.get(answer.prompt) ?? 0) + 1);
        }
        if (answer.moduleId === "whmis") {
          whmis.total += 1;
          if (answer.correct) whmis.correct += 1;
        }
      }
      const difficult = [...byPrompt.entries()]
        .filter(([, value]) => value.total > 0)
        .map(([prompt, value]) => ({ prompt, missed: value.total - value.correct, total: value.total, missRate: Math.round(((value.total - value.correct) / value.total) * 100) }))
        .sort((a, b) => b.missRate - a.missRate)
        .slice(0, 8);
      const moduleScores = [...byModule.entries()].map(([moduleId, value]) => ({
        moduleId,
        average: value.total ? Math.round((value.correct / value.total) * 100) : 0,
        answers: value.total,
      }));
      const dropoff = moduleRows.map((row) => {
        const started = learners.filter((learner) => learner.progress.some((item) => item.moduleId === row.id && item.seconds > 0)).length;
        const done = learners.filter((learner) => learner.progress.some((item) => item.moduleId === row.id && item.completed)).length;
        return { moduleId: row.id, title: row.title, started, done, left: Math.max(0, started - done) };
      });
      send(res, 200, {
        learners: learners.length,
        completionRate: learners.length ? Math.round((finished / learners.length) * 100) : 0,
        moduleScores,
        difficult,
        hazardMisses: [...hazardMisses.entries()].map(([prompt, count]) => ({ prompt, count })).sort((a, b) => b.count - a.count).slice(0, 8),
        whmis: { average: whmis.total ? Math.round((whmis.correct / whmis.total) * 100) : 0, answers: whmis.total },
        dropoff,
      });
      return;
    }

    send(res, 404, { error: "Not found." });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Server error";
    send(res, 500, { error: message });
  }
}
