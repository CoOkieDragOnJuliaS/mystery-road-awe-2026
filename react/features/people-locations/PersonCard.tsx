import type { Person } from "../../../types/domain.ts";
import { Card } from "../../components/Card.tsx";

//Exercise 4 Demo 5: PersonCard is purely presentational — it turns props into
// markup and knows nothing about globalState or where the count comes from.
// Replaces the html += accumulation inside renderPeople() in views/people.ts.
interface PersonCardProps {
  person: Person;
  evidenceCount: number;
}

export function PersonCard({ person, evidenceCount }: PersonCardProps) {
  return (
    <Card className="person-card">
      <div className="person-card-header">
        <img
          className="person-avatar"
          src={person.avatar}
          alt={`Portrait of ${person.name}`}
        />
        <div>
          <h3>{person.name}</h3>
          <div className="person-role">{person.role}</div>
        </div>
      </div>
      <p>
        <strong>Speciality:</strong> {person.speciality}
      </p>
      <ul>
        {person.responsibilities.map((responsibility) => (
          <li key={responsibility}>{responsibility}</li>
        ))}
      </ul>
      <div className="person-statement">&ldquo;{person.statement}&rdquo;</div>
      <p>
        {evidenceCount} related evidence item{evidenceCount === 1 ? "" : "s"}{" "}
        &mdash;{" "}
        <button type="button" className="evidence-count-link">
          view
        </button>
      </p>
    </Card>
  );
}
