import { EvidenceDetailPage } from "./EvidenceDetailPage";
import * as state from "../../../state/globalState.ts";
import { EvidenceList } from "./EvidenceList.tsx";
import { EvidenceFilters } from "./EvidenceFilters.tsx";
import { filterEvidence } from "./evidenceFilterHelper.tsx";
import { useReducer, useState } from "react";
import {
  type EvidenceFilterValues,
  type EvidenceId,
  type NotesStore,
  initialFilters,
} from "../../../types/domain.ts";

type FilterAction =
  | { type: "SET_FILTERS"; filters: EvidenceFilterValues }
  | { type: "SET_SORT"; sortOption: string }
  | { type: "CLEAR_FILTERS" };

//Exercise 5 - Demo 7: related filter transitions live in one pure reducer.
function filterReducer(
  current: EvidenceFilterValues,
  action: FilterAction,
): EvidenceFilterValues {
  switch (action.type) {
    case "SET_FILTERS":
      return action.filters;
    case "SET_SORT":
      return { ...current, sortOption: action.sortOption };
    case "CLEAR_FILTERS":
      return { ...initialFilters };
  }
}

//Exercise 5 - Demo 1 - changing from evidenceBasic and evidenceDetails to evidencePage
interface EvidencePageProps {
  bookmarkIds: EvidenceId[];
  onToggleBookmark: (id: EvidenceId) => void;
  notes: NotesStore;
  onSaveNote: (id: EvidenceId, text: string) => void;
}

export function EvidencePage({
  bookmarkIds,
  onToggleBookmark,
  notes,
  onSaveNote,
}: EvidencePageProps) {
  const evidence = state.getAllEvidence();
  const people = state.getAllPeople();
  const locations = state.getAllLocations();
  //const previewEvidence = evidence[0]; //Not implemented yet to display anything else

  //Exercise 5 - Demo 7: useReducer models the complete filter state domain.
  const [filters, dispatchFilters] = useReducer(
    filterReducer,
    initialFilters,
  );
  const [selectedEvidenceId, setSelectedEvidenceId] =
    useState<EvidenceId | null>(null);

  //Exercise 5 - Demo 5: bookmark state arrives from the common App owner.
  const evidenceWithBookmarks = evidence.map((item) => ({
    ...item,
    bookmarked: bookmarkIds.includes(item.id),
  }));

  const selectedEvidence =
    evidenceWithBookmarks.find((item) => item.id === selectedEvidenceId) ||
    null;

  //Exercise 5 - Demo 5: the child receives the owner callback through props.
  const visibleEvidence = filterEvidence(evidenceWithBookmarks, filters);

  return (
    <section id="view-evidence" className="view active">
      <EvidenceFilters
        evidence={evidence}
        people={people}
        locations={locations}
        filters={filters}
        onFiltersChange={(nextFilters) =>
          dispatchFilters({ type: "SET_FILTERS", filters: nextFilters })
        }
        onSortChange={(sortOption) =>
          dispatchFilters({ type: "SET_SORT", sortOption })
        }
        onClearFilters={() => dispatchFilters({ type: "CLEAR_FILTERS" })}
      />

      <EvidenceList
        evidence={visibleEvidence}
        onSelectEvidence={setSelectedEvidenceId}
        onToggleBookmark={onToggleBookmark}
      />

      {selectedEvidence && (
        <EvidenceDetailPage
          key={selectedEvidence.id}
          evidence={selectedEvidence}
          note={notes[selectedEvidence.id] ?? ""}
          onSaveNote={onSaveNote}
        />
      )}
    </section>
  );
}
