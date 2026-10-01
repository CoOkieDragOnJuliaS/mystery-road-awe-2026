// ---------------------------------------------------------------------
// GLOBAL STATE
// ---------------------------------------------------------------------

//Change from var to let to allow reassigning the variable through getter and setters
let allEvidence = [];
let filteredEvidence = [];
let selectedEvidence = null;
let bookmarks = [];
let currentPage = "dashboard";

let allPeople = [];
let allLocations = [];
let allTimeline = [];
let caseData = {};

let currentPeopleTab = "people";
let loadingStepsRemaining = 2; 


let evidenceViewLoading = true;


let viewRendered = {
  dashboard: false,
  evidence: false,
  people: false,
  timeline: false,
  workspace: false
};

let notesStore = {}; 
let modalCloseListenerCount = 0; 


// #region Getters and Setters
export function getAllEvidence() {
  return allEvidence;
}

export function setAllEvidence(evidence) {
  allEvidence = evidence;
}

export function getFilteredEvidence() {
  return filteredEvidence;
}

export function setFilteredEvidence(evidence) {
  filteredEvidence = evidence;
}

export function getSelectedEvidence() {
  return selectedEvidence;
}

export function setSelectedEvidence(evidence) {
  selectedEvidence = evidence;
}

export function getBookmarks() {
  return bookmarks;
}

export function setBookmarks(bookmarkList) {
    bookmarks = bookmarkList;
}

export function getCurrentPage() {
  return currentPage;
}

export function setCurrentPage(page) {
  currentPage = page;
}

export function getAllPeople() {
  return allPeople;
}   

export function setAllPeople(people) {
  allPeople = people;
}   

export function getAllLocations() {
  return allLocations;
}   

export function setAllLocations(locations) {
  allLocations = locations;
}   

export function getAllTimeline() {
  return allTimeline;
}   

export function setAllTimeline(timeline) {
  allTimeline = timeline;
}   

export function getCaseData() {
  return caseData;
}   

export function setCaseData(data) {
  caseData = data;
}

export function getCurrentPeopleTab() {
  return currentPeopleTab;
}

export function setCurrentPeopleTab(tab) {
  currentPeopleTab = tab;
}

export function getLoadingStepsRemaining() {
  return loadingStepsRemaining;
}

export function setLoadingStepsRemaining(steps) {
  loadingStepsRemaining = steps;
}

export function incrementLoadingStepsRemaining() {
  loadingStepsRemaining++;
}

export function decrementLoadingStepsRemaining() {
  if (loadingStepsRemaining > 0) {
    loadingStepsRemaining--;
  }
}

export function getEvidenceViewLoading() {
  return evidenceViewLoading;
}

export function setEvidenceViewLoading(loading) {
  evidenceViewLoading = loading;
}

export function getViewRendered() {
  return viewRendered;
}

export function setViewRendered(view, rendered) {
  viewRendered[view] = rendered;
}

export function resetViewRendered() {
  viewRendered = {
    dashboard: false,
    evidence: false,
    people: false,
    timeline: false,
    workspace: false
  };
}

export function getNotesStore() {
  return notesStore;
}

export function setNotesStore(store) {
  notesStore = store;
}

export function getModalCloseListenerCount() {
  return modalCloseListenerCount;
}

export function setModalCloseListenerCount(count) {
  modalCloseListenerCount = count;
}   

export function incrementModalCloseListenerCount() {
  modalCloseListenerCount++;
}

export function decrementModalCloseListenerCount() {
  if (modalCloseListenerCount > 0) {
    modalCloseListenerCount--;
    } 
}

export function resetGlobalState() {
  allEvidence = [];
  filteredEvidence = []; 
}

// #endregion
