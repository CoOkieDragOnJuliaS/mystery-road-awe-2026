import * as state from "../state/globalState.ts";
import { formatDate } from "../utils/dateHelper.ts";
import { getStatusBadgeClass } from "../utils/badgeHelper.ts";
import { getElement } from "../utils/dom.ts";
// ---------------------------------------------------------------------
// DASHBOARD
// ---------------------------------------------------------------------

export function renderDashboard(): void {
  const container = getElement<HTMLElement>("dashboardContent");
  if (!container) return;

  let reviewedCount = 0;
  const allEvidence = state.getAllEvidence();
  for (const evidenceItem of allEvidence) {
    if (evidenceItem.status === "reviewed") reviewedCount++;
  }

  const progressPct =
    allEvidence.length === 0
      ? 0
      : Math.round((reviewedCount / allEvidence.length) * 100);

  const caseData = state.getCaseData();
  let html = "";
  html += '<div class="case-summary-card">';
  html += "<h3>" + (caseData?.title ?? "Case") + "</h3>";
  html +=
    '<p><span class="badge badge-flagged">' +
    (caseData?.status ?? "unknown").toUpperCase() +
    "</span></p>";
  html += "<p>" + (caseData?.summary ?? "") + "</p>";
  html += "</div>";

  const allPeople = state.getAllPeople();
  const allLocations = state.getAllLocations();
  const allTimeline = state.getAllTimeline();
  const bookmarks = state.getBookmarks();
  html += '<div class="stat-grid">';
  html += statCardHTML(allEvidence.length, "Evidence items");
  html += statCardHTML(allPeople.length, "People");
  html += statCardHTML(allLocations.length, "Locations");
  html += statCardHTML(bookmarks.length, "Bookmarked");
  html += statCardHTML(reviewedCount, "Reviewed");
  html += "</div>";

  html += '<div class="dashboard-panel">';
  html += "<h3>Review progress</h3>";
  html +=
    '<div class="progress-bar-outer"><div class="progress-bar-inner" style="width:' +
    progressPct +
    '%;"></div></div>';
  html += "<p>" + progressPct + "% of evidence reviewed</p>";
  html += "</div>";

  html += '<div class="dashboard-columns">';

  html += '<div class="dashboard-panel"><h3>Recent evidence</h3>';
  const recentEvidence = allEvidence.slice(-5).reverse();
  if (recentEvidence.length === 0) {
    html += "<p>No evidence loaded yet.</p>";
  }
  for (const evidenceItem of recentEvidence) {
    html +=
      '<div class="mini-list-item"><strong>' +
      evidenceItem.id +
      "</strong> &mdash; " +
      evidenceItem.title +
      ' <span class="badge ' +
      getStatusBadgeClass(evidenceItem.status) +
      '">' +
      evidenceItem.status +
      "</span></div>";
  }
  html += "</div>";

  html += '<div class="dashboard-panel"><h3>Recent timeline events</h3>';
  const recentTimeline = allTimeline.slice(-5).reverse();
  if (recentTimeline.length === 0) {
    html += "<p>No timeline events loaded yet.</p>";
  }
  for (const timelineEvent of recentTimeline) {
    html +=
      '<div class="mini-list-item"><strong>' +
      formatDate(timelineEvent.time) +
      "</strong><br>" +
      timelineEvent.title +
      "</div>";
  }
  html += "</div>";

  html += "</div>"; // dashboard-columns

  container.innerHTML = html;
}

export function statCardHTML(value: number, label: string): string {
  return (
    '<div class="stat-card"><div class="stat-value">' +
    value +
    '</div><div class="stat-label">' +
    label +
    "</div></div>"
  );
}
