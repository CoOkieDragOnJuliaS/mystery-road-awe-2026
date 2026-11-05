import type { NotesStore, Evidence } from "../../../types/domain.ts";

/*
 * Exercise 5 Demo 1 - building static Notes list component
 */

interface NotesListProps {
  notes: NotesStore;
  evidenceItems: Evidence[];
}

export function NotesList({ notes, evidenceItems }: NotesListProps) {
  //changing from state.getAllEvidence().forEach((evidenceItem, index) => {
  // const note = notesStore[evidenceItem.id]; to .filter() method
  const notesWithEvidence = evidenceItems.filter((item) => notes[item.id]);

  //Added the .length === 0, because I got no feedback
  return (
    <div id="noteslist">
      {notesWithEvidence.length === 0 ? (
        <p>No notes loaded yet.</p>
      ) : (
        notesWithEvidence.map((item) => (
          <div key={item.id} className="mini-list-item">
            <h4>{item.title}</h4>
            <p>{notes[item.id]}</p>
          </div>
        ))
      )}
    </div>
  );
}
