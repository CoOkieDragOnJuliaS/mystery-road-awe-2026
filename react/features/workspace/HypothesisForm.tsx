import type {
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
  //Comes into place when I want to update stuff
  hypothesisDraft: HypothesisDraft;
  //onChange: (draft: HypothesisDraft) => void;
}

export function HypothesisForm({
  people,
  evidence,
  hypothesisDraft,
}: HypothesisFormProps) {
  //Bugfix: No double select next to each other?
  return (
    <div>
      <div className="form-row">
        <label htmlFor="hypothesis-suspect">Possible Suspect</label>
        {/* VERY IMPORTANT, NO , inside SELECT statements*/}
        <select
          id="hypothesis-suspect"
          defaultValue={hypothesisDraft.suspectId}
        >
          <option value="">Select a Person...</option>
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
          defaultValue={hypothesisDraft.evidenceIds}
        >
          <option value="">Select an Evidence...</option>
          {evidence.map((evidenceItem) => (
            <option key={evidenceItem.id} value={evidenceItem.id}>
              {evidenceItem.title}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
