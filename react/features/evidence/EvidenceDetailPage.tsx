import { Evidence } from "../../../types/domain";
import { formatDate } from "../../../utils/dateHelper";
import { findLocationById, findPersonById } from "../../../utils/lookupHelpers";

interface EvidenceDetailProps {
  evidence: Evidence;
  note: string;
}

export function EvidenceDetailPage({ evidence, note }: EvidenceDetailProps) {
  const personNames = evidence.personIds.map(
    (id) => findPersonById(id)?.name ?? id,
  );

  const locationNames = evidence.locationIds.map(
    (id) => findLocationById(id)?.name ?? id,
  );

  return (
    <section id="evidenceDetailSection" className="evidence-detail">
      <div className="evidence-detail-header">
        <div>
          <p>
            <strong>Title:</strong> {evidence.title}
          </p>
          <div className="evidence-meta">
            <p>
              <strong>
                {evidence.id} · {evidence.type} ·{" "}
                {formatDate(evidence.timestamp)}
              </strong>
            </p>
          </div>
        </div>
        <button type="button" className="btn btn-secondary btn-small">
          Close
        </button>
      </div>

      <div className="warning-banner">
        {evidence.tags.includes("critical")
          ? "This item is tagged as critical evidence."
          : ""}
      </div>

      <div className="detail-field">
        <strong>Summary</strong>
        {evidence.summary}
      </div>
      <div className="evidence-detail-content">{evidence.content}</div>
      <div className="detail-field">
        <strong>Related people</strong>
        {personNames.join(", ")}
      </div>
      <div className="detail-field">
        <strong>Related locations</strong>
        {locationNames.join(", ")}
      </div>

      <div className="detail-field">
        <strong>Tags</strong>
        <div className="evidence-tags">
          {evidence.tags.map((tag) => (
            <span key={tag} className="tag-chip">
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className="detail-field">
        <label htmlFor="detailStatusSelect">Review status</label>
        <select id="detailStatusSelect" defaultValue={evidence.status}>
          <option value="unreviewed">Unreviewed</option>
          <option value="reviewed">Reviewed</option>
          <option value="flagged">Flagged</option>
        </select>
      </div>

      <div className="detail-field">
        <label htmlFor="detailRelevanceSelect">Relevance</label>
        <select id="detailRelevanceSelect" defaultValue={evidence.relevance}>
          <option value="unknown">Unknown</option>
          <option value="relevant">Relevant</option>
          <option value="irrelevant">Irrelevant</option>
        </select>
      </div>

      <div className="detail-field">
        <strong>Investigator note</strong>
        <textarea
          id="evidenceNoteInput"
          className="note-textarea"
          rows={3}
          data-evidence-id={evidence.id}
          placeholder="Add a private note about this evidence..."
        ></textarea>

        <button type="button" className="btn btn-primary btn-small">
          Save Note
        </button>

        <div className="detail-field">
          <strong>Note preview</strong>
          <div id="notePreview">{note}</div>
        </div>
      </div>
    </section>
  );
}
