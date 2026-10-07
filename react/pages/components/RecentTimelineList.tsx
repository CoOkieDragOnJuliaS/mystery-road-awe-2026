import type { TimelineEvent } from "../../../types/domain.ts";

// Receives the recent timeline subset selected by the dashboard page.
interface RecentTimelineListProps {
  events: TimelineEvent[];
}

// Renders an empty state or the description of every supplied timeline event.
export function RecentTimelineList({ events }: RecentTimelineListProps) {
  return (
    <div className="dashboard-panel">
      <h3>Recent timeline events</h3>
      {/* Stable event IDs let React track list entries between renders. */}
      {events.length === 0 ? (
        <p>No timeline events loaded yet.</p>
      ) : (
        events.map((event) => <p key={event.id}>{event.description}</p>)
      )}
    </div>
  );
}
