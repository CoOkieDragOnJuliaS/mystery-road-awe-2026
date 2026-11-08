import type { Evidence, EvidenceId } from "../../../types/domain.ts";
import { EvidenceCard } from "./EvidenceCard.tsx";

interface EvidenceListProps {
  evidence: Evidence[];
  onSelectEvidence: (id: EvidenceId) => void;
  onToggleBookmark: (id: EvidenceId) => void;
}

export function EvidenceList({
  evidence,
  onSelectEvidence,
  onToggleBookmark,
}: EvidenceListProps) {
  return (
    <div id="evidenceList" className="evidence-grid">
      {evidence.length === 0 ? (
        //Exercise 6 - Demo 6: a fulfilled empty collection has its own
        //rendered state and is not confused with loading or request failure.
        <p className="empty-state">No evidence available.</p>
      ) : (
        evidence.map((item) => (
          <EvidenceCard
            key={item.id}
            evidence={item}
            onSelectEvidence={onSelectEvidence}
            onToggleBookmark={onToggleBookmark}
          />
        ))
      )}
    </div>
  );
}
