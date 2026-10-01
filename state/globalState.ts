import type {
  CaseData,
  Evidence,
  EvidenceId,
  Location,
  NotesStore,
  PeopleTab,
  Person,
  TimelineEvent,
  ViewName,
  ViewRendered,
} from "../types/domain.ts";

// ---------------------------------------------------------------------
// GLOBAL STATE
// ---------------------------------------------------------------------

//Change from var to let to allow reassigning the variable through getter and setters
let allEvidence: Evidence[] = [];
let filteredEvidence: Evidence[] = [];
let selectedEvidence: Evidence | null = null;
let bookmarks: EvidenceId[] = [];
let currentPage: ViewName = "dashboard";

let allPeople: Person[] = [];
let allLocations: Location[] = [];
let allTimeline: TimelineEvent[] = [];
let caseData: CaseData | null = null;

let currentPeopleTab: PeopleTab = "people";
let loadingStepsRemaining = 2;

let evidenceViewLoading = true;

let viewRendered: ViewRendered = {
  dashboard: false,
  evidence: false,
  people: false,
  timeline: false,
  workspace: false,
};

let notesStore: NotesStore = {};
let modalCloseListenerCount = 0;

// #region Getters and Setters
export function getAllEvidence(): Evidence[] {
  return allEvidence;
}

export function setAllEvidence(evidence: Evidence[]): void {
  allEvidence = evidence;
}

export function getFilteredEvidence(): Evidence[] {
  return filteredEvidence;
}

export function setFilteredEvidence(evidence: Evidence[]): void {
  filteredEvidence = evidence;
}

export function getSelectedEvidence(): Evidence | null {
  return selectedEvidence;
}

export function setSelectedEvidence(evidence: Evidence | null): void {
  selectedEvidence = evidence;
}

export function getBookmarks(): EvidenceId[] {
  return bookmarks;
}

export function setBookmarks(bookmarkList: EvidenceId[]): void {
  bookmarks = bookmarkList;
}

export function getCurrentPage(): ViewName {
  return currentPage;
}

export function setCurrentPage(page: ViewName): void {
  currentPage = page;
}

export function getAllPeople(): Person[] {
  return allPeople;
}

export function setAllPeople(people: Person[]): void {
  allPeople = people;
}

export function getAllLocations(): Location[] {
  return allLocations;
}

export function setAllLocations(locations: Location[]): void {
  allLocations = locations;
}

export function getAllTimeline(): TimelineEvent[] {
  return allTimeline;
}

export function setAllTimeline(timeline: TimelineEvent[]): void {
  allTimeline = timeline;
}

export function getCaseData(): CaseData | null {
  return caseData;
}

export function setCaseData(data: CaseData | null): void {
  caseData = data;
}

export function getCurrentPeopleTab(): PeopleTab {
  return currentPeopleTab;
}

export function setCurrentPeopleTab(tab: PeopleTab): void {
  currentPeopleTab = tab;
}

export function getLoadingStepsRemaining(): number {
  return loadingStepsRemaining;
}

export function setLoadingStepsRemaining(steps: number): void {
  loadingStepsRemaining = steps;
}

export function incrementLoadingStepsRemaining(): void {
  loadingStepsRemaining++;
}

export function decrementLoadingStepsRemaining(): void {
  if (loadingStepsRemaining > 0) {
    loadingStepsRemaining--;
  }
}

export function getEvidenceViewLoading(): boolean {
  return evidenceViewLoading;
}

export function setEvidenceViewLoading(loading: boolean): void {
  evidenceViewLoading = loading;
}

export function getViewRendered(): ViewRendered {
  return viewRendered;
}

export function setViewRendered(
  view: keyof ViewRendered,
  rendered: boolean,
): void {
  viewRendered[view] = rendered;
}

export function resetViewRendered(): void {
  viewRendered = {
    dashboard: false,
    evidence: false,
    people: false,
    timeline: false,
    workspace: false,
  };
}

export function getNotesStore(): NotesStore {
  return notesStore;
}

export function setNotesStore(store: NotesStore): void {
  notesStore = store;
}

export function getModalCloseListenerCount(): number {
  return modalCloseListenerCount;
}

export function setModalCloseListenerCount(count: number): void {
  modalCloseListenerCount = count;
}

export function incrementModalCloseListenerCount(): void {
  modalCloseListenerCount++;
}

export function decrementModalCloseListenerCount(): void {
  if (modalCloseListenerCount > 0) {
    modalCloseListenerCount--;
  }
}

export function resetGlobalState(): void {
  allEvidence = [];
  filteredEvidence = [];
}

// #endregion
