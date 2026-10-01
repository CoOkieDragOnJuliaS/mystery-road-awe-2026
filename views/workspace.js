import * as storage from "../storage/localStorage.js";
import * as state from "../state/globalState.js";
// ---------------------------------------------------------------------
// WORKSPACE
// ---------------------------------------------------------------------

export function renderWorkspace() {
  renderBookmarksList();
  renderNotesList();
  populateHypothesisDropdowns();
  storage.loadHypothesisFromStorage();
}

export function renderBookmarksList() {
  const container = document.getElementById("bookmarksList");
  if (!container) return;

  const allEvidence = state.getAllEvidence();
  const bookmarkedItems = allEvidence.filter(function (ev) {
    return ev.bookmarked;
  });

  if (bookmarkedItems.length === 0) {
    container.innerHTML =
      "<p>No bookmarked evidence yet. Bookmark items from the Evidence view.</p>";
    return;
  }

  let html = "";
  for (let i = 0; i < bookmarkedItems.length; i++) {
    const ev = bookmarkedItems[i];
    html +=
      '<div class="mini-list-item"><strong>' +
      ev.id +
      "</strong> &mdash; " +
      ev.title +
      ' <button type="button" class="btn btn-small btn-secondary" data-open-evidence="' +
      ev.id +
      '">Open</button></div>';
  }
  container.innerHTML = html;

  const openButtons = container.querySelectorAll("[data-open-evidence]");
  for (let b = 0; b < openButtons.length; b++) {
    openButtons[b].addEventListener("click", function (e) {
      navigateTo("evidence");
      const id = e.target.getAttribute("data-open-evidence");
      setTimeout(function () {
        openEvidenceDetail(id);
      }, 0);
    });
  }
}

export function renderNotesList() {
  const container = document.getElementById("notesList");
  if (!container) return;

  const allEvidence = state.getAllEvidence();
  const noteEntries = [];
  const notesStore = state.getNotesStore();
  for (let i = 0; i < allEvidence.length; i++) {
    const note = notesStore[allEvidence[i].id];
    if (note) {
      noteEntries.push({
        index: i,
        evidenceId: allEvidence[i].id,
        title: allEvidence[i].title,
        text: note,
      });
    }
  }

  if (noteEntries.length === 0) {
    container.innerHTML =
      "<p>No notes yet. Add one from an evidence item's detail view.</p>";
    return;
  }

  let html = "";
  for (let n = 0; n < noteEntries.length; n++) {
    const entry = noteEntries[n];
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

export function populateHypothesisDropdowns() {
  const suspectSelect = document.getElementById("hypSuspect");
  const evidenceSelect = document.getElementById("hypEvidence");
  if (!suspectSelect || !evidenceSelect) return;

  const currentSuspect = suspectSelect.value;
  suspectSelect.innerHTML = '<option value="">Select a person…</option>';
  const allPeople = state.getAllPeople();
  for (let p = 0; p < allPeople.length; p++) {
    suspectSelect.innerHTML +=
      '<option value="' +
      allPeople[p].id +
      '">' +
      allPeople[p].name +
      "</option>";
  }
  suspectSelect.value = currentSuspect;

  evidenceSelect.innerHTML = "";
  const allEvidence = state.getAllEvidence();
  for (let i = 0; i < allEvidence.length; i++) {
    evidenceSelect.innerHTML +=
      '<option value="' +
      allEvidence[i].id +
      '">' +
      allEvidence[i].id +
      " - " +
      allEvidence[i].title +
      "</option>";
  }
}
