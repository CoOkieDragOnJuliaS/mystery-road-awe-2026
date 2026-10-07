import type { Evidence } from "../../../types/domain.ts";

// Receives a prepared subset of evidence from the dashboard page.
interface RecentEvidenceListProps {
  evidence: Evidence[];
}

// Renders an empty state or one keyed list item for each evidence record.
export function RecentEvidenceList({ evidence }: RecentEvidenceListProps) {
  return (
    <div className="dashboard-panel">
      <h3>Recent evidence</h3>
      {/* The ternary chooses between an empty message and the evidence list. */}
      {evidence.length === 0 ? (
        <p>No evidence loaded yet.</p>
      ) : (
        evidence.map((item) => (
          <div key={item.id} className="evidence-item">
            <h4>{item.title}</h4>
          </div>
        ))
      )}
    </div>
  );
}
