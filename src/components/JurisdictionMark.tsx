import {
  asJurisdictionList,
  jurisdictionHeading,
  jurisdictionLabel,
  type JurisdictionCode,
  type JurisdictionTag,
  type LocalNote,
} from "../content/jurisdiction";

export function JurisdictionMark({ tag }: { tag?: JurisdictionTag }) {
  const heading = jurisdictionHeading(tag);
  const codes = asJurisdictionList(tag).filter((code) => code !== "CANADA");
  return (
    <p className="jurisdiction">
      <strong>{codes.length ? codes.map((code) => jurisdictionLabel(code)).join(", ") : "Canada"}</strong>
      {heading}
    </p>
  );
}

export function JurisdictionClosed({
  tag,
  learner,
}: {
  tag?: JurisdictionTag;
  learner: JurisdictionCode | null;
}) {
  const writtenFor = asJurisdictionList(tag)
    .filter((code) => code !== "CANADA")
    .map((code) => jurisdictionLabel(code))
    .join(" and ");
  return (
    <div className="panel stack">
      <JurisdictionMark tag={tag} />
      <p>
        This part is written for {writtenFor}. Your profile is {jurisdictionLabel(learner)}, so the lesson stays closed here.
        The general Canadian parts of this module stay open.
      </p>
    </div>
  );
}

export function LocalNotes({ notes }: { notes: LocalNote[] }) {
  if (!notes.length) return null;
  return (
    <div className="stack">
      {notes.map((note) => (
        <div key={`${jurisdictionHeading(note.jurisdiction)}-${note.body.slice(0, 24)}`} className="stack">
          <JurisdictionMark tag={note.jurisdiction} />
          <p>{note.body}</p>
        </div>
      ))}
    </div>
  );
}
