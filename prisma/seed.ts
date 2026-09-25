import { PrismaClient } from "@prisma/client";
import { BADGES } from "../src/content/badges";
import { MODULES } from "../src/content/catalog";
import { JURISDICTIONS } from "../src/content/jurisdiction";
import { hashPassword } from "../server/passwords";

const prisma = new PrismaClient();

const ADMIN_EMAIL = "admin@sitewise.test";
const ADMIN_PASSWORD = "Northline-yard";

async function main() {
  for (const item of JURISDICTIONS) {
    await prisma.jurisdiction.upsert({
      where: { id: item.code },
      update: { label: item.label },
      create: { id: item.code, label: item.label },
    });
  }

  const version = await prisma.contentVersion.upsert({
    where: { id: "version-1" },
    update: {},
    create: {
      id: "version-1",
      label: "1.0.0",
      notes: "First published SiteWise training version.",
    },
  });

  for (const badge of BADGES) {
    await prisma.badge.upsert({
      where: { id: badge.id },
      update: { name: badge.name, detail: badge.detail },
      create: { id: badge.id, name: badge.name, detail: badge.detail },
    });
  }

  for (const module of MODULES) {
    const jurisdictionId = Array.isArray(module.jurisdiction) ? module.jurisdiction[0] : module.jurisdiction;
    await prisma.module.upsert({
      where: { id: module.id },
      update: {
        title: module.title,
        mapLabel: module.mapLabel,
        description: module.description,
        estimatedMinutes: module.estimatedMinutes,
        difficulty: module.difficulty,
        completionXp: module.completionXp,
        passingScore: module.passingScore ?? 70,
        jurisdictionId,
        warnings: (module.warnings ?? []).join(","),
        versionId: version.id,
      },
      create: {
        id: module.id,
        title: module.title,
        mapLabel: module.mapLabel,
        description: module.description,
        estimatedMinutes: module.estimatedMinutes,
        difficulty: module.difficulty,
        completionXp: module.completionXp,
        passingScore: module.passingScore ?? 70,
        jurisdictionId,
        published: true,
        warnings: (module.warnings ?? []).join(","),
        versionId: version.id,
        createdInAdmin: false,
      },
    });
    for (const source of module.sources) {
      const existing = await prisma.source.findFirst({ where: { moduleId: module.id, url: source.url } });
      if (existing) continue;
      await prisma.source.create({
        data: {
          moduleId: module.id,
          sourceTitle: source.sourceTitle,
          organization: source.organization,
          url: source.url,
          jurisdiction: source.jurisdiction,
          lastReviewed: source.lastReviewed,
          contentVersion: source.contentVersion,
        },
      });
    }
  }

  const passwordHash = hashPassword(ADMIN_PASSWORD);
  const admin = await prisma.user.upsert({
    where: { email: ADMIN_EMAIL },
    update: { passwordHash, role: "admin", name: "SiteWise Admin" },
    create: {
      email: ADMIN_EMAIL,
      name: "SiteWise Admin",
      passwordHash,
      role: "admin",
    },
  });
  await prisma.adminUser.upsert({
    where: { userId: admin.id },
    update: {},
    create: { userId: admin.id, title: "Content admin" },
  });
  await prisma.profile.upsert({
    where: { userId: admin.id },
    update: {},
    create: { userId: admin.id, displayName: "SiteWise Admin", crewRole: "supervisor", jurisdiction: "ALBERTA" },
  });

  console.log(`Admin ready: ${ADMIN_EMAIL} / ${ADMIN_PASSWORD}`);
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
