import * as state from "../../../state/globalState.ts";
import { evidenceMentionsPerson } from "../../../utils/lookupHelpers.ts";
import { PersonCard } from "./PersonCard.tsx";

//Exercise 4 Demo 3: people rendered as a mapped collection with a stable
// key={person.id} — replaces the for-loop accumulating html in renderPeople().
//Exercise 4 Demo 5: this is a feature component — it owns the data lookup
// (which people, how many evidence items) and passes finished values down to
// the presentational PersonCard.
export function PeopleList() {
  const people = state.getAllPeople();
  const evidence = state.getAllEvidence();

  return (
    <div className="people-grid">
      {people.map((person) => {
        const count = evidence.filter((e) =>
          evidenceMentionsPerson(e, person),
        ).length;
        return (
          <PersonCard key={person.id} person={person} evidenceCount={count} />
        );
      })}
    </div>
  );
}
