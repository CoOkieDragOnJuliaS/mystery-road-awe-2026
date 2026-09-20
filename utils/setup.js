import { handleHashChange } from "../navigation/router.js";
import * as evidence from "../views/evidenceBasic.js";
import * as timeline from "../views/timeline.js";
// ---------------------------------------------------------------------
// EVENT LISTENER SETUP
// ---------------------------------------------------------------------

export function setupEventListeners() {
  window.addEventListener("hashchange", handleHashChange);

  var navButtons = document.querySelectorAll(".nav-btn");
  for (var i = 0; i < navButtons.length; i++) {
    navButtons[i].addEventListener("click", function () {
      var targetView = navButtons[i].getAttribute("data-view");
      console.log("nav clicked:", targetView);
    });
  }

  document.getElementById("evidenceSearch").addEventListener("input", evidence.handleSearchInput);

  document.getElementById("filterType").addEventListener("change", evidence.renderEvidenceList);
  document.getElementById("filterPerson").addEventListener("change", evidence.renderEvidenceList);
  document.getElementById("filterLocation").addEventListener("change", evidence.renderEvidenceList);

  document.getElementById("filterStatus").addEventListener("change", evidence.renderEvidenceList);
  //document.getElementById("filterStatus").setAttribute("onchange", "renderEvidenceList()"); ?? needed?

  document.getElementById("filterRelevance").addEventListener("change", evidence.renderEvidenceList);

  document.getElementById("clearFiltersBtn").addEventListener("click", evidence.clearFilters);

  document.getElementById("timelineOrder").addEventListener("change", timeline.renderTimeline);
  document.getElementById("timelinePersonFilter").addEventListener("change", timeline.renderTimeline);
  document.getElementById("timelineLocationFilter").addEventListener("change", timeline.renderTimeline);
  document.getElementById("timelineTypeFilter").addEventListener("change", timeline.renderTimeline);

  document.getElementById("hypConfidence").addEventListener("input", function (e) {
    document.getElementById("hypConfidenceValue").textContent = e.target.value;
  });
}