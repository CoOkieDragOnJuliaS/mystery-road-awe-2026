import * as storage from "../storage/localStorage.ts";
import * as state from "../state/globalState.ts";
import { navigateTo } from "../navigation/router.ts";
import { openEvidenceDetail } from "./evidenceDetails.ts";
import { getElement } from "../utils/dom.ts";
import {
  isEvidenceId,
  type EvidenceId,
} from "../types/domain.ts";
// ---------------------------------------------------------------------
// WORKSPACE
// ---------------------------------------------------------------------

interface NoteEntry {
  index: number;
  evidenceId: EvidenceId;
  title: string;
  text: string;
}

export function renderWorkspace(): void {
  renderBookmarksList();
  renderNotesList();
  populateHypothesisDropdowns();
  storage.loadHypothesisFromStorage();
}

export function renderBookmarksList(): void {
  const container = getElement<HTMLElement>("bookmarksList");
  if (!container) return;

  const allEvidence = state.getAllEvidence();
  const bookmarkedItems = allEvidence.filter(function (evidenceItem) {
    return evidenceItem.bookmarked;
  });

  if (bookmarkedItems.length === 0) {
    container.innerHTML =
      "<p>No bookmarked evidence yet. Bookmark items from the Evidence view.</p>";
    return;
  }

  let html = "";
  for (const evidenceItem of bookmarkedItems) {
    html +=
      '<div class="mini-list-item"><strong>' +
      evidenceItem.id +
      "</strong> &mdash; " +
      evidenceItem.title +
      ' <button type="button" class="btn btn-small btn-secondary" data-open-evidence="' +
      evidenceItem.id +
      '">Open</button></div>';
  }
  container.innerHTML = html;

  const openButtons = container.querySelectorAll<HTMLElement>(
    "[data-open-evidence]",
  );
  openButtons.forEach((button) => {
    button.addEventListener("click", function (e) {
      const target = e.currentTarget;
      if (!(target instanceof HTMLElement)) return;

      const id = target.dataset.openEvidence;
      if (!id || !isEvidenceId(id)) return;

      //Demo 7: imports that were only global/undefined in JS are explicit here.
      navigateTo("evidence");
      setTimeout(function () {
        openEvidenceDetail(id);
      }, 0);
    });
  });
}

export function renderNotesList(): void {
  const container = getElement<HTMLElement>("notesList");
  if (!container) return;

  const noteEntries: NoteEntry[] = [];
  const notesStore = state.getNotesStore();
  state.getAllEvidence().forEach((evidenceItem, index) => {
    const note = notesStore[evidenceItem.id];
    if (note) {
      noteEntries.push({
        index,
        evidenceId: evidenceItem.id,
        title: evidenceItem.title,
        text: note,
      });
    }
  });

  if (noteEntries.length === 0) {
    container.innerHTML =
      "<p>No notes yet. Add one from an evidence item's detail view.</p>";
    return;
  }

  let html = "";
  for (const entry of noteEntries) {
    html +=
      '<div class="mini-list-item"><strong>' +
      entry.evidenceId +
      "</strong> &mdash; " +
      entry.title;
    html +=
      '<div id="noteText-' + entry.index + '">' + entry.text + "</div></div>"; // unsafe innerHTML rendering, same as the note preview
  }
  container.innerHTML = html;
}

export function populateHypothesisDropdowns(): void {
  const suspectSelect = getElement<HTMLSelectElement>("hypSuspect");
  const evidenceSelect = getElement<HTMLSelectElement>("hypEvidence");
  if (!suspectSelect || !evidenceSelect) return;

  const currentSuspect = suspectSelect.value;
  suspectSelect.innerHTML = '<option value="">Select a person…</option>';
  for (const person of state.getAllPeople()) {
    suspectSelect.innerHTML +=
      '<option value="' + person.id + '">' + person.name + "</option>";
  }
  suspectSelect.value = currentSuspect;

  evidenceSelect.innerHTML = "";
  for (const evidenceItem of state.getAllEvidence()) {
    evidenceSelect.innerHTML +=
      '<option value="' +
      evidenceItem.id +
      '">' +
      evidenceItem.id +
      " - " +
      evidenceItem.title +
      "</option>";
  }
}
