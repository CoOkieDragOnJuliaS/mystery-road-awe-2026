import type { TimelineEvent } from "../../../types/domain.ts";
import { findLocationById } from "../../../utils/lookupHelpers.ts";
import { TimelineEventCard } from "./TimelineEventCard.tsx";

interface TimelineListProps {
  events: TimelineEvent[];
}

export function TimelineList({ events }: TimelineListProps) {
  // replaces html = "<p>No timeline events match...</p>"
  return events.length === 0 ? (
    <p>No timeline events match the current filters.</p>
  ) : (
    <div className="timeline-container">
      {events.map((event) => (
        <TimelineEventCard
          key={event.id}
          event={event}
          // replaces the eventLocationNames loop
          locationNames={event.locationIds.map(
            (id) => findLocationById(id)?.name ?? id,
          )}
        />
      ))}
    </div>
  );
}
