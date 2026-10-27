import type { TimelineEvent } from "../../../types/domain.ts";
import { findLocationById } from "../../../utils/lookupHelpers.ts";
import { TimelineEventCard } from "./TimelineEventCard.tsx";

interface TimelineListProps {
  events: TimelineEvent[];
}

export function TimelineList({ events }: TimelineListProps) {
  //Exercise 4 Demo 2: ternary for an either/or branch — replaces the
  // `html = "<p>No timeline events match...</p>"` fallback in views/timeline.ts.
  return events.length === 0 ? (
    <p>No timeline events match the current filters.</p>
  ) : (
    <div className="timeline-container">
      {events.map((event) => (
        <TimelineEventCard
          //Exercise 4 Demo 4: stable key={event.id}. A throwaway version used
          // key={index}; toggling the sort order made React reuse the wrong
          // DOM nodes, so per-item state (e.g. an input's text) stayed glued
          // to a position while the event data moved. Stable ids keep
          // component identity attached to the event, not the position.
          key={event.id}
          event={event}
          // replaces the eventLocationNames loop in views/timeline.ts
          locationNames={event.locationIds.map(
            (id) => findLocationById(id)?.name ?? id,
          )}
        />
      ))}
    </div>
  );
}
