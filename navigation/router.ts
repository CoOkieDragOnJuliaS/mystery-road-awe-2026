import * as state from "../state/globalState.ts";
import { renderDashboard } from "../views/dashboard.ts";
import { renderEvidenceList } from "../views/evidenceBasic.ts";
import { renderPeople, renderLocations } from "../views/people.ts";
import { renderTimeline } from "../views/timeline.ts";
import { renderWorkspace } from "../views/workspace.ts";
import { getRequiredElement } from "../utils/dom.ts";
import { isViewName, type ViewName } from "../types/domain.ts";

// ---------------------------------------------------------------------
// NAVIGATION / HASH ROUTING
// ---------------------------------------------------------------------

export function navigateTo(viewName: ViewName): void {
  // Exercise 3 - Demo 4 (sets window.location.hash to the evidence, hashChange listener will pick this up)
  window.location.hash = viewName;
  // handleHashChange() will pick this up via the hashchange listener
}

//Exercise 3 - Demo 4 (handleHashChange is called, reads the hash, sets the current page and active element and updates the nav Button active for view)
export function handleHashChange(): void {
  const rawHash = window.location.hash.replace("#", "");
  //Demo 7: window.location.hash is an unrestricted string, so it is narrowed to ViewName.
  const hash: ViewName = isViewName(rawHash) ? rawHash : "dashboard";
  state.setCurrentPage(hash);

  const sections = document.querySelectorAll<HTMLElement>(".view");
  sections.forEach((section) => section.classList.remove("active"));
  getRequiredElement<HTMLElement>("view-" + hash).classList.add("active");

  const navButtons = document.querySelectorAll<HTMLElement>(".nav-btn");
  navButtons.forEach((button) => {
    button.classList.remove("active");
    if (button.dataset.view === hash) {
      button.classList.add("active");
    }
  });

  const viewRendered = state.getViewRendered();

  if (hash === "dashboard" && !viewRendered.dashboard) {
    renderDashboard();
    viewRendered.dashboard = true;
  } else if (hash === "evidence" && !viewRendered.evidence) {
    //Exercise 3 - Demo 4 (evidence view is rendered only once, then cached)
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
