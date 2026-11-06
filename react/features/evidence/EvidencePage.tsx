import { EvidenceDetailPage } from "./EvidenceDetailPage";
import * as state from "../../../state/globalState.ts";
import { EvidenceList } from "./EvidenceList.tsx";
import { EvidenceFilters } from "./EvidenceFilters.tsx";
import { filterEvidence } from "./evidenceFilterHelper.tsx";
import { useState } from "react";
import {
  type EvidenceFilterValues,
  type EvidenceId,
  initialFilters,
} from "../../../types/domain.ts";

//Exercise 5 - Demo 1 - changing from evidenceBasic and evidenceDetails to evidencePage
export function EvidencePage() {
  const [evidence, setEvidence] = useState(() => state.getAllEvidence());
  const people = state.getAllPeople();
  const locations = state.getAllLocations();
  //const previewEvidence = evidence[0]; //Not implemented yet to display anything else

  //Exercise 5 - Demo 1 - useState to use onChange for filtering evidence?
  const [filters, setFilters] = useState<EvidenceFilterValues>(initialFilters);
  const [selectedEvidenceId, setSelectedEvidenceId] =
    useState<EvidenceId | null>(null);

  const selectedEvidence =
    evidence.find((item) => item.id === selectedEvidenceId) || null;

  //Demo 3: map creates a new array and object for the changed item.
  function handleToggleBookmark(id: EvidenceId): void {
    setEvidence((current) =>
      current.map((item) =>
        item.id === id
          ? { ...item, bookmarked: !item.bookmarked }
          : item,
      ),
    );
  }

  //Demo 2 - filter the evidence based on the current filters state
  const visibleEvidence = filterEvidence(evidence, filters);

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
