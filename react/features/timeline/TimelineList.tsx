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
          //Exercise 4 Demo 4: stable key={event.id}. A throwaway version used
          // key={index}; toggling the sort order made React reuse the wrong
          // DOM nodes, so per-item state stayed glued to a position while the
          // event data moved. Stable ids keep identity attached to the event.
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
