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
interface EvidencePageProps {
  bookmarkIds: EvidenceId[];
  onToggleBookmark: (id: EvidenceId) => void;
}

export function EvidencePage({
  bookmarkIds,
  onToggleBookmark,
}: EvidencePageProps) {
  const evidence = state.getAllEvidence();
  const people = state.getAllPeople();
  const locations = state.getAllLocations();
  //const previewEvidence = evidence[0]; //Not implemented yet to display anything else

  //Exercise 5 - Demo 1 - useState to use onChange for filtering evidence?
  const [filters, setFilters] = useState<EvidenceFilterValues>(initialFilters);
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
        onFiltersChange={setFilters}
      />

      <EvidenceList
        evidence={visibleEvidence}
        onSelectEvidence={setSelectedEvidenceId}
        onToggleBookmark={onToggleBookmark}
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
