import * as state from "../state/globalState.js";

const STORAGE_KEY_BOOKMARKS = "remotion_bookmarks";
const STORAGE_KEY_NOTES = "remotion_notes";
export const STORAGE_KEY_HYPOTHESIS = "remotion_hypothesis";
// ---------------------------------------------------------------------
// LOCAL STORAGE HELPERS (bookmarks & notes)
// ---------------------------------------------------------------------

//Refactor arrow function
export const saveBookmarksToStorage = () => {
  localStorage.setItem(
    STORAGE_KEY_BOOKMARKS,
    JSON.stringify(state.getBookmarks()),
  );
};

export function loadBookmarksFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_BOOKMARKS);
    const parsed = raw ? JSON.parse(raw) : [];
    state.setBookmarks(Array.isArray(parsed) ? parsed : []);
  } catch (err) {
    console.warn("Could not read stored bookmarks, starting empty", err);
    state.setBookmarks([]);
  }
}

export function saveNoteForEvidence(evidenceId, text) {
  const notesStore = state.getNotesStore();
  notesStore[evidenceId] = text;
  state.setNotesStore(notesStore);
  localStorage.setItem(
    STORAGE_KEY_NOTES,
    JSON.stringify(state.getNotesStore()),
  );
}

export function loadNoteForEvidence(evidenceId) {
  return state.getNotesStore()[evidenceId] || "";
}

export function loadNotesFromStorage() {
  const raw = localStorage.getItem(STORAGE_KEY_NOTES);
  if (!raw) {
    state.setNotesStore({});
    return;
  }

  state.setNotesStore(JSON.parse(raw));
}

export function loadNoteAsync(evidenceId) {
  return new Promise(function (resolve) {
    resolve(state.getNotesStore()[evidenceId] || "");
  });
}

export function loadHypothesisFromStorage() {
  const raw = localStorage.getItem(STORAGE_KEY_HYPOTHESIS);
  if (!raw) return;

  const draft = JSON.parse(raw);

  document.getElementById("hypSuspect").value = draft.suspectId || "";
  document.getElementById("hypNature").value = draft.nature || "";
  document.getElementById("hypConfidence").value = draft.confidence || 50;
  document.getElementById("hypConfidenceValue").textContent =
    draft.confidence || 50;
  document.getElementById("hypExplanation").value = draft.explanation || "";
  document.getElementById("hypAlternative").value = draft.alternative || "";

  const evidenceSelect = document.getElementById("hypEvidence");
  const savedIds = draft.evidenceIds || [];
  for (let i = 0; i < evidenceSelect.options.length; i++) {
    evidenceSelect.options[i].selected =
      savedIds.indexOf(evidenceSelect.options[i].value) !== -1;
  }
}

export function saveHypothesis() {
  const draft = {
    suspectId: document.getElementById("hypSuspect").value,
    nature: document.getElementById("hypNature").value,
    evidenceIds: getSelectedOptions(document.getElementById("hypEvidence")),
    confidence: document.getElementById("hypConfidence").value,
    explanation: document.getElementById("hypExplanation").value,
    alternative: document.getElementById("hypAlternative").value,
    savedAt: new Date().toISOString(),
  };

  try {
    localStorage.setItem(STORAGE_KEY_HYPOTHESIS, JSON.stringify(draft));
  } catch (err) {
    console.error("Could not save hypothesis draft", err);
    alert("Your hypothesis could not be saved to local storage.");
    return;
  }

  const msg = document.getElementById("hypothesisSavedMsg");
  msg.classList.remove("hidden");
  setTimeout(function () {
    msg.classList.add("hidden");
  }, 2000);
}

export function getSelectedOptions(selectEl) {
  const result = [];
  for (let i = 0; i < selectEl.options.length; i++) {
    if (selectEl.options[i].selected) result.push(selectEl.options[i].value);
  }
  return result;
}
