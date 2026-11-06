import { EvidenceDetailPage } from "./EvidenceDetailPage";
import * as state from "../../../state/globalState.ts";
import { EvidenceList } from "./EvidenceList.tsx";
import { EvidenceFilters } from "./EvidenceFilters.tsx";
import { filterEvidence } from "./evidenceFilterHelper.tsx";
import { useState } from "react";
import { saveBookmarksToStorage } from "../../../storage/localStorage.ts";
import {
  type EvidenceFilterValues,
  type EvidenceId,
  initialFilters,
} from "../../../types/domain.ts";

//Exercise 5 - Demo 1 - changing from evidenceBasic and evidenceDetails to evidencePage
export function EvidencePage() {
  const evidence = state.getAllEvidence();
  const [bookmarkIds, setBookmarkIds] = useState(() => state.getBookmarks());
  const people = state.getAllPeople();
  const locations = state.getAllLocations();
  //const previewEvidence = evidence[0]; //Not implemented yet to display anything else

  //Exercise 5 - Demo 1 - useState to use onChange for filtering evidence?
  const [filters, setFilters] = useState<EvidenceFilterValues>(initialFilters);
  const [selectedEvidenceId, setSelectedEvidenceId] =
    useState<EvidenceId | null>(null);

  //Exercise 5 - Demo 4: bookmark flags are derived from one ID source.
  const evidenceWithBookmarks = evidence.map((item) => ({
    ...item,
    bookmarked: bookmarkIds.includes(item.id),
  }));

  const selectedEvidence =
    evidenceWithBookmarks.find((item) => item.id === selectedEvidenceId) ||
    null;

  //Exercise 5 - Demo 4: the ID array is replaced, never mutated in place.
  function handleToggleBookmark(id: EvidenceId): void {
    const next = bookmarkIds.includes(id)
      ? bookmarkIds.filter((currentId) => currentId !== id)
      : [...bookmarkIds, id];

    setBookmarkIds(next);
    state.setBookmarks(next);
    saveBookmarksToStorage();
  }

  //Exercise 5 - Demo 4: this list is derived on every render.
  const visibleEvidence = filterEvidence(evidenceWithBookmarks, filters);

  return (
    <section id="view-evidence" className="view active">
      <EvidenceFilters
        evidence={evidence}
        people={people}
        locations={locations}
        filters={filters}
        onFiltersChange={setFilters}
      />

      <EvidenceList
        evidence={visibleEvidence}
        onSelectEvidence={setSelectedEvidenceId}
        onToggleBookmark={handleToggleBookmark}
      />

      {selectedEvidence && (
        <EvidenceDetailPage
          evidence={selectedEvidence}
          note={state.getNotesStore()[selectedEvidence.id] ?? ""}
        />
      )}
    </section>
  );
}
