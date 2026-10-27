import type { Location } from "../../../types/domain.ts";
import { Card } from "../../components/Card.tsx";

//Exercise 4 Demo 1: typed props, no any. Replaces renderLocations() in
// views/people.ts which concatenated the same markup as strings.
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
