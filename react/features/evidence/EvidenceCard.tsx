import type { Evidence, EvidenceId } from "../../../types/domain";
import { formatDate } from "../../../utils/dateHelper";
import { Card } from "../../components/Card";

//Exercise 5 - Demo 1 - changing from evidenceBasic and evidenceDetails to evidence with card
interface EvidenceCardProps {
  evidence: Evidence;
  onSelectEvidence: (id: EvidenceId) => void;
  onToggleBookmark: (id: EvidenceId) => void;
}

export function EvidenceCard({
  evidence,
  onSelectEvidence,
  onToggleBookmark,
}: EvidenceCardProps) {
  //Exercise 5 - Demo 1 - needed to have onClick on an outer layer of the card, because card prop did not work with onChange
  return (
    <div
      onClick={() => onSelectEvidence(evidence.id)}
      id="evidence-card-container"
    >
      <Card className="evidence-card">
        {/* Exercise 5 - Demo 3 - bookmark with immutable bookmark toggle*/}
        <button
          type="button"
          className={`bookmark-btn ${evidence.bookmarked ? "active" : ""}`}
          onClick={(event) => {
            //The stopPropagation() method prevents propagation of the same event from being called.
            // Propagation means bubbling up to parent elements or capturing down to child elements.
            event.stopPropagation();
            onToggleBookmark(evidence.id);
          }}
          aria-label={`Toggle bookmark for ${evidence.title}`}
        >
          {evidence.bookmarked ? "★" : "☆"}
        </button>
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
    </div>
  );
}
