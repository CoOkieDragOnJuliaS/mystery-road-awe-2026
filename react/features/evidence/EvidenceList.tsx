import type { Evidence, EvidenceId } from "../../../types/domain.ts";
import { EvidenceCard } from "./EvidenceCard.tsx";

interface EvidenceListProps {
  evidence: Evidence[];
  onSelectEvidence: (id: EvidenceId) => void;
}

export function EvidenceList({
  evidence,
  onSelectEvidence,
}: EvidenceListProps) {
  return (
    <div id="evidenceList" className="evidence-grid">
      {evidence.length === 0 ? (
        <p>No evidence available.</p>
      ) : (
        evidence.map((item) => (
          <EvidenceCard
            key={item.id}
            evidence={item}
            onSelectEvidence={onSelectEvidence}
          />
        ))
      )}
    </div>
  );
}
