import * as state from "../state/globalState.js";
import { renderDashboard } from "../views/dashboard.js";
import * as evidence from "../views/evidenceBasic.js";
import * as timeline from "../views/timeline.js";
import * as workspace from "../views/workspace.js";
// ---------------------------------------------------------------------
// DATA LOADING
// ---------------------------------------------------------------------

export function showLoadingOverlay(msg) {
  var overlay = document.getElementById("loadingOverlay");
  var text = document.getElementById("loadingText");
  if (text) text.textContent = msg;
  if (overlay) overlay.classList.remove("hidden");
}

export function hideLoadingStep() {
  state.decrementLoadingStepsRemaining();
  if (state.getLoadingStepsRemaining() <= 0) {
    var overlay = document.getElementById("loadingOverlay");
    if (overlay) overlay.classList.add("hidden");
  }
}

export async function loadCorePeopleAndLocations() {
  const caseRes = await fetch("data/case.json");
  const caseJson = await caseRes.json();
  state.setCaseData(caseJson);

  //or maybe also refactor it by state.setCaseData(await caseRes.json()) instead of the extra variable? But more readable perhaps with more? I will use more

  const peopleRes = await fetch("data/people.json");
  const peopleJson = await peopleRes.json();
  state.setAllPeople(peopleJson);

  const locationsRes = await fetch("data/locations.json");
  const locationsJson = await locationsRes.json();
  state.setAllLocations(locationsJson);

  hideLoadingStep();
  renderDashboard();
  populateAllDropdowns();
}

export function loadEvidenceData() {
  fetch("data/evidence.json")
    .then(function (res) {
      return res.json();
    })
    .then(function (data) {
      state.setAllEvidence(data);
      evidence.applyStoredBookmarkFlags();
      state.setEvidenceViewLoading(false);
      state.getFilteredEvidence();
      renderDashboard();
      populateAllDropdowns();
      if (state.getCurrentPage() === "evidence") evidence.renderEvidenceList();
    })
    .catch(function (err) {
      console.error("Failed to load evidence.json", err);
      alert("Evidence could not be loaded. Some views may be incomplete.");
    });
}

export async function loadTimelineData() {
  try {
    const res = await fetch("data/timeline.json");
    const data = await res.json();
    state.setAllTimeline(data);
    renderDashboard();
    
    if (state.getCurrentPage() === "timeline") timeline.renderTimeline();
    
    populateAllDropdowns();
    
  }catch(err) {
      console.log("timeline load error", err);

  }finally {
      hideLoadingStep();

  }
}

export function loadAllData() {
  showLoadingOverlay("Loading case file…");
  state.setLoadingStepsRemaining(2);

  // Changed to Promise.all() to wait for everything to load before loading web page
  return loadCorePeopleAndLocations().then(function () {
    return Promise.all([
    loadEvidenceData(),
    loadTimelineData()
  ]);
  });
}

export function populateAllDropdowns() {
  evidence.populateEvidenceDropdowns();
  timeline.populateTimelineDropdowns();
  workspace.populateHypothesisDropdowns();
}