import * as state from "../../state/globalState.ts";
import { CaseSummaryCard } from "./components/CaseSummaryCard";
import { StatCard } from "./components/StatCard";
import { Progress } from "./components/Progress";
import { RecentEvidenceList } from "./components/RecentEvidenceList";
import { RecentTimelineList } from "./components/RecentTimelineList";
 
export function DashboardPage() {
  const caseData = state.getCaseData();
  const evidence = state.getAllEvidence();
  const people = state.getAllPeople();
  const locations = state.getAllLocations();
  const timeline = state.getAllTimeline();
  const bookmarks = state.getBookmarks();
 
  const reviewedCount = evidence.filter(
    (item) => item.status === "reviewed"
  ).length;
 
  const progressPct =
    evidence.length === 0
      ? 0
      : Math.round((reviewedCount / evidence.length) * 100);
 
  const stats = [
    { value: evidence.length, label: "Evidence items" },
    { value: people.length, label: "People" },
    { value: locations.length, label: "Locations" },
    { value: bookmarks.length, label: "Bookmarked" },
    { value: reviewedCount, label: "Reviewed" },
  ];
 
  const recentEvidence = [...evidence].reverse().slice(0, 5);
  const recentTimeline = [...timeline].reverse().slice(0, 5);
 
  return (
    <section id="view-dashboard" className="view active">
      <h2>Case Dashboard</h2>
 
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