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

export function loadCorePeopleAndLocations() {
  return fetch("data/case.json").then(function (caseRes) {
    return caseRes.json().then(function (caseJson) {
      state.setCaseData(caseJson);

      return fetch("data/people.json").then(function (peopleRes) {
        return peopleRes.json().then(function (peopleJson) {
          state.setAllPeople(peopleJson);

          return fetch("data/locations.json").then(function (locationsRes) {
            return locationsRes.json().then(function (locationsJson) {
              state.setAllLocations(locationsJson);

              hideLoadingStep();
              renderDashboard();
              populateAllDropdowns();
            });
          });
        });
      });
    });
  });
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

export function loadTimelineData() {
  return fetch("data/timeline.json")
    .then(function (res) {
      return res.json();
    })
    .then(function (data) {
      state.setAllTimeline(data);
      renderDashboard();
      if (state.getCurrentPage() === "timeline") timeline.renderTimeline();
      populateAllDropdowns();
    })
    .catch(function (err) {
      console.log("timeline load error", err);
    })
    .finally(function () {
      hideLoadingStep();
    });
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