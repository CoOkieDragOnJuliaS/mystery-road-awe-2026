import * as state from "../state/globalState.ts";
import { renderDashboard } from "../views/dashboard.ts";
import * as evidence from "../views/evidenceBasic.ts";
import * as timeline from "../views/timeline.ts";
import * as workspace from "../views/workspace.ts";
import type {
  CaseData,
  Evidence,
  Location,
  Person,
  TimelineEvent,
} from "../types/domain.ts";
// ---------------------------------------------------------------------
// DATA LOADING
// ---------------------------------------------------------------------

//Demo 6: response.json() returns JSON data but cannot prove its shape.
// T is the expected domain type; a runtime validator would be needed to prove it.
async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`${response.url}: HTTP ${response.status}`);
  }

  const data: unknown = await response.json();
  return data as T;
}

export function showLoadingOverlay(msg: string): void {
  const overlay = document.getElementById("loadingOverlay");
  const text = document.getElementById("loadingText");
  if (text) text.textContent = msg;
  if (overlay) overlay.classList.remove("hidden");
}

export function hideLoadingStep(): void {
  state.decrementLoadingStepsRemaining();
  if (state.getLoadingStepsRemaining() <= 0) {
    const overlay = document.getElementById("loadingOverlay");
    if (overlay) overlay.classList.add("hidden");
  }
}

export async function loadCorePeopleAndLocations(): Promise<void> {
  const caseJson = await fetchJson<CaseData>("data/case.json");
  state.setCaseData(caseJson);

  //or maybe also refactor it by state.setCaseData(await caseRes.json()) instead of the extra variable? But more readable perhaps with more? I will use more

  const peopleJson = await fetchJson<Person[]>("data/people.json");
  state.setAllPeople(peopleJson);

  const locationsJson = await fetchJson<Location[]>("data/locations.json");
  state.setAllLocations(locationsJson);

  hideLoadingStep();
  renderDashboard();
  populateAllDropdowns();
}

export async function loadEvidenceData(): Promise<void> {
  try {
    //Demo 6: Evidence[] commits personIds to person IDs, status to
    // "unreviewed" | "reviewed" | "flagged", and relevance to a restricted union.
    const data = await fetchJson<Evidence[]>("data/evidence.json");

    state.setAllEvidence(data);
    evidence.applyStoredBookmarkFlags();
    state.setEvidenceViewLoading(false);
    state.getFilteredEvidence();
    renderDashboard();
    populateAllDropdowns();
    if (state.getCurrentPage() === "evidence") evidence.renderEvidenceList();
  } catch (error: unknown) {
    console.error("Failed to load evidence.json", error);
    alert("Evidence could not be loaded. Some views may be incomplete.");
  }
}

export async function loadTimelineData(): Promise<void> {
  try {
    const data = await fetchJson<TimelineEvent[]>("data/timeline.json");
    state.setAllTimeline(data);
    renderDashboard();

    if (state.getCurrentPage() === "timeline") timeline.renderTimeline();

    populateAllDropdowns();
  } catch (error: unknown) {
    console.log("timeline load error", error);
  } finally {
    hideLoadingStep();
  }
}

export function loadAllData(): Promise<unknown> {
  showLoadingOverlay("Loading case file…");
  state.setLoadingStepsRemaining(2);

  // Changed to Promise.all() to wait for everything to load before loading web page
  return loadCorePeopleAndLocations().then(function () {
    return Promise.all([loadEvidenceData(), loadTimelineData()]);
  });
}

export function populateAllDropdowns(): void {
  evidence.populateEvidenceDropdowns();
  timeline.populateTimelineDropdowns();
  workspace.populateHypothesisDropdowns();
}
