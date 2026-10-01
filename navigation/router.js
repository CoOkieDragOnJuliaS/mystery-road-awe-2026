import * as state from "../state/globalState.js";
import { renderDashboard } from "../views/dashboard.js";
import { renderEvidenceList } from "../views/evidenceBasic.js";
import { renderPeople, renderLocations } from "../views/people.js";
import { renderTimeline } from "../views/timeline.js";
import { renderWorkspace } from "../views/workspace.js";

// ---------------------------------------------------------------------
// NAVIGATION / HASH ROUTING
// ---------------------------------------------------------------------

export function navigateTo(viewName) {
  window.location.hash = viewName;
  // handleHashChange() will pick this up via the hashchange listener
}

export function handleHashChange() {
  let hash = window.location.hash.replace("#", "");
  const validViews = [
    "dashboard",
    "evidence",
    "people",
    "timeline",
    "workspace",
  ];
  if (validViews.indexOf(hash) === -1) {
    hash = "dashboard";
  }
  state.setCurrentPage(hash);

  const sections = document.querySelectorAll(".view");
  for (let i = 0; i < sections.length; i++) {
    sections[i].classList.remove("active");
  }
  document.getElementById("view-" + hash).classList.add("active");

  const navButtons = document.querySelectorAll(".nav-btn");
  for (let n = 0; n < navButtons.length; n++) {
    navButtons[n].classList.remove("active");
    if (navButtons[n].getAttribute("data-view") === hash) {
      navButtons[n].classList.add("active");
    }
  }

  const viewRendered = state.getViewRendered();

  if (hash === "dashboard" && !viewRendered.dashboard) {
    renderDashboard();
    viewRendered.dashboard = true;
  } else if (hash === "evidence" && !viewRendered.evidence) {
    renderEvidenceList();
    viewRendered.evidence = true;
  } else if (hash === "people" && !viewRendered.people) {
    renderPeople();
    renderLocations();
    viewRendered.people = true;
  } else if (hash === "timeline" && !viewRendered.timeline) {
    renderTimeline();
    viewRendered.timeline = true;
  } else if (hash === "workspace") {
    // workspace is cheap enough that it always re-renders
    renderWorkspace();
  }
}
