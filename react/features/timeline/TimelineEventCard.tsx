import type {
  TimelineEvent,
  TimelineCertainty,
} from "../../../types/domain.ts";
import { formatDate } from "../../../utils/dateHelper.ts";
import { Card } from "../../components/Card.tsx";
import { Badge, type BadgeVariant } from "../../components/Badge.tsx";

//Exercise 4 Demo 1: explicitly typed props, no any — a wrong shape passed here
// fails at compile time (e.g. <TimelineEventCard event="T01" .../>).
interface TimelineEventCardProps {
  event: TimelineEvent;
  locationNames: string[];
}

//Exercise 4 Demo 2: certainty → badge variant via a lookup map, replacing the
// certaintyBadgeClass() if-chain in views/timeline.ts.
const CERTAINTY_VARIANT: Record<TimelineCertainty, BadgeVariant> = {
  confirmed: "reviewed",
  reported: "flagged",
  contradictory: "critical",
};

export function TimelineEventCard({
  event,
  locationNames,
}: TimelineEventCardProps) {
  return (
    //Exercise 4 Demo 1: Card wraps the event markup via children (composition).
    <Card className={`timeline-event certainty-${event.certainty}`}>
      <div className="timeline-time">
        {formatDate(event.time)}&nbsp;&middot;&nbsp;
        {/*Exercise 4 Demo 7: shared Badge component, also used by
           CaseSummaryCard on the dashboard.*/}
        <Badge label={event.certainty} variant={CERTAINTY_VARIANT[event.certainty]} />
      </div>
      <h3>{event.title}</h3>
      <p>{event.description}</p>

      {/*Exercise 4 Demo 2: `&&` — render only when locations exist. Written as
         `> 0` so the falsy operand is a boolean, not the number 0 which React
         would render literally. Replaces the length check in views/timeline.ts.*/}
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
