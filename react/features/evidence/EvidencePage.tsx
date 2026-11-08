import { EvidenceDetailPage } from "./EvidenceDetailPage";
import * as state from "../../../state/globalState.ts";
import { EvidenceList } from "./EvidenceList.tsx";
import { EvidenceFilters } from "./EvidenceFilters.tsx";
import { filterEvidence } from "./evidenceFilterHelper.tsx";
import { useCallback, useEffect, useReducer, useState } from "react";
import { loadEvidenceData } from "../../../data/api.ts";
import { useBackendData } from "../../hooks/useBackendData.ts";
import { useBookmarks } from "../../app/BookmarkContext.tsx";
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
  notes: NotesStore;
  onSaveNote: (id: EvidenceId, text: string) => void;
}

export function EvidencePage({ notes, onSaveNote }: EvidencePageProps) {
  //Exercise 6 - Demo 2: document.title is external browser state, so it is
  //synchronized in an effect instead of being changed during render.
  useEffect(() => {
    const previousTitle = document.title;
    document.title = "Evidence | Project ReMotion";

    return () => {
      document.title = previousTitle;
    };
  }, []);

  //Exercise 6 - Demo 3: the timer belongs to this page and is cancelled when
  //the page unmounts, so a late callback cannot outlive its owner.
  useEffect(() => {
    console.log("Demo 3: timer effect started");
    const timerId = window.setTimeout(() => {
      console.log("Demo 3: timer callback completed");
    }, 5000);

    return () => {
      window.clearTimeout(timerId);
      console.log("Demo 3: timer cleanup completed");
    };
  }, []);

  //Exercise 5 - Demo 8: Evidence reads bookmark state from Context.
  const { bookmarkIds, onToggleBookmark } = useBookmarks();
  const evidence = state.getAllEvidence();
  const people = state.getAllPeople();
  const locations = state.getAllLocations();
  //const previewEvidence = evidence[0]; //Not implemented yet to display anything else

  //Exercise 5 - Demo 7: useReducer models the complete filter state domain.
  const [filters, dispatchFilters] = useReducer(filterReducer, initialFilters);
  const [selectedEvidenceId, setSelectedEvidenceId] =
    useState<EvidenceId | null>(null);
  const [evidenceRefreshEnabled, setEvidenceRefreshEnabled] = useState(false);
  const loadEvidenceForRefresh = useCallback(
    (signal: AbortSignal) => loadEvidenceData(signal),
    [],
  );

  //Exercise 6 - Demo 8: Evidence reuses the same hook for an optional,
  //user-triggered refresh without duplicating effect or cancellation logic.
  const evidenceRefresh = useBackendData(loadEvidenceForRefresh, {
    enabled: evidenceRefreshEnabled,
  });

  //Exercise 5 - Demo 5: bookmark state arrives from the common App owner.
  const evidenceWithBookmarks = evidence.map((item) => ({
    ...item,
    bookmarked: bookmarkIds.includes(item.id),
  }));

  const selectedEvidence =
    evidenceWithBookmarks.find((item) => item.id === selectedEvidenceId) ||
    null;

  //Exercise 6 - Demo 1: this pure derived value belongs in render; it only
  //reads current inputs and returns the evidence that should be displayed.
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

      <button
        type="button"
        className="btn btn-secondary"
        onClick={() => {
          setEvidenceRefreshEnabled(true);
          evidenceRefresh.reload();
        }}
      >
        Refresh evidence
      </button>

      {evidenceRefresh.status === "loading" && (
        <p className="data-loading" role="status">
          Refreshing evidence...
        </p>
      )}
      {evidenceRefresh.status === "error" && (
        <p className="data-error" role="alert">
          Could not refresh evidence: {evidenceRefresh.error}
        </p>
      )}

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
