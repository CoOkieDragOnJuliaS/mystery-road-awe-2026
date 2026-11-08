import * as state from "../state/globalState.ts";
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

//Exercise 6 - Demo 5: React requests the data from the local backend instead
//of reading the static JSON files directly.
const API_BASE_URL = "http://localhost:3001/api";

//Demo 6: response.json() returns JSON data but cannot prove its shape.
// T is the expected domain type
async function fetchJson<T>(resource: string): Promise<T> {
  const response = await fetch(`${API_BASE_URL}/${resource}`);

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

//Exercise 6 - Demo 5: the React owner closes the legacy shell overlay after
//the backend Promise settles, including the rejection path.
export function hideLoadingOverlay(): void {
  const overlay = document.getElementById("loadingOverlay");
  if (overlay) overlay.classList.add("hidden");
}

export function hideLoadingStep(): void {
  state.decrementLoadingStepsRemaining();
  if (state.getLoadingStepsRemaining() <= 0) {
    const overlay = document.getElementById("loadingOverlay");
    if (overlay) overlay.classList.add("hidden");
  }
}

export async function loadCorePeopleAndLocations(): Promise<void> {
  const caseJson = await fetchJson<CaseData>("case");
  state.setCaseData(caseJson);

  //or maybe also refactor it by state.setCaseData(await caseRes.json()) instead of the extra variable? But more readable perhaps with more? I will use more

  const peopleJson = await fetchJson<Person[]>("people");
  state.setAllPeople(peopleJson);

  const locationsJson = await fetchJson<Location[]>("locations");
  state.setAllLocations(locationsJson);

  hideLoadingStep();
  /*renderDashboard();
  populateAllDropdowns();*/
}

//Exercise 6 - Demo 5: backend failures remain rejected so the React owner can
//represent loading and error state separately.
export async function loadEvidenceData(): Promise<void> {
  //Demo 6: Evidence[] commits personIds to person IDs, status to
  // "unreviewed" | "reviewed" | "flagged", and relevance to a restricted union.
  const data = await fetchJson<Evidence[]>("evidence");

  state.setAllEvidence(data);
  //evidence.applyStoredBookmarkFlags();
  state.setEvidenceViewLoading(false);
  state.getFilteredEvidence();
  //renderDashboard();
  //populateAllDropdowns();
  //if (state.getCurrentPage() === "evidence") evidence.renderEvidenceList();
}

export async function loadTimelineData(): Promise<void> {
  const data = await fetchJson<TimelineEvent[]>("timeline");
  state.setAllTimeline(data);
  /*renderDashboard();

  if (state.getCurrentPage() === "timeline") timeline.renderTimeline();

  populateAllDropdowns();*/
  hideLoadingStep();
}

export function loadAllData(): Promise<unknown> {
  showLoadingOverlay("Loading case file…");
  state.setLoadingStepsRemaining(2);

  // Changed to Promise.all() to wait for everything to load before loading web page
  return loadCorePeopleAndLocations().then(function () {
    return Promise.all([loadEvidenceData(), loadTimelineData()]);
  });
}

/*export function populateAllDropdowns(): void {
  evidence.populateEvidenceDropdowns();
  timeline.populateTimelineDropdowns();
  workspace.populateHypothesisDropdowns();
}*/
