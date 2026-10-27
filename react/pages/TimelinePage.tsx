import * as state from "../../state/globalState.ts";
import { TimelineFilters } from "./components/TimelineFilters.tsx";
import { TimelineList } from "./components/TimelineList.tsx";

//Exercise 4 Demo 5: feature/container component — owns data selection
// (ordering the events) and hands finished arrays down to the presentational
// TimelineFilters/TimelineList. Replaces the fetch+filter+sort+markup mix
// that renderTimeline() was in views/timeline.ts.
export function TimelinePage() {
  const events = [...state.getAllTimeline()].sort(
    (a, b) => +new Date(a.time) - +new Date(b.time), // Ascending, "Oldest first"
  );

  return (
    <section id="view-timeline" className="view active">
      <h2>Investigation Timeline</h2>
      <TimelineFilters />
      <TimelineList events={events} />
    </section>
  );
}
