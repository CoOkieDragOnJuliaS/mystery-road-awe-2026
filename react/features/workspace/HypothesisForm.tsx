import { SubmitEvent, useState } from "react";
import type {
  EvidenceId,
  HypothesisDraft,
  Person,
  Evidence,
} from "../../../types/domain.ts";

/*
 * Exercise 5 Demo 1 - building static Hypothesis list component
 */

interface HypothesisFormProps {
  people: Person[];
  evidence: Evidence[];
  hypothesisDraft: HypothesisDraft;
  onSave: (draft: HypothesisDraft) => void;
}

export function HypothesisForm({
  people,
  evidence,
  hypothesisDraft,
  onSave,
}: HypothesisFormProps) {
  //Demo 2: one object keeps the related hypothesis fields together.
  const [draft, setDraft] = useState<HypothesisDraft>(hypothesisDraft);
  const [saved, setSaved] = useState(false);

  //Creates an object instead of mutating and sets the draft because hypothesis
  function updateDraft(changes: Partial<HypothesisDraft>): void {
    setDraft((current) => ({ ...current, ...changes }));
    setSaved(false);
  }

  //Receives react from the event
  function handleSubmit(event: SubmitEvent<HTMLFormElement>): void {
    //preventDefault cancels the event if possible (default action that belongs to the event will not occur)
    event.preventDefault();
    //onSave sends the current draft to parent element
    onSave(draft);
    setSaved(true);
  }

  return (
    // Exercise 5 - Demo 2 - form submit handler
    <form onSubmit={handleSubmit}>
      <div className="form-row">
        <label htmlFor="hypothesis-suspect">Possible Suspect</label>
        <select
          id="hypothesis-suspect"
          value={draft.suspectId}
          //Demo 2: controlled select updates the same draft that supplies value.
          onChange={(event) =>
            updateDraft({
              suspectId: event.target.value as HypothesisDraft["suspectId"],
            })
          }
        >
          <option value="">Select a person...</option>
          {people.map((person) => (
            <option key={person.id} value={person.id}>
              {person.name}
            </option>
          ))}
        </select>
      </div>

      <div className="form-row">
        <label htmlFor="hypothesis-evidence">Supporting evidence</label>
        <select
          id="hypothesis-evidence"
          multiple
          value={draft.evidenceIds}
          //Demo 2: selectedOptions becomes the controlled EvidenceId array.
          onChange={(event) => {
            const evidenceIds = Array.from(event.target.selectedOptions)
              .map((option) => option.value as EvidenceId)
              .filter((id) => evidence.some((item) => item.id === id));
            updateDraft({ evidenceIds });
          }}
        >
          {evidence.map((evidenceItem) => (
            <option key={evidenceItem.id} value={evidenceItem.id}>
              {evidenceItem.id} - {evidenceItem.title}
            </option>
          ))}
        </select>
      </div>

      <div className="form-row">
        <label htmlFor="hypothesis-nature">Nature</label>
        <select
          id="hypothesis-nature"
          value={draft.nature}
          onChange={(event) => updateDraft({ nature: event.target.value })}
        >
          <option value="">Select a nature...</option>
          <option value="technical failure">Technical failure</option>
          <option value="human error">Human error</option>
          <option value="process failure">Process failure</option>
          <option value="unknown">Unknown</option>
        </select>
      </div>

      <div className="form-row">
        <label htmlFor="hypothesis-confidence">
          Confidence: {draft.confidence}
        </label>
        <input
          id="hypothesis-confidence"
          type="range"
          min="0"
          max="100"
          value={draft.confidence}
          //Demo 2: the range input and label are controlled by draft.confidence.
          onChange={(event) =>
            updateDraft({ confidence: Number(event.target.value) })
          }
        />
      </div>

      <div className="form-row">
        <label htmlFor="hypothesis-explanation">Explanation</label>
        <textarea
          id="hypothesis-explanation"
          value={draft.explanation}
          onChange={(event) => updateDraft({ explanation: event.target.value })}
        />
      </div>

      <div className="form-row">
        <label htmlFor="hypothesis-alternative">Alternative</label>
        <textarea
          id="hypothesis-alternative"
          value={draft.alternative}
          onChange={(event) => updateDraft({ alternative: event.target.value })}
        />
      </div>

      <div className="form-actions">
        <button type="submit" className="btn btn-primary">
          Save hypothesis draft
        </button>
        {saved && <span className="saved-msg">Draft saved.</span>}
      </div>
    </form>
  );
}
