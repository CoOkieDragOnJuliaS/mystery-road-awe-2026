import type {
  TimelineEvent,
  TimelineCertainty,
} from "../../../types/domain.ts";
import { isTimelineCertainty } from "../../../types/domain.ts";
import { formatDate } from "../../../utils/dateHelper.ts";
import { Card } from "./Card.tsx";

//Typed props for the TimelineEventCard component - Type Error?
interface TimelineEventCardProps {
  event: TimelineEvent;
  locationNames: string[];
}

/*function certaintyBadgeClass(certainty: TimelineCertainty | string): string {
  //Demo 7: DOM-facing certainty values are narrowed to the known union.
  const normalizedCertainty = isTimelineCertainty(certainty)
    ? certainty
    : "reported";
  if (normalizedCertainty === "confirmed") return "reviewed";
  if (normalizedCertainty === "contradictory") return "critical";
  if (normalizedCertainty === "reported") return "flagged";
  return "unreviewed";
}*/

//Exercise 4 Demo 2: CertaintyBadge Variant?
const CERTAINTY_BADGE: Record<string, string> = {
  confirmed: "badge-reviewed",
  reported: "badge-flagged",
  contradictory: "badge-critical",
};

export function TimelineEventCard({
  event,
  locationNames,
}: TimelineEventCardProps) {
  const certaintyClass = CERTAINTY_BADGE[event.certainty] || "badge-unreviewed";
  return (
    // html += '<div class="timeline-event certainty-' + item.certainty + '">'
    //Exercise 4 Demo 1: Implemented the Card component to wrap the timeline event
    <Card className={`timeline-event certainty-${event.certainty}`}>
      <div className="timeline-time">
        {formatDate(event.time)}&nbsp;&middot;&nbsp;
        <span className={`badge ${certaintyClass}`}>{event.certainty}</span>
      </div>
      <h3>{event.title}</h3>
      <p>{event.description}</p>

      {locationNames.length > 0 && (
        <p className="evidence-meta">Location: {locationNames.join(", ")}</p>
      )}

      {event.evidenceIds.map((id) => (
        <button key={id} type="button" className="evidence-link-btn">
          View {id}
        </button>
      ))}
    </Card>
  );
}
