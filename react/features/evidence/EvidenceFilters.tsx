import type { Evidence, Person, Location } from "../../../types/domain";

interface EvidenceFiltersProps {
  evidence: Evidence[];
  people: Person[];
  locations: Location[];
}

export function EvidenceFilters({
  evidence,
  people,
  locations,
}: EvidenceFiltersProps) {
  const types = [...new Set(evidence.map((item) => item.type))];

  return (
    <div className="toolbar">
      <div className="toolbar-row">
        <input
          type="text"
          aria-label="Search evidence"
          placeholder="Search evidence..."
        />

        <select aria-label="Evidence type" defaultValue="">
          <option value="">All types</option>
          {types.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>

        <select aria-label="Person" defaultValue="">
          <option value="">All people</option>
          {people.map((person) => (
            <option key={person.id} value={person.id}>
              {person.name}
            </option>
          ))}
        </select>

        <select aria-label="Location" defaultValue="">
          <option value="">All locations</option>
          {locations.map((location) => (
            <option key={location.id} value={location.id}>
              {location.name}
            </option>
          ))}
        </select>
      </div>

      <div className="toolbar-row">
        <select aria-label="Review status" defaultValue="">
          <option value="">All statuses</option>
          <option value="unreviewed">Unreviewed</option>
          <option value="reviewed">Reviewed</option>
          <option value="flagged">Flagged</option>
        </select>

        <select aria-label="Relevance" defaultValue="">
          <option value="">All relevance</option>
          <option value="unknown">Unknown</option>
          <option value="relevant">Relevant</option>
          <option value="irrelevant">Irrelevant</option>
        </select>

        <select aria-label="Sort evidence" defaultValue="date-desc">
          <option value="date-desc">Newest first</option>
          <option value="date-asc">Oldest first</option>
          <option value="title-asc">Title A–Z</option>
          <option value="title-desc">Title Z–A</option>
        </select>

        <button type="button" className="btn btn-secondary">
          Clear filters
        </button>
      </div>
    </div>
  );
}
