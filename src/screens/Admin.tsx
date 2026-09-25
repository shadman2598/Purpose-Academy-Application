import { useEffect, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { JURISDICTIONS } from "../content/jurisdiction";
import { QUESTION_TYPES, SDS_TITLES, type EngineQuestion } from "../content/questions";
import { QuestionEngine, blankQuestion } from "../components/questions/QuestionEngine";
import { api } from "../lib/api";
import { useAuth } from "../state/auth";
import { useContent } from "../state/content";
import { ContentStudio } from "./Studio";

const TABS = ["Users", "Courses", "Modules", "Studio", "Questions", "Scenarios", "Progress", "Analytics", "Versions"] as const;

function LoginForm({ admin }: { admin?: boolean }) {
  const auth = useAuth();
  const [email, setEmail] = useState(admin ? "admin@sitewise.test" : "");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [mode, setMode] = useState<"in" | "up">(admin ? "in" : "in");
  const [error, setError] = useState("");

  async function submit(event: FormEvent) {
    event.preventDefault();
    setError("");
    try {
      if (mode === "up") {
        await api("/api/auth/register", {
          method: "POST",
          body: JSON.stringify({ email, password, name, jurisdiction: "ALBERTA", crewRole: "new" }),
        });
      } else {
        await api("/api/auth/login", { method: "POST", body: JSON.stringify({ email, password }) });
      }
      await auth.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign-in failed.");
    }
  }

  return (
    <form className="stack panel" onSubmit={submit}>
      <h2>{mode === "up" ? "Create account" : admin ? "Admin sign in" : "Sign in"}</h2>
      {admin && (
        <p className="muted">
          Local admin for this copy: admin@sitewise.test / Northline-yard. Change that password before this leaves your machine.
        </p>
      )}
      {mode === "up" && (
        <label className="field">
          Name
          <input value={name} onChange={(event) => setName(event.target.value)} required />
        </label>
      )}
      <label className="field">
        Email
        <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
      </label>
      <label className="field">
        Password
        <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} required minLength={8} />
      </label>
      {error && <p role="alert">{error}</p>}
      <button className="btn btn-primary" type="submit">
        {mode === "up" ? "Create account" : "Sign in"}
      </button>
      {!admin && (
        <button type="button" className="btn btn-text" onClick={() => setMode(mode === "in" ? "up" : "in")}>
          {mode === "in" ? "Need an account? Create one" : "Already have an account? Sign in"}
        </button>
      )}
    </form>
  );
}

export function SignInScreen() {
  const { user } = useAuth();
  if (user) {
    return (
      <div className="standalone">
        <div className="title-copy stack">
          <h2>Signed in as {user.name}</h2>
          <p>{user.email}</p>
          <Link className="btn btn-primary" to={user.role === "admin" ? "/admin" : "/home"}>
            Continue
          </Link>
        </div>
      </div>
    );
  }
  return (
    <div className="standalone">
      <div className="title-copy">
        <LoginForm />
        <Link to="/">Title screen</Link>
      </div>
    </div>
  );
}

export function AdminScreen() {
  const auth = useAuth();
  const content = useContent();
  const [tab, setTab] = useState<(typeof TABS)[number]>("Modules");
  const [data, setData] = useState<unknown>(null);
  const [error, setError] = useState("");
  const [question, setQuestion] = useState<EngineQuestion>(blankQuestion("multiple-choice"));
  const [moduleId, setModuleId] = useState("orientation");

  async function load(path: string) {
    setError("");
    try {
      setData(await api(path));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load.");
    }
  }

  useEffect(() => {
    if (!auth.user || auth.user.role !== "admin") return;
    const path =
      tab === "Users"
        ? "/api/admin/users"
        : tab === "Courses" || tab === "Modules"
          ? "/api/admin/modules"
          : tab === "Questions"
            ? "/api/admin/questions"
            : tab === "Scenarios"
              ? "/api/admin/scenarios"
              : tab === "Studio"
                ? ""
                : tab === "Progress"
                ? "/api/admin/progress"
                : tab === "Analytics"
                  ? "/api/admin/analytics"
                  : "/api/admin/versions";
    if (path) void load(path);
  }, [tab, auth.user]);

  if (!auth.ready) return <p>Checking your sign-in…</p>;
  if (!auth.user || auth.user.role !== "admin") {
    return (
      <div className="stack">
        <LoginForm admin />
      </div>
    );
  }

  const modules = Array.isArray(data) ? data : [];

  return (
    <div className="stack">
      <p className="kicker">Admin</p>
      <h2>Content desk</h2>
      <p>Signed in as {auth.user.email}. Changes publish to the training path on this machine.</p>
      <div className="jump" role="tablist" aria-label="Admin sections">
        {TABS.map((item) => (
          <button key={item} type="button" className={tab === item ? "on" : undefined} onClick={() => setTab(item)}>
            {item}
          </button>
        ))}
      </div>
      {error && <p role="alert">{error}</p>}

      {tab === "Users" && Array.isArray(data) && (
        <div className="stack">
          {data.map((user) => (
            <article key={user.id} className="panel">
              <strong>{user.name}</strong>
              <p>
                {user.email} · {user.role} · {user.jurisdiction || "No province yet"} · {user.modulesCompleted} modules done · {user.seconds}s on modules
              </p>
            </article>
          ))}
          {data.length === 0 && <p>No learner accounts yet.</p>}
        </div>
      )}

      {(tab === "Courses" || tab === "Modules") && Array.isArray(data) && (
        <div className="stack">
          <p>SiteWise is the course. Each card is a module. Unpublished modules stay off the training map.</p>
          <ModuleForm
            onCreated={async () => {
              await load("/api/admin/modules");
              content.refresh();
            }}
          />
          {modules.map((module) => (
            <ModuleEditor
              key={module.id}
              module={module}
              onSaved={async () => {
                await load("/api/admin/modules");
                content.refresh();
              }}
            />
          ))}
        </div>
      )}

      {tab === "Studio" && <ContentStudio />}

      {tab === "Questions" && (
        <div className="stack">
          <label className="field">
            Module
            <select value={moduleId} onChange={(event) => setModuleId(event.target.value)}>
              {content.modules.map((module) => (
                <option key={module.id} value={module.id}>
                  {module.title}
                </option>
              ))}
            </select>
          </label>
          <label className="field">
            Question type
            <select
              value={question.type}
              onChange={(event) => setQuestion(blankQuestion(event.target.value as EngineQuestion["type"]))}
            >
              {QUESTION_TYPES.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.label}
                </option>
              ))}
            </select>
          </label>
          <label className="field">
            Prompt
            <textarea value={question.prompt} onChange={(event) => setQuestion({ ...question, prompt: event.target.value })} />
          </label>
          <QuestionFields question={question} onChange={setQuestion} />
          <button
            type="button"
            className="btn btn-primary"
            onClick={async () => {
              await api("/api/admin/questions", { method: "POST", body: JSON.stringify({ moduleId, payload: question }) });
              content.refresh();
              await load("/api/admin/questions");
            }}
          >
            Publish question
          </button>
          <h3>Preview</h3>
          <QuestionEngine question={{ ...question, id: "preview" }} onAnswer={() => undefined} onReady={() => undefined} />
          {Array.isArray(data) &&
            data.map((row) => (
              <p key={row.id}>
                {row.type}: {row.prompt}
              </p>
            ))}
        </div>
      )}

      {tab === "Scenarios" && <ScenarioForm modules={content.modules} onSaved={() => content.refresh()} />}

      {tab === "Progress" && Array.isArray(data) && (
        <div className="stack">
          {data.map((row) => (
            <p key={row.id}>
              {row.user?.name ?? "Learner"} · {row.module?.title ?? row.moduleId} · {row.completed ? "Complete" : `Cursor ${row.cursor}`} · {row.score}% · {row.seconds}s
            </p>
          ))}
          {data.length === 0 && <p>No signed-in progress yet. Guest play stays on this device until someone signs in.</p>}
        </div>
      )}

      {tab === "Analytics" && data && typeof data === "object" && !Array.isArray(data) ? <AnalyticsView data={data as Analytics} /> : null}

      {tab === "Versions" && (
        <Versions
          rows={Array.isArray(data) ? data : []}
          onCreated={async () => load("/api/admin/versions")}
        />
      )}
      <button type="button" className="btn btn-ghost" onClick={() => void auth.logout()}>
        Sign out
      </button>
    </div>
  );
}

function ModuleForm({ onCreated }: { onCreated: () => Promise<void> }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [completionXp, setXp] = useState(500);
  const [passingScore, setPassing] = useState(70);
  const [jurisdictionId, setJurisdiction] = useState("CANADA");
  const [estimatedMinutes, setMinutes] = useState(5);
  return (
    <form
      className="panel stack"
      onSubmit={async (event) => {
        event.preventDefault();
        await api("/api/admin/modules", {
          method: "POST",
          body: JSON.stringify({ title, description, completionXp, passingScore, jurisdictionId, estimatedMinutes, published: true, warnings: "site-specific" }),
        });
        setTitle("");
        await onCreated();
      }}
    >
      <h3>Create module</h3>
      <label className="field">
        Title
        <input value={title} onChange={(event) => setTitle(event.target.value)} required />
      </label>
      <label className="field">
        Description
        <textarea value={description} onChange={(event) => setDescription(event.target.value)} />
      </label>
      <div className="grid-2">
        <label className="field">
          XP on completion
          <input type="number" value={completionXp} onChange={(event) => setXp(Number(event.target.value))} />
        </label>
        <label className="field">
          Passing score %
          <input type="number" value={passingScore} onChange={(event) => setPassing(Number(event.target.value))} />
        </label>
      </div>
      <label className="field">
        Minutes for this segment
        <input type="number" min={3} max={7} value={estimatedMinutes} onChange={(event) => setMinutes(Number(event.target.value))} />
      </label>
      <label className="field">
        Jurisdiction
        <select value={jurisdictionId} onChange={(event) => setJurisdiction(event.target.value)}>
          {JURISDICTIONS.map((item) => (
            <option key={item.code} value={item.code}>
              {item.label}
            </option>
          ))}
        </select>
      </label>
      <button className="btn btn-primary" type="submit">
        Create module
      </button>
    </form>
  );
}

function ModuleEditor({
  module,
  onSaved,
}: {
  module: {
    id: string;
    title: string;
    description: string;
    published: boolean;
    completionXp: number;
    passingScore: number;
    jurisdictionId: string;
    estimatedMinutes: number;
  };
  onSaved: () => Promise<void>;
}) {
  const [title, setTitle] = useState(module.title);
  const [description, setDescription] = useState(module.description);
  const [published, setPublished] = useState(module.published);
  const [completionXp, setXp] = useState(module.completionXp);
  const [passingScore, setPassing] = useState(module.passingScore);
  const [lessonTitle, setLessonTitle] = useState("");
  const [lessonBody, setLessonBody] = useState("");
  const [sourceTitle, setSourceTitle] = useState("");
  const [sourceUrl, setSourceUrl] = useState("");
  return (
    <article className="panel stack">
      <h3>{module.title}</h3>
      <label className="field">
        Title
        <input value={title} onChange={(event) => setTitle(event.target.value)} />
      </label>
      <label className="field">
        Description
        <textarea value={description} onChange={(event) => setDescription(event.target.value)} />
      </label>
      <label className="row">
        <input type="checkbox" checked={published} onChange={(event) => setPublished(event.target.checked)} />
        Published
      </label>
      <div className="grid-2">
        <label className="field">
          Completion XP
          <input type="number" value={completionXp} onChange={(event) => setXp(Number(event.target.value))} />
        </label>
        <label className="field">
          Passing score %
          <input type="number" value={passingScore} onChange={(event) => setPassing(Number(event.target.value))} />
        </label>
      </div>
      <button
        type="button"
        className="btn btn-primary"
        onClick={async () => {
          await api(`/api/admin/modules/${module.id}`, {
            method: "PATCH",
            body: JSON.stringify({ title, description, published, completionXp, passingScore }),
          });
          await onSaved();
        }}
      >
        Save module
      </button>
      <h3>Add a lesson</h3>
      <input value={lessonTitle} placeholder="Lesson title" onChange={(event) => setLessonTitle(event.target.value)} />
      <textarea value={lessonBody} placeholder="Short lesson. One idea per paragraph." onChange={(event) => setLessonBody(event.target.value)} />
      <button
        type="button"
        className="btn btn-ghost"
        onClick={async () => {
          await api("/api/admin/lessons", {
            method: "POST",
            body: JSON.stringify({ moduleId: module.id, title: lessonTitle, body: lessonBody, minutes: 5, jurisdictionId: "CANADA" }),
          });
          setLessonTitle("");
          setLessonBody("");
          await onSaved();
        }}
      >
        Add lesson
      </button>
      <h3>Add a source</h3>
      <input value={sourceTitle} placeholder="Source title" onChange={(event) => setSourceTitle(event.target.value)} />
      <input value={sourceUrl} placeholder="https://" onChange={(event) => setSourceUrl(event.target.value)} />
      <button
        type="button"
        className="btn btn-ghost"
        onClick={async () => {
          await api("/api/admin/sources", {
            method: "POST",
            body: JSON.stringify({ moduleId: module.id, sourceTitle, url: sourceUrl, organization: "Added by admin", jurisdiction: "Canada" }),
          });
          setSourceTitle("");
          setSourceUrl("");
        }}
      >
        Add source
      </button>
      <ImageUpload />
    </article>
  );
}

function ImageUpload() {
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");
  return (
    <div className="stack">
      <h3>Upload image</h3>
      <input
        type="file"
        accept="image/png,image/jpeg,image/webp"
        onChange={async (event) => {
          const file = event.target.files?.[0];
          if (!file) return;
          const reader = new FileReader();
          reader.onload = async () => {
            try {
              const saved = await api<{ url: string }>("/api/admin/upload", {
                method: "POST",
                body: JSON.stringify({ name: file.name, dataUrl: String(reader.result) }),
              });
              setUrl(saved.url);
              setError("");
            } catch (err) {
              setError(err instanceof Error ? err.message : "Upload failed.");
            }
          };
          reader.readAsDataURL(file);
        }}
      />
      {url && (
        <p>
          Image URL: <a href={url}>{url}</a>
        </p>
      )}
      {error && <p role="alert">{error}</p>}
    </div>
  );
}

function QuestionFields({ question, onChange }: { question: EngineQuestion; onChange: (question: EngineQuestion) => void }) {
  if (question.type === "ordering") {
    return (
      <label className="field">
        Correct order, one step per line
        <textarea
          value={(question.steps ?? []).join("\n")}
          onChange={(event) => onChange({ ...question, steps: event.target.value.split("\n").filter(Boolean) })}
        />
      </label>
    );
  }
  if (question.type === "matching") {
    return (
      <label className="field">
        Pairs, written as Left | Right
        <textarea
          value={(question.pairs ?? []).map((pair) => `${pair.left} | ${pair.right}`).join("\n")}
          onChange={(event) =>
            onChange({
              ...question,
              pairs: event.target.value
                .split("\n")
                .filter(Boolean)
                .map((line) => {
                  const [left, right] = line.split("|").map((part) => part.trim());
                  return { left: left ?? "", right: right ?? "" };
                }),
            })
          }
        />
      </label>
    );
  }
  if (question.type === "sds") {
    return (
      <label className="field">
        Heading that answers the prompt
        <select value={question.answerTitle} onChange={(event) => onChange({ ...question, answerTitle: event.target.value })}>
          {SDS_TITLES.map((title) => (
            <option key={title}>{title}</option>
          ))}
        </select>
      </label>
    );
  }
  if (question.type === "hazard" || question.type === "ppe" || question.type === "inspect") {
    return (
      <label className="field">
        Items, one per line. End a line with * if it should be selected.
        <textarea
          value={(question.items ?? []).map((item) => `${item.label}${item.hazard || item.required || item.sound ? " *" : ""}`).join("\n")}
          onChange={(event) =>
            onChange({
              ...question,
              items: event.target.value
                .split("\n")
                .filter(Boolean)
                .map((line, index) => {
                  const on = line.includes("*");
                  const label = line.replace("*", "").trim();
                  return {
                    id: `item-${index}`,
                    label,
                    hazard: question.type === "hazard" ? on : undefined,
                    required: question.type === "ppe" ? on : undefined,
                    sound: question.type === "inspect" ? on : undefined,
                  };
                }),
            })
          }
        />
      </label>
    );
  }
  return (
    <label className="field">
      Choices, one per line. Start the correct line with *.
      <textarea
        value={(question.options ?? []).map((option) => `${option.correct ? "* " : ""}${option.label}`).join("\n")}
        onChange={(event) =>
          onChange({
            ...question,
            options: event.target.value
              .split("\n")
              .filter(Boolean)
              .map((line, index) => {
                const correct = line.trim().startsWith("*");
                return {
                  id: `opt-${index}`,
                  label: line.replace(/^\*\s*/, ""),
                  correct,
                  feedback: correct ? "That’s the safer choice." : "Not the safer move. Read the prompt again.",
                };
              }),
          })
        }
      />
    </label>
  );
}

function ScenarioForm({ modules, onSaved }: { modules: { id: string; title: string }[]; onSaved: () => void }) {
  const [moduleId, setModuleId] = useState(modules[0]?.id ?? "orientation");
  const [speaker, setSpeaker] = useState("Sarah");
  const [line, setLine] = useState("");
  const [safe, setSafe] = useState("");
  const [unsafe, setUnsafe] = useState("");
  return (
    <form
      className="panel stack"
      onSubmit={async (event) => {
        event.preventDefault();
        await api("/api/admin/scenarios", {
          method: "POST",
          body: JSON.stringify({
            moduleId,
            speaker,
            line,
            choices: [
              { id: "safe", label: safe, correct: true, feedback: "That’s the safer choice." },
              { id: "unsafe", label: unsafe, correct: false, feedback: "That choice adds pressure. The safer line names the condition." },
            ],
          }),
        });
        setLine("");
        onSaved();
      }}
    >
      <h3>Create scenario</h3>
      <select value={moduleId} onChange={(event) => setModuleId(event.target.value)}>
        {modules.map((module) => (
          <option key={module.id} value={module.id}>
            {module.title}
          </option>
        ))}
      </select>
      <input value={speaker} onChange={(event) => setSpeaker(event.target.value)} />
      <textarea value={line} placeholder="What they say" onChange={(event) => setLine(event.target.value)} required />
      <input value={safe} placeholder="Safer reply" onChange={(event) => setSafe(event.target.value)} required />
      <input value={unsafe} placeholder="Unsafe reply" onChange={(event) => setUnsafe(event.target.value)} required />
      <button className="btn btn-primary" type="submit">
        Publish scenario
      </button>
    </form>
  );
}

interface Analytics {
  learners: number;
  completionRate: number;
  moduleScores: { moduleId: string; average: number; answers: number }[];
  difficult: { prompt: string; missRate: number; total: number }[];
  hazardMisses: { prompt: string; count: number }[];
  whmis: { average: number; answers: number };
  dropoff: { title: string; started: number; done: number; left: number }[];
}

function AnalyticsView({ data }: { data: Analytics }) {
  return (
    <div className="stack">
      <div className="grid-3">
        <div className="stat">
          <b>{data.learners}</b>
          Learners signed in
        </div>
        <div className="stat">
          <b>{data.completionRate}%</b>
          Finished every published core module
        </div>
        <div className="stat">
          <b>{data.whmis.answers ? `${data.whmis.average}%` : "—"}</b>
          WHMIS answers
        </div>
      </div>
      <h3>Average module score</h3>
      {data.moduleScores.length === 0 && <p>No answers stored yet.</p>}
      {data.moduleScores.map((row) => (
        <p key={row.moduleId}>
          {row.moduleId}: {row.average}% from {row.answers} answers
        </p>
      ))}
      <h3>Most difficult questions</h3>
      {data.difficult.map((row) => (
        <p key={row.prompt}>
          {row.missRate}% missed · {row.prompt}
        </p>
      ))}
      <h3>Most commonly missed hazards</h3>
      {data.hazardMisses.length === 0 && <p>No missed hazards stored yet.</p>}
      {data.hazardMisses.map((row) => (
        <p key={row.prompt}>
          {row.count} · {row.prompt}
        </p>
      ))}
      <h3>Module drop-off</h3>
      {data.dropoff.map((row) => (
        <p key={row.title}>
          {row.title}: {row.started} started, {row.done} finished, {row.left} left early
        </p>
      ))}
    </div>
  );
}

function Versions({ rows, onCreated }: { rows: { id: string; label: string; notes: string }[]; onCreated: () => Promise<void> }) {
  const [label, setLabel] = useState("1.1.0");
  const [notes, setNotes] = useState("");
  return (
    <div className="stack">
      <p>A new version label does not rewrite a completion already stored. Learner records keep the course version, content version, date, score, and jurisdiction from the day they finished.</p>
      {rows.map((row) => (
        <article key={row.id} className="panel">
          <strong>{row.label}</strong>
          <p>{row.notes}</p>
        </article>
      ))}
      <form
        className="panel stack"
        onSubmit={async (event) => {
          event.preventDefault();
          await api("/api/admin/versions", { method: "POST", body: JSON.stringify({ label, notes }) });
          await onCreated();
        }}
      >
        <h3>New content version</h3>
        <input value={label} onChange={(event) => setLabel(event.target.value)} />
        <textarea value={notes} onChange={(event) => setNotes(event.target.value)} />
        <button className="btn btn-primary" type="submit">
          Save version
        </button>
      </form>
    </div>
  );
}
