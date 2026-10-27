import * as state from "../../../state/globalState.ts";
import type { PersonId } from "../../../types/domain.ts";

//Exercise 4 Demo 5: TimelineFilters is presentational — it renders the
// controls but owns no filtering logic.
//Exercise 4 Demo 10: the selects are visually complete but intentionally
// not wired to onChange — interactive filtering is Exercise 5 scope.
// defaultValue shows the initial selection (from the ?person= query param)
// without needing useState.
interface TimelineFiltersProps {
  initialPerson?: PersonId;
}

export function TimelineFilters({ initialPerson }: TimelineFiltersProps) {
  const people = state.getAllPeople();
  const locations = state.getAllLocations();

  //Exercise 4 Demo 3: replaces populateTimelineDropdowns() in views/timeline.ts
  // which built <option> strings via innerHTML. Types collected with a Set
  // instead of the manual includes() loop.
  const types = [...new Set(state.getAllTimeline().map((e) => e.type))];

  return (
    <div className="toolbar" id="timelineToolbar">
      <div className="toolbar-row">
        <label htmlFor="timelineOrder" className="visually-hidden">
          Order
        </label>
        <select id="timelineOrder" defaultValue="asc">
          <option value="asc">Oldest first</option>
          <option value="desc">Newest first</option>
        </select>

        <label htmlFor="timelinePersonFilter" className="visually-hidden">
          Filter by person
        </label>
        <select id="timelinePersonFilter" defaultValue={initialPerson ?? ""}>
          <option value="">All people</option>
          {people.map((person) => (
            <option key={person.id} value={person.id}>
              {person.name}
            </option>
          ))}
        </select>

        <label htmlFor="timelineLocationFilter" className="visually-hidden">
          Filter by location
        </label>
        <select id="timelineLocationFilter" defaultValue="">
          <option value="">All locations</option>
          {locations.map((location) => (
            <option key={location.id} value={location.id}>
              {location.id}
            </option>
          ))}
        </select>

        <label htmlFor="timelineTypeFilter" className="visually-hidden">
          Filter by event type
        </label>
        <select id="timelineTypeFilter" defaultValue="">
          <option value="">All event types</option>
          {types.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
