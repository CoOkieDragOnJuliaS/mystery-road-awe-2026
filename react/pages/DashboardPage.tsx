import * as state from "../../state/globalState.ts";
import { CaseSummaryCard } from "./components/CaseSummaryCard";
import { StatCard } from "./components/StatCard";
import { Progress } from "./components/Progress";
import { RecentEvidenceList } from "./components/RecentEvidenceList";
import { RecentTimelineList } from "./components/RecentTimelineList";

// Composes the dashboard from case data stored in the shared application state.
export function DashboardPage() {
  // Read the data sets needed for the summary cards and recent-item lists.
  const caseData = state.getCaseData();
  const evidence = state.getAllEvidence();
  const people = state.getAllPeople();
  const locations = state.getAllLocations();
  const timeline = state.getAllTimeline();
  const bookmarks = state.getBookmarks();

  // filter keeps reviewed entries; length turns that result into a count.
  const reviewedCount = evidence.filter(
    (item) => item.status === "reviewed",
  ).length;

  // Avoid division by zero while no evidence has been loaded.
  const progressPct =
    evidence.length === 0
      ? 0
      : Math.round((reviewedCount / evidence.length) * 100);

  // Convert data totals into a uniform shape that StatCard can render.
  const stats = [
    { value: evidence.length, label: "Evidence items" },
    { value: people.length, label: "People" },
    { value: locations.length, label: "Locations" },
    { value: bookmarks.length, label: "Bookmarked" },
    { value: reviewedCount, label: "Reviewed" },
  ];

  // Copy before reversing so the arrays held in global state are not mutated.
  // slice then limits each dashboard preview to five entries.
  const recentEvidence = [...evidence].reverse().slice(0, 5);
  const recentTimeline = [...timeline].reverse().slice(0, 5);

  return (
    <section id="view-dashboard" className="view active">
      <h2>Case Dashboard</h2>

      {/* Child components each handle one focused dashboard section. */}
      <CaseSummaryCard caseData={caseData} />

      <div className="stat-grid">
        {stats.map((stat) => (
          <StatCard key={stat.label} value={stat.value} label={stat.label} />
        ))}
      </div>

      <Progress progressPct={progressPct} />

      <div className="dashboard-columns">
        <RecentEvidenceList evidence={recentEvidence} />
        <RecentTimelineList events={recentTimeline} />
      </div>
    </section>
  );
}
