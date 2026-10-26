import * as state from "../../../state/globalState.ts";
import { Card } from "./Card.tsx";

//Exercise 4 Demo 3: Collection of LocationsList
export function LocationsList() {
  return (
    <div className="locations-grid">
      {state.getAllLocations().map((loc) => (
        <Card key={loc.id} children={undefined} />
      ))}
    </div>
  );
}
