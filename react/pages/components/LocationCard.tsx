import type { Location } from "../../../types/domain.ts";
import { Card } from "./Card.tsx";

//Exercise 4 Demo 5: presentational location card — props in, markup out.
// Replaces the string concatenation in renderLocations() in views/people.ts.
interface LocationCardProps {
  location: Location;
}

export function LocationCard({ location }: LocationCardProps) {
  return (
    <Card className="location-card">
      <h3>
        {location.id} &mdash; {location.name}
      </h3>
      <p>{location.description}</p>
      <p>
        <strong>Contains:</strong>
      </p>
      <ul>
        {location.contains.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </Card>
  );
}
