import * as state from "../../state/globalState.ts";

export function TimelinePage() {
  const events = [...state.getAllTimeline()].sort(
    (a, b) => +new Date(a.time) - +new Date(b.time), // Ascending, replaced from timeline.ts
  );
  return (
    <section id="view-dashboard" className="view active">
      <div>
        <h1>Timeline</h1>
        <p>This is the Timeline page.</p>
      </div>
    </section>
  );
}
