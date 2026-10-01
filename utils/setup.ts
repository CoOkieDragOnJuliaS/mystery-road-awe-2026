import { handleHashChange, navigateTo } from "../navigation/router.ts";
import * as evidence from "../views/evidenceBasic.ts";
import * as timeline from "../views/timeline.ts";
import { getRequiredElement } from "./dom.ts";
import { isViewName } from "../types/domain.ts";
// ---------------------------------------------------------------------
// EVENT LISTENER SETUP
// ---------------------------------------------------------------------

export function setupEventListeners(): void {
  window.addEventListener("hashchange", handleHashChange);

  // Demo 8 change for eventListeners - first refactor
  const navButtons =
    document.querySelectorAll<HTMLButtonElement>("button[data-view]");

  navButtons.forEach(function (btn) {
    btn.addEventListener("click", function (e) {
      const currentTarget = e.currentTarget;
      if (!(currentTarget instanceof HTMLButtonElement)) return;

      const view = currentTarget.dataset.view;
      //Demo 7: dataset.view is only string, so it is validated before navigation.
      if (!view || !isViewName(view)) return;

      navigateTo(view);
    });
  });

  getRequiredElement<HTMLInputElement>("evidenceSearch").addEventListener(
    "input",
    evidence.handleSearchInput,
  );

  getRequiredElement<HTMLSelectElement>("filterType").addEventListener(
    "change",
    evidence.renderEvidenceList,
  );
  getRequiredElement<HTMLSelectElement>("filterPerson").addEventListener(
    "change",
    evidence.renderEvidenceList,
  );
  getRequiredElement<HTMLSelectElement>("filterLocation").addEventListener(
    "change",
    evidence.renderEvidenceList,
  );

  getRequiredElement<HTMLSelectElement>("filterStatus").addEventListener(
    "change",
    evidence.renderEvidenceList,
  );
  //document.getElementById("filterStatus").setAttribute("onchange", "renderEvidenceList()"); ?? needed?

  getRequiredElement<HTMLSelectElement>("filterRelevance").addEventListener(
    "change",
    evidence.renderEvidenceList,
  );

  getRequiredElement<HTMLButtonElement>("clearFiltersBtn").addEventListener(
    "click",
    evidence.clearFilters,
  );

  getRequiredElement<HTMLSelectElement>("timelineOrder").addEventListener(
    "change",
    timeline.renderTimeline,
  );
  getRequiredElement<HTMLSelectElement>("timelinePersonFilter").addEventListener(
    "change",
    timeline.renderTimeline,
  );
  getRequiredElement<HTMLSelectElement>(
    "timelineLocationFilter",
  ).addEventListener("change", timeline.renderTimeline);
  getRequiredElement<HTMLSelectElement>("timelineTypeFilter").addEventListener(
    "change",
    timeline.renderTimeline,
  );

  getRequiredElement<HTMLInputElement>("hypConfidence").addEventListener(
    "input",
    function (e) {
      const target = e.target;
      if (!(target instanceof HTMLInputElement)) return;
      getRequiredElement<HTMLElement>("hypConfidenceValue").textContent =
        target.value;
    },
  );
}
