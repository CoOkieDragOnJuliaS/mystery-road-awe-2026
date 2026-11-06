import {
  type Evidence,
  type Person,
  type Location,
  type EvidenceFilterValues,
} from "../../../types/domain";

interface EvidenceFiltersProps {
  evidence: Evidence[];
  people: Person[];
  locations: Location[];
  filters: EvidenceFilterValues;
  onFiltersChange: (filters: EvidenceFilterValues) => void;
  onSortChange: (sortOption: string) => void;
  onClearFilters: () => void;
}

//Exercise 5 Demo 1 - onChange function to update the filters state in the parent component
export function EvidenceFilters({
  evidence,
  people,
  locations,
  filters,
  onFiltersChange,
  onSortChange,
  onClearFilters,
}: EvidenceFiltersProps) {
  {
    /*Again: Why ...? Because it copies all current values into a new object*/
  }
  const types = [...new Set(evidence.map((item) => item.type))];

  return (
    <div className="toolbar">
      <div className="toolbar-row">
        {/*Here the ... copies all filter values into a new  object, replaces the e.g. searchTerm and passes the new object to the parents state(setter!)*/}
        <input
          type="text"
          aria-label="Search evidence"
          placeholder="Search evidence..."
          value={filters.searchTerm}
          onChange={(e) =>
            onFiltersChange({ ...filters, searchTerm: e.target.value })
          }
        />

        {/*Bugfix: I cannot see the current value of the filters! */}
        <select
          aria-label="Evidence type"
          value={filters.type}
          onChange={(e) =>
            onFiltersChange({ ...filters, type: e.target.value })
          }
        >
          <option value="">All types</option>
          {types.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>

        <select
          aria-label="Person"
          value={filters.personId}
          onChange={(e) =>
            onFiltersChange({ ...filters, personId: e.target.value })
          }
        >
          <option value="">All people</option>
          {people.map((person) => (
            <option key={person.id} value={person.id}>
              {person.name}
            </option>
          ))}
        </select>

        <select
          aria-label="Location"
          value={filters.locationId}
          onChange={(e) =>
            onFiltersChange({ ...filters, locationId: e.target.value })
          }
        >
          <option value="">All locations</option>
          {locations.map((location) => (
            <option key={location.id} value={location.id}>
              {location.name}
            </option>
          ))}
        </select>
      </div>

      <div className="toolbar-row">
        <select
          aria-label="Review status"
          value={filters.status}
          onChange={(e) =>
            onFiltersChange({ ...filters, status: e.target.value })
          }
        >
          <option value="">All statuses</option>
          <option value="unreviewed">Unreviewed</option>
          <option value="reviewed">Reviewed</option>
          <option value="flagged">Flagged</option>
        </select>

        <select
          aria-label="Relevance"
          value={filters.relevance}
          onChange={(e) =>
            onFiltersChange({ ...filters, relevance: e.target.value })
          }
        >
          <option value="">All relevance</option>
          <option value="unknown">Unknown</option>
          <option value="relevant">Relevant</option>
          <option value="irrelevant">Irrelevant</option>
        </select>

        <select
          aria-label="Sort evidence"
          value={filters.sortOption}
          onChange={(e) =>
            onSortChange(e.target.value)
          }
        >
          <option value="date-desc">Newest first</option>
          <option value="date-asc">Oldest first</option>
          <option value="title-asc">Title A–Z</option>
          <option value="title-desc">Title Z–A</option>
        </select>

        {/* Exercise 5 - Demo 7: reset all related filters through one action. */}
        <button
          type="button"
          className="btn btn-secondary"
          onClick={onClearFilters}
        >
          Clear filters
        </button>
      </div>
    </div>
  );
}
