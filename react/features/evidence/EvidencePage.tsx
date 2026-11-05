import { EvidenceDetailPage } from "./EvidenceDetailPage";
import * as state from "../../../state/globalState.ts";
import { EvidenceList } from "./EvidenceList.tsx";
import { EvidenceFilters } from "./EvidenceFilters.tsx";

//Exercise 5 - Demo 1 - changing from evidenceBasic and evidenceDetails to evidencePage
export function EvidencePage() {
  const evidence = state.getAllEvidence();
  const people = state.getAllPeople();
  const locations = state.getAllLocations();
  const previewEvidence = evidence[0]; //Not implemented yet to display anything else

  return (
    <section id="view-evidence" className="view active">
      {/* Filtering is not yet implemented*/}
      <EvidenceFilters
        evidence={evidence}
        people={people}
        locations={locations}
      />

      <EvidenceList evidence={evidence} />

      <EvidenceDetailPage
        evidence={previewEvidence}
        note={state.getNotesStore()[previewEvidence.id] ?? ""}
      />
    </section>
  );
}
