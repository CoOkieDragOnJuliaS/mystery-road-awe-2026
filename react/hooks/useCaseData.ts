import {
  fetchCaseData,
  fetchEvidenceData,
  fetchLocationsData,
  fetchPeopleData,
  fetchTimelineData,
} from "../../data/api.ts";
import * as state from "../../state/globalState.ts";
import type {
  CaseData,
  Evidence,
  Location,
  Person,
  TimelineEvent,
} from "../../types/domain.ts";
import { useBackendData } from "./useBackendData.ts";

interface CaseDataBundle {
  caseData: CaseData;
  evidence: Evidence[];
  people: Person[];
  locations: Location[];
  timeline: TimelineEvent[];
}

function throwIfAborted(signal: AbortSignal): void {
  if (signal.aborted) {
    throw new DOMException("Request was cancelled", "AbortError");
  }
}

//Exercise 6 - Demo 9: this hook is the application-logic layer. It coordinates
//the raw API functions and commits the complete bundle to global state.
async function loadCaseData(signal: AbortSignal): Promise<CaseDataBundle> {
  const [caseData, evidence, people, locations, timeline] = await Promise.all([
    fetchCaseData(signal),
    fetchEvidenceData(signal),
    fetchPeopleData(signal),
    fetchLocationsData(signal),
    fetchTimelineData(signal),
  ]);

  throwIfAborted(signal);
  state.setCaseData(caseData);
  state.setAllEvidence(evidence);
  state.setAllPeople(people);
  state.setAllLocations(locations);
  state.setAllTimeline(timeline);
  state.setEvidenceViewLoading(false);

  return { caseData, evidence, people, locations, timeline };
}

export function useCaseData() {
  return useBackendData(loadCaseData);
}
