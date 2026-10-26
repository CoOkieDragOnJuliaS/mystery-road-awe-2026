import * as state from "../../../state/globalState.ts";
import { Card } from "./Card.tsx";

//Exercise 4 Demo 3: Collection of PersonList
export function PeopleList() {
  const people = state.getAllPeople();
  const evidence = state.getAllEvidence();

  return (
    <div className="people-grid">
      {people.map((person) => {
        const count = evidence.filter((e) =>
          e.personIds.includes(person.id),
        ).length;
        return <Card key={person.id} children={undefined} />;
      })}
    </div>
  );
}
