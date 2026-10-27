import { Link, useParams } from "react-router-dom";
import { isPersonId } from "../../../types/domain.ts";
import {
  findPersonById,
  evidenceMentionsPerson,
} from "../../../utils/lookupHelpers.ts";
import * as state from "../../../state/globalState.ts";
import { PersonCard } from "./PersonCard.tsx";

//Exercise 4 Demo 9: route /team/people/:personId. useParams() returns
// string | undefined, so the raw value is narrowed with isPersonId before
// lookup — the same guard the vanilla code applied to dataset.personId.
export function PersonDetailPage() {
  const { personId } = useParams();
  const person =
    personId && isPersonId(personId) ? findPersonById(personId) : null;

  if (!person) {
    return (
      <section className="view active">
        <h2>People &amp; Locations</h2>
        <p>Person not found.</p>
        <Link to="/team/people">Back to people</Link>
      </section>
    );
  }

  const count = state
    .getAllEvidence()
    .filter((e) => evidenceMentionsPerson(e, person)).length;

  return (
    <section className="view active">
      <h2>People &amp; Locations</h2>
      <PersonCard person={person} evidenceCount={count} />
      <Link to="/team/people">Back to people</Link>
    </section>
  );
}
