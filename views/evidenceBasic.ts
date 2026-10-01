import * as state from "../state/globalState.ts";
import {
  findEvidenceById,
  findPersonById,
  evidenceMentionsPerson,
} from "../utils/lookupHelpers.ts";
import { formatDate } from "../utils/dateHelper.ts";
import {
  getStatusBadgeClass,
  getRelevanceBadgeClass,
} from "../utils/badgeHelper.ts";
import { saveBookmarksToStorage } from "../storage/localStorage.ts";
import { openEvidenceDetail } from "./evidenceDetails.ts";
import { getElement, getRequiredElement } from "../utils/dom.ts";
import {
  isEvidenceId,
  isLocationId,
  isPersonId,
  type Evidence,
  type EvidenceId,
} from "../types/domain.ts";
// ---------------------------------------------------------------------
// EVIDENCE CATALOGUE
// ---------------------------------------------------------------------

export function populateEvidenceDropdowns(): void {
  const typeSelect = getElement<HTMLSelectElement>("filterType");
  const personSelect = getElement<HTMLSelectElement>("filterPerson");
  const locationSelect = getElement<HTMLSelectElement>("filterLocation");
  if (!typeSelect || !personSelect || !locationSelect) return;

  const types: string[] = [];
  for (const evidenceItem of state.getAllEvidence()) {
    const type = evidenceItem.type.toLowerCase();
    if (!types.includes(type)) types.push(type);
  }
  typeSelect.innerHTML = '<option value="">All types</option>';
  for (const type of types) {
    typeSelect.innerHTML +=
      '<option value="' + type + '">' + type + "</option>";
  }

  personSelect.innerHTML = '<option value="">All people</option>';
  for (const person of state.getAllPeople()) {
    personSelect.innerHTML +=
      '<option value="' + person.id + '">' + person.name + "</option>";
  }

  locationSelect.innerHTML = '<option value="">All locations</option>';
  for (const location of state.getAllLocations()) {
    locationSelect.innerHTML +=
      '<option value="' +
      location.id +
      '">' +
      location.id +
      " - " +
      location.name +
      "</option>";
  }
}

export function getFilteredEvidence(): Evidence[] {
  const searchBox = getElement<HTMLInputElement>("evidenceSearch");
  const searchTerm = searchBox ? searchBox.value.toLowerCase().trim() : "";
  const typeVal = getRequiredElement<HTMLSelectElement>("filterType").value;
  const personVal = getRequiredElement<HTMLSelectElement>("filterPerson").value;
  const locationVal =
    getRequiredElement<HTMLSelectElement>("filterLocation").value;
  const statusVal = getRequiredElement<HTMLSelectElement>("filterStatus").value;
  const relevanceVal = getRequiredElement<HTMLSelectElement>(
    "filterRelevance",
  ).value;

  const results: Evidence[] = [];
  for (const item of state.getAllEvidence()) {
    let matches = true;

    if (searchTerm) {
      const haystack = (
        item.title +
        " " +
        item.summary +
        " " +
        item.tags.join(" ")
      ).toLowerCase();
      if (!haystack.includes(searchTerm)) matches = false;
    }
    if (matches && typeVal && item.type.toLowerCase() !== typeVal)
      matches = false;
    if (matches && personVal) {
      //Demo 7: select values are plain strings; personVal is narrowed to PersonId.
      const person = isPersonId(personVal) ? findPersonById(personVal) : null;
      if (!person || !evidenceMentionsPerson(item, person)) matches = false;
    }
    if (matches && locationVal) {
      const locationMatches =
        isLocationId(locationVal) && item.locationIds.includes(locationVal);
      if (!locationMatches) matches = false;
    }
    if (matches && statusVal && item.status !== statusVal) matches = false;
    if (matches && relevanceVal && item.relevance !== relevanceVal) {
      matches = false;
    }

    if (matches) results.push(item);
  }

  const sortValue = getRequiredElement<HTMLSelectElement>(
    "sortEvidence",
  ).value;

  if (sortValue === "title-asc") {
    results.sort((a, b) => a.title.localeCompare(b.title));
  } else if (sortValue === "title-desc") {
    results.sort((a, b) => b.title.localeCompare(a.title));
  } else if (sortValue === "date-asc") {
    results.sort(
      (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
    );
  } else {
    results.sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
    );
  }

  state.setFilteredEvidence(results);
  return results;
}

export function renderEvidenceList(): void {
  const container = getElement<HTMLElement>("evidenceList");
  if (!container) return;

  const loadingIndicator = getElement<HTMLElement>(
    "evidenceLoadingIndicator",
  );
  if (state.getEvidenceViewLoading()) {
    if (loadingIndicator) loadingIndicator.classList.remove("hidden");
    container.innerHTML = "";
    return;
  }
  if (loadingIndicator) loadingIndicator.classList.add("hidden");

  const results = getFilteredEvidence();

  let html = "";
  if (results.length === 0) {
    html = "<p>No evidence matches the current filters.</p>";
  }
  for (const item of results) {
    html += renderEvidenceCardHTML(item);
  }
  container.innerHTML = html;

  // Event delegation for card clicks / bookmark button.
  container.addEventListener("click", handleEvidenceListClick);
}

//Code Smell 1 - not needed
function renderEvidenceCardHTML(evidenceItem: Evidence): string {
  const bookmarks = state.getBookmarks();
  const isBookmarked = bookmarks.includes(evidenceItem.id);
  let html = '<div class="evidence-card" data-id="' + evidenceItem.id + '">';
  html +=
    '<button class="bookmark-btn ' +
    (isBookmarked ? "active" : "") +
    '" data-action="bookmark" data-id="' +
    evidenceItem.id +
    '" aria-label="Toggle bookmark for ' +
    evidenceItem.title +
    '"><span class="bookmark-icon">' +
    (isBookmarked ? "★" : "☆") +
    "</span></button>";
  html += "<h3>" + evidenceItem.title + "</h3>";
  html +=
    '<div class="evidence-meta">' +
    evidenceItem.id +
    " &middot; " +
    evidenceItem.type +
    " &middot; " +
    formatDate(evidenceItem.timestamp) +
    "</div>";
  html += '<div class="evidence-summary">' + evidenceItem.summary + "</div>";

  if (evidenceItem.tags.includes("critical")) {
    html += '<span class="badge badge-critical">Critical</span>';
  }
  html +=
    '<span class="badge ' +
    getStatusBadgeClass(evidenceItem.status) +
    '">' +
    evidenceItem.status +
    "</span>";
  html +=
    '<span class="badge ' +
    getRelevanceBadgeClass(evidenceItem.relevance) +
    '">' +
    evidenceItem.relevance +
    "</span>";
  html += "<div>";
  for (const tag of evidenceItem.tags) {
    html += '<span class="tag-chip">' + tag + "</span>";
  }
  html += "</div>";
  html += "</div>";
  return html;
}

// Code Smell 2 - not needed
function handleEvidenceListClick(event: Event): void {
  const target = event.target;
  if (!(target instanceof HTMLElement)) return;

  if (target.dataset.action === "bookmark") {
    event.stopPropagation();
    const evidenceId = target.dataset.id;
    if (evidenceId && isEvidenceId(evidenceId)) handleBookmarkClick(evidenceId);
    return;
  }

  const card = target.closest<HTMLElement>(".evidence-card");
  const evidenceId = card?.dataset.id;
  if (evidenceId && isEvidenceId(evidenceId)) {
    openEvidenceDetail(evidenceId);
  }
}

// Code Smell 3 - not needed
function handleBookmarkClick(evidenceId: EvidenceId): void {
  const evidenceItem = findEvidenceById(evidenceId);
  if (!evidenceItem) return;
  const bookmarks = state.getBookmarks();
  if (!bookmarks.includes(evidenceId)) {
    state.setBookmarks([...bookmarks, evidenceId]);
    evidenceItem.bookmarked = true;
  } else {
    state.setBookmarks(bookmarks.filter((id) => id !== evidenceId));
    evidenceItem.bookmarked = false;
  }
  saveBookmarksToStorage();
  //Demo 7: the previous undeclared global `currentPage` became an explicit state lookup.
  if (state.getCurrentPage() === "evidence") renderEvidenceList();
}

export function applyStoredBookmarkFlags(): void {
  const bookmarks = state.getBookmarks();
  for (const evidenceItem of state.getAllEvidence()) {
    evidenceItem.bookmarked = bookmarks.includes(evidenceItem.id);
  }
}

export function handleSortChange(): void {
  renderEvidenceList();
}

export function clearFilters(): void {
  getRequiredElement<HTMLInputElement>("evidenceSearch").value = "";
  getRequiredElement<HTMLSelectElement>("filterType").value = "";
  getRequiredElement<HTMLSelectElement>("filterPerson").value = "";
  getRequiredElement<HTMLSelectElement>("filterLocation").value = "";
  getRequiredElement<HTMLSelectElement>("filterStatus").value = "";
  getRequiredElement<HTMLSelectElement>("filterRelevance").value = "";
  getRequiredElement<HTMLSelectElement>("sortEvidence").value = "date-desc";
  renderEvidenceList();
}

function simulateAsyncSearch(term: string): Promise<string> {
  return new Promise(function (resolve) {
    setTimeout(function () {
      resolve(term);
    }, 300);
  });
}

let latestSearchRequestId = 0;

export function handleSearchInput(event: Event): void {
  const target = event.target;
  if (!(target instanceof HTMLInputElement)) return;

  const term = target.value;
  const requestId = ++latestSearchRequestId;

  void simulateAsyncSearch(term).then(function (_resolvedTerm) {
    // Only apply this response if nothing newer has been typed meanwhile.
    if (requestId !== latestSearchRequestId) return;
    renderEvidenceList();
  });
}
