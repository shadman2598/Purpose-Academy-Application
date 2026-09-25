import { useEffect, useState, type FormEvent } from "react";
import { describeBlock } from "../content/play";
import { api } from "../lib/api";
import { useContent } from "../state/content";

interface LessonRow {
  id: string;
  moduleId: string;
  title: string;
}
interface QuestionRow {
  id: string;
  moduleId: string;
  prompt: string;
  type: string;
}
interface ScenarioRow {
  id: string;
  moduleId: string;
  speaker: string;
  line: string;
}

export function ContentStudio() {
  const { modules, refresh } = useContent();
  const [lessons, setLessons] = useState<LessonRow[]>([]);
  const [questions, setQuestions] = useState<QuestionRow[]>([]);
  const [scenarios, setScenarios] = useState<ScenarioRow[]>([]);
  const [moduleId, setModuleId] = useState(modules[0]?.id ?? "whmis");
  const [notice, setNotice] = useState("");

  async function reload() {
    const [lessonRows, questionRows, scenarioRows] = await Promise.all([
      api<LessonRow[]>("/api/admin/lessons"),
      api<QuestionRow[]>("/api/admin/questions"),
      api<ScenarioRow[]>("/api/admin/scenarios"),
    ]);
    setLessons(lessonRows);
    setQuestions(questionRows);
    setScenarios(scenarioRows);
    refresh();
  }

  useEffect(() => {
    void reload().catch(() => setNotice("The studio could not load the content lists."));
  }, []);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const title = String(form.get("title") ?? "");
    const body = String(form.get("body") ?? "");
    const prompt = String(form.get("prompt") ?? "");
    const correct = String(form.get("correct") ?? "");
    const wrong = String(form.get("wrong") ?? "");
    const explanation = String(form.get("explanation") ?? "");
    const line = String(form.get("line") ?? "");
    const sourceTitle = String(form.get("sourceTitle") ?? "");
    const sourceUrl = String(form.get("sourceUrl") ?? "");
    if (!title && !prompt && !line && !(sourceTitle && sourceUrl)) {
      setNotice("Add a lesson title, a scenario line, a question, or a source before you publish.");
      return;
    }
    setNotice("");
    if (title) {
      await api("/api/admin/lessons", {
        method: "POST",
        body: JSON.stringify({ moduleId, title, body, minutes: 5, jurisdictionId: "CANADA" }),
      });
    }
    if (line) {
      await api("/api/admin/scenarios", {
        method: "POST",
        body: JSON.stringify({
          moduleId,
          speaker: "Sarah",
          line,
          choices: [
            { id: "a", label: correct || "The safer call", correct: true, feedback: explanation || "That matches the lesson." },
            { id: "b", label: wrong || "Skip it", correct: false, feedback: explanation || "That leaves the hazard in the work." },
          ],
        }),
      });
    }
    if (prompt) {
      await api("/api/admin/questions", {
        method: "POST",
        body: JSON.stringify({
          moduleId,
          payload: {
            type: "multiple-choice",
            prompt,
            feedback: explanation,
            options: [
              { id: "a", label: correct || "The safer call", correct: true, feedback: explanation || "Good call." },
              { id: "b", label: wrong || "Skip it", correct: false, feedback: explanation || "Not quite." },
            ],
          },
        }),
      });
    }
    if (sourceTitle && sourceUrl) {
      const created = await api<{ id: string }>("/api/admin/sources", {
        method: "POST",
        body: JSON.stringify({
          moduleId,
          sourceTitle,
          organization: String(form.get("organization") ?? ""),
          url: sourceUrl,
          jurisdiction: "Canada",
          lastReviewed: new Date().toISOString().slice(0, 10),
          contentVersion: "1.0",
        }),
      });
      setNotice(`Saved. Source reference ${created.id}.`);
    } else {
      setNotice("Saved. The new pieces are on the module.");
    }
    event.currentTarget.reset();
    await reload();
  }

  return (
    <div className="stack">
      <h3>Content studio</h3>
      <p>Module, then lesson, scenario, question, and source. Publishing here adds the piece to the live module. A completion already stored keeps its version.</p>
      {notice && <p role="status">{notice}</p>}
      {modules.map((module) => (
        <article key={module.id} className="panel">
          <h3>{module.title}</h3>
          <ul>
            {module.blocks.map((block) => {
              const step = describeBlock(block);
              return (
                <li key={block.id}>
                  {step.kind}: {step.name}
                </li>
              );
            })}
            {lessons
              .filter((lesson) => lesson.moduleId === module.id && !module.blocks.some((block) => block.id === lesson.id))
              .map((lesson) => (
                <li key={lesson.id}>Lesson: {lesson.title}</li>
              ))}
            {scenarios
              .filter((scenario) => scenario.moduleId === module.id && !module.blocks.some((block) => block.id === scenario.id))
              .map((scenario) => (
                <li key={scenario.id}>
                  Scenario · {scenario.speaker}: {scenario.line}
                </li>
              ))}
            {questions
              .filter((question) => question.moduleId === module.id && !module.blocks.some((block) => block.id === question.id))
              .map((question) => (
                <li key={question.id}>
                  Question · {question.type}: {question.prompt}
                </li>
              ))}
          </ul>
        </article>
      ))}
      <form className="panel stack" onSubmit={(event) => void onSubmit(event)}>
        <h3>Add to a module</h3>
        <label className="field">
          Module
          <select name="moduleId" value={moduleId} onChange={(event) => setModuleId(event.target.value)}>
            {modules.map((module) => (
              <option key={module.id} value={module.id}>
                {module.title}
              </option>
            ))}
          </select>
        </label>
        <label className="field">
          Lesson title
          <input name="title" />
        </label>
        <label className="field">
          Lesson
          <textarea name="body" />
        </label>
        <label className="field">
          Scenario line
          <textarea name="line" />
        </label>
        <label className="field">
          Question
          <textarea name="prompt" />
        </label>
        <label className="field">
          Correct answer
          <input name="correct" />
        </label>
        <label className="field">
          Other answer
          <input name="wrong" />
        </label>
        <label className="field">
          Explanation
          <textarea name="explanation" />
        </label>
        <label className="field">
          Source title
          <input name="sourceTitle" />
        </label>
        <label className="field">
          Organization
          <input name="organization" />
        </label>
        <label className="field">
          Source URL
          <input name="sourceUrl" />
        </label>
        <button className="btn btn-primary" type="submit">
          Publish
        </button>
      </form>
    </div>
  );
}
