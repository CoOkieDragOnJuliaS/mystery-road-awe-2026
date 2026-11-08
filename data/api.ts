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

//Exercise 6 - Demo 6: forward optional delay, error, and empty controls from
//the browser URL so the three data states can be demonstrated live.
function getDemoQuery(): string {
  return window.location.search;
}

//Demo 6: response.json() returns JSON data but cannot prove its shape.
// T is the expected domain type
//Exercise 6 - Demo 7: every backend fetch accepts the signal owned by the
//effect so an obsolete request can be cancelled before it commits data.
async function fetchJson<T>(
  resource: string,
  signal?: AbortSignal,
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}/${resource}${getDemoQuery()}`, {
    signal,
  });

  if (!response.ok) {
    throw new Error(`${response.url}: HTTP ${response.status}`);
  }

  const data: unknown = await response.json();
  return data as T;
}

function throwIfAborted(signal?: AbortSignal): void {
  if (signal?.aborted) {
    throw new DOMException("Request was cancelled", "AbortError");
  }
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

export async function loadCorePeopleAndLocations(
  signal?: AbortSignal,
): Promise<void> {
  const caseJson = await fetchJson<CaseData>("case", signal);
  throwIfAborted(signal);
  state.setCaseData(caseJson);

  //or maybe also refactor it by state.setCaseData(await caseRes.json()) instead of the extra variable? But more readable perhaps with more? I will use more

  const peopleJson = await fetchJson<Person[]>("people", signal);
  throwIfAborted(signal);
  state.setAllPeople(peopleJson);

  const locationsJson = await fetchJson<Location[]>("locations", signal);
  throwIfAborted(signal);
  state.setAllLocations(locationsJson);

  hideLoadingStep();
  /*renderDashboard();
  populateAllDropdowns();*/
}

//Exercise 6 - Demo 5: backend failures remain rejected so the React owner can
//represent loading and error state separately.
export async function loadEvidenceData(signal?: AbortSignal): Promise<void> {
  //Demo 6: Evidence[] commits personIds to person IDs, status to
  // "unreviewed" | "reviewed" | "flagged", and relevance to a restricted union.
  const data = await fetchJson<Evidence[]>("evidence", signal);
  throwIfAborted(signal);

  state.setAllEvidence(data);
  //evidence.applyStoredBookmarkFlags();
  state.setEvidenceViewLoading(false);
  state.getFilteredEvidence();
  //renderDashboard();
  //populateAllDropdowns();
  //if (state.getCurrentPage() === "evidence") evidence.renderEvidenceList();
}

export async function loadTimelineData(signal?: AbortSignal): Promise<void> {
  const data = await fetchJson<TimelineEvent[]>("timeline", signal);
  throwIfAborted(signal);
  state.setAllTimeline(data);
  /*renderDashboard();

  if (state.getCurrentPage() === "timeline") timeline.renderTimeline();

  populateAllDropdowns();*/
  hideLoadingStep();
}

export function loadAllData(signal?: AbortSignal): Promise<unknown> {
  showLoadingOverlay("Loading case file…");
  state.setLoadingStepsRemaining(2);

  // Changed to Promise.all() to wait for everything to load before loading web page
  return loadCorePeopleAndLocations(signal).then(function () {
    return Promise.all([loadEvidenceData(signal), loadTimelineData(signal)]);
  });
}

/*export function populateAllDropdowns(): void {
  evidence.populateEvidenceDropdowns();
  timeline.populateTimelineDropdowns();
  workspace.populateHypothesisDropdowns();
}*/
