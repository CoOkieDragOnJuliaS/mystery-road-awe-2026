import type { Evidence } from "../../../types/domain.ts";
import { EvidenceCard } from "./EvidenceCard.tsx";

interface EvidenceListProps {
  evidence: Evidence[];
}

export function EvidenceList({ evidence }: EvidenceListProps) {
  return (
    <div id="evidenceList" className="evidence-grid">
      {evidence.length === 0 ? (
        <p>No evidence available.</p>
      ) : (
        evidence.map((item) => <EvidenceCard key={item.id} evidence={item} />)
      )}
    </div>
  );
}
