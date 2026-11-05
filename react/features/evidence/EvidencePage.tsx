import { EvidenceDetailPage } from "./EvidenceDetailPage";
import * as state from "../../../state/globalState.ts";
import { EvidenceList } from "./EvidenceList.tsx";
import { EvidenceFilters } from "./EvidenceFilters.tsx";
import { useState } from "react";
import { EvidenceFilterValues, EvidenceId, initialFilters } from "../../../types/domain.ts";

//Exercise 5 - Demo 1 - changing from evidenceBasic and evidenceDetails to evidencePage
export function EvidencePage() {
  const evidence = state.getAllEvidence();
  const people = state.getAllPeople();
  const locations = state.getAllLocations();
  const previewEvidence = evidence[0]; //Not implemented yet to display anything else


    //Exercise 5 - Demo 1 - useState to use onChange for filtering evidence?
    const [filters, setFilters] = useState<EvidenceFilterValues>(initialFilters);
    const [selectedEvidenceId, setSelectedEvidenceId] = useState<EvidenceId | null>(null);

    const selectedEvidence = evidence.find((item) => item.id === selectedEvidenceId) || null;

  return (
    <section id="view-evidence" className="view active">
      {/* Filtering is not yet implemented*/}
      <EvidenceFilters
        evidence={evidence}
        people={people}
        locations={locations}
        filters={filters}
        onFiltersChange={setFilters}
      />

      <EvidenceList evidence={evidence} onSelectEvidence={setSelectedEvidenceId}/>

      {selectedEvidence && (
      <EvidenceDetailPage
        evidence={selectedEvidence}
        note={state.getNotesStore()[selectedEvidence.id] ?? ""}
      />
      )}
    </section>
  );
}
