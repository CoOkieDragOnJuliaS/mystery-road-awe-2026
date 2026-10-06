import type { Evidence } from "../../../types/domain.ts";
 
type RecentEvidenceListProps = {
  evidence: Evidence[];
};
 
export function RecentEvidenceList({ evidence }: RecentEvidenceListProps) {
  return (
    <div className="dashboard-panel">
      <h3>Recent evidence</h3>
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