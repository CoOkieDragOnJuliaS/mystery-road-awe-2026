import type { TimelineEvent } from "../../../types/domain.ts";
 
type RecentTimelineListProps = {
  events: TimelineEvent[];
};
 
export function RecentTimelineList({ events }: RecentTimelineListProps) {
  return (
    <div className="dashboard-panel">
      <h3>Recent timeline events</h3>
      {events.length === 0 ? (
        <p>No timeline events loaded yet.</p>
      ) : (
        events.map((event) => (
          <p key={event.id}>{event.description}</p>
        ))
      )}
    </div>
  );
}