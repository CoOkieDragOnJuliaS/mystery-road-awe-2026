import type { Evidence } from "../../../types/domain";
import { formatDate } from "../../../utils/dateHelper";
import { Card } from "../../components/Card";

//Exercise 5 - Demo 1 - changing from evidenceBasic and evidenceDetails to evidence with card
interface EvidenceCardProps {
  evidence: Evidence;
}

export function EvidenceCard({ evidence }: EvidenceCardProps) {
  return (
    <Card className="evidence-card">
      <h3>{evidence.title}</h3>

      <div className="evidence-meta">
        {evidence.id} · {evidence.type} · {formatDate(evidence.timestamp)}
      </div>

      <div className="evidence-summary">{evidence.summary}</div>

      {evidence.tags.includes("critical") && (
        <span className="badge badge-critical">Critical</span>
      )}

      <span className={`badge badge-${evidence.status}`}>
        {evidence.status}
      </span>

      <span className={`badge badge-${evidence.relevance}`}>
        {evidence.relevance}
      </span>

      <div>
        {evidence.tags.map((tag) => (
          <span key={tag} className="tag-chip">
            {tag}
          </span>
        ))}
      </div>
    </Card>
  );
}
