import * as state from "../../../state/globalState.ts";
import { LocationCard } from "./LocationCard.tsx";

//Exercise 4 Demo 3: locations rendered as a mapped collection with
// key={location.id} — replaces the string concatenation in renderLocations().
export function LocationsList() {
  return (
    <div className="locations-grid">
      {state.getAllLocations().map((location) => (
        <LocationCard key={location.id} location={location} />
      ))}
    </div>
  );
}
