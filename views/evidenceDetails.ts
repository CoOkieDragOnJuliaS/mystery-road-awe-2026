import {
  findEvidenceById,
  findPersonById,
  findLocationById,
} from "../utils/lookupHelpers.ts";
import { formatDate } from "../utils/dateHelper.ts";
import {
  loadNoteForEvidence,
  saveNoteForEvidence,
} from "../storage/localStorage.ts";
import * as state from "../state/globalState.ts";
import { renderEvidenceList } from "./evidenceBasic.ts";
import { getRequiredElement } from "../utils/dom.ts";
import {
  isEvidenceId,
  isEvidenceRelevance,
  isEvidenceStatus,
  type Evidence,
  type EvidenceId,
} from "../types/domain.ts";

// Window information for onclick?
Object.assign(window, { saveCurrentNote, closeEvidenceDetail });

// ---------------------------------------------------------------------
// EVIDENCE DETAIL
// ---------------------------------------------------------------------

export function openEvidenceDetail(evidenceId: EvidenceId): void {
  const evidenceItem = findEvidenceById(evidenceId);
  if (!evidenceItem) return;
  state.setSelectedEvidence(evidenceItem);

  const section = getRequiredElement<HTMLElement>("evidenceDetailSection");
  section.classList.remove("hidden");

  renderEvidenceDetail(evidenceItem);
  section.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function closeEvidenceDetail(): void {
  const section = getRequiredElement<HTMLElement>("evidenceDetailSection");
  section.classList.add("hidden");
  section.innerHTML = "";
  state.setSelectedEvidence(null);
}

export function renderEvidenceDetail(evidenceItem: Evidence): void {
  const section = getRequiredElement<HTMLElement>("evidenceDetailSection");

  const personNames: string[] = [];
  for (const personId of evidenceItem.personIds) {
    const person = findPersonById(personId);
    personNames.push(person ? person.name : personId);
  }

  const locationNames: string[] = [];
  for (const locationId of evidenceItem.locationIds) {
    const location = findLocationById(locationId);
    locationNames.push(
      location ? location.id + " - " + location.name : locationId,
    );
  }

  let tagsHtml = "";
  for (const tag of evidenceItem.tags) {
    tagsHtml += '<span class="tag-chip">' + tag + "</span>";
  }

  const storedNote = loadNoteForEvidence(evidenceItem.id);

  let html = "";
  html += '<div class="evidence-detail-header">';
  html += "<div><h2>" + evidenceItem.title + "</h2>";
  html +=
    '<div class="evidence-meta">' +
    evidenceItem.id +
    " &middot; " +
    evidenceItem.type +
    " &middot; " +
    formatDate(evidenceItem.timestamp) +
    "</div></div>";
  html +=
    '<button type="button" class="btn btn-secondary btn-small" onclick="closeEvidenceDetail()">Close</button>';
  html += "</div>";

  if (evidenceItem.tags.includes("critical")) {
    html +=
      '<div class="warning-banner">This item is tagged as critical evidence.</div>';
  }

  html +=
    '<div class="detail-field"><strong>Summary</strong>' +
    evidenceItem.summary +
    "</div>";
  html +=
    '<div class="evidence-detail-content">' + evidenceItem.content + "</div>";
  html +=
    '<div class="detail-field"><strong>Related people</strong>' +
    personNames.join(", ") +
    "</div>";
  html +=
    '<div class="detail-field"><strong>Related locations</strong>' +
    locationNames.join(", ") +
    "</div>";
  html +=
    '<div class="detail-field"><strong>Tags</strong>' + tagsHtml + "</div>";

  html += '<div class="detail-field"><strong>Review status</strong>';
  html += '<select id="detailStatusSelect">';
  html += statusOptionHTML(evidenceItem.status, "unreviewed", "Unreviewed");
  html += statusOptionHTML(evidenceItem.status, "reviewed", "Reviewed");
  html += statusOptionHTML(evidenceItem.status, "flagged", "Flagged");
  html += "</select></div>";

  html += '<div class="detail-field"><strong>Relevance</strong>';
  html += '<select id="detailRelevanceSelect">';
  html += statusOptionHTML(evidenceItem.relevance, "unknown", "Unknown");
  html += statusOptionHTML(evidenceItem.relevance, "relevant", "Relevant");
  html += statusOptionHTML(evidenceItem.relevance, "irrelevant", "Irrelevant");
  html += "</select></div>";

  html += '<div class="detail-field"><strong>Investigator note</strong>';
  html +=
    '<textarea id="evidenceNoteInput" class="note-textarea" rows="3" data-evidence-id="' +
    evidenceItem.id +
    '" placeholder="Add a private note about this evidence...">' +
    storedNote +
    "</textarea>";
  html +=
    '<button type="button" class="btn btn-primary btn-small" style="margin-top:6px;" onclick="saveCurrentNote()">Save note</button>';
  html += "</div>";

  html +=
    '<div class="detail-field"><strong>Note preview</strong><div id="notePreview">' +
    storedNote +
    "</div></div>";

  section.innerHTML = html;

  getRequiredElement<HTMLSelectElement>("detailStatusSelect").addEventListener(
    "change",
    function (e) {
      const target = e.target;
      if (!(target instanceof HTMLSelectElement)) return;
      if (!isEvidenceStatus(target.value)) return;

      evidenceItem.status = target.value; // direct mutation of the loaded evidence object
      renderEvidenceDetail(evidenceItem);
      // uncaught reference error
      if (state.getViewRendered().evidence) renderEvidenceList();
    },
  );
  getRequiredElement<HTMLSelectElement>(
    "detailRelevanceSelect",
  ).addEventListener("change", function (e) {
    const target = e.target;
    if (!(target instanceof HTMLSelectElement)) return;
    if (!isEvidenceRelevance(target.value)) return;

    evidenceItem.relevance = target.value;
    renderEvidenceDetail(evidenceItem);
    if (state.getViewRendered().evidence) renderEvidenceList();
  });
}

function statusOptionHTML(
  current: string,
  value: string,
  label: string,
): string {
  const selected = current.toLowerCase() === value ? " selected" : "";
  return '<option value="' + value + '"' + selected + ">" + label + "</option>";
}

function saveCurrentNote(): void {
  const textarea = getRequiredElement<HTMLTextAreaElement>("evidenceNoteInput");
  const evidenceIdValue = textarea.dataset.evidenceId;
  //Demo 7: the DOM only stores strings, so the note key must be a valid EvidenceId.
  if (!evidenceIdValue || !isEvidenceId(evidenceIdValue)) return;

  const evidenceId: EvidenceId = evidenceIdValue;
  const text = textarea.value;
  saveNoteForEvidence(evidenceId, text);
  const preview = getRequiredElement<HTMLElement>("notePreview");
  preview.innerHTML = text; // unsafe on purpose, see above
}
