import type {
  CaseData,
  Evidence,
  Location,
  Person,
  TimelineEvent,
} from "../types/domain.ts";

//Exercise 6 - Demo 9: this module is the thin API-access layer. It knows
//backend URLs and response types, but it does not own React or application UI.
const API_BASE_URL = "http://localhost:3001/api";

function getDemoQuery(): string {
  return window.location.search;
}

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

  return (await response.json()) as T;
}

export function fetchCaseData(signal?: AbortSignal): Promise<CaseData> {
  return fetchJson<CaseData>("case", signal);
}

export function fetchEvidenceData(signal?: AbortSignal): Promise<Evidence[]> {
  return fetchJson<Evidence[]>("evidence", signal);
}

export function fetchPeopleData(signal?: AbortSignal): Promise<Person[]> {
  return fetchJson<Person[]>("people", signal);
}

export function fetchLocationsData(signal?: AbortSignal): Promise<Location[]> {
  return fetchJson<Location[]>("locations", signal);
}

export function fetchTimelineData(
  signal?: AbortSignal,
): Promise<TimelineEvent[]> {
  return fetchJson<TimelineEvent[]>("timeline", signal);
}
