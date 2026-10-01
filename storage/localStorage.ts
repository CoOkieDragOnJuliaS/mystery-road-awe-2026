import * as state from "../state/globalState.ts";
import { getRequiredElement } from "../utils/dom.ts";
import {
  isEvidenceId,
  isPersonId,
  type EvidenceId,
  type HypothesisDraft,
  type NotesStore,
} from "../types/domain.ts";

const STORAGE_KEY_BOOKMARKS = "remotion_bookmarks";
const STORAGE_KEY_NOTES = "remotion_notes";
export const STORAGE_KEY_HYPOTHESIS = "remotion_hypothesis";
// ---------------------------------------------------------------------
// LOCAL STORAGE HELPERS (bookmarks & notes)
// ---------------------------------------------------------------------

function isEvidenceIdArray(value: unknown): value is EvidenceId[] {
  return Array.isArray(value) && value.every(isEvidenceId);
}

function isNotesStore(value: unknown): value is NotesStore {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isHypothesisDraft(value: unknown): value is HypothesisDraft {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return false;
  }

  const draft = value as Partial<HypothesisDraft>;
  return (
    typeof draft.suspectId === "string" &&
    typeof draft.nature === "string" &&
    isEvidenceIdArray(draft.evidenceIds) &&
    typeof draft.confidence === "number" &&
    typeof draft.explanation === "string" &&
    typeof draft.alternative === "string"
  );
}

//Refactor arrow function
export const saveBookmarksToStorage = (): void => {
  localStorage.setItem(
    STORAGE_KEY_BOOKMARKS,
    JSON.stringify(state.getBookmarks()),
  );
};

export function loadBookmarksFromStorage(): void {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_BOOKMARKS);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    state.setBookmarks(isEvidenceIdArray(parsed) ? parsed : []);
  } catch (err) {
    console.warn("Could not read stored bookmarks, starting empty", err);
    state.setBookmarks([]);
  }
}

export function saveNoteForEvidence(
  evidenceId: EvidenceId,
  text: string,
): void {
  const notesStore = { ...state.getNotesStore() };
  notesStore[evidenceId] = text;
  state.setNotesStore(notesStore);
  localStorage.setItem(STORAGE_KEY_NOTES, JSON.stringify(notesStore));
}

export function loadNoteForEvidence(evidenceId: EvidenceId): string {
  return state.getNotesStore()[evidenceId] ?? "";
}

export function loadNotesFromStorage(): void {
  const raw = localStorage.getItem(STORAGE_KEY_NOTES);
  if (!raw) {
    state.setNotesStore({});
    return;
  }

  const parsed: unknown = JSON.parse(raw);
  state.setNotesStore(isNotesStore(parsed) ? parsed : {});
}

export function loadNoteAsync(evidenceId: EvidenceId): Promise<string> {
  return Promise.resolve(loadNoteForEvidence(evidenceId));
}

export function loadHypothesisFromStorage(): void {
  const raw = localStorage.getItem(STORAGE_KEY_HYPOTHESIS);
  if (!raw) return;

  const parsed: unknown = JSON.parse(raw);
  if (!isHypothesisDraft(parsed)) return;

  const draft = parsed;
  getRequiredElement<HTMLSelectElement>("hypSuspect").value = draft.suspectId;
  getRequiredElement<HTMLSelectElement>("hypNature").value = draft.nature;
  getRequiredElement<HTMLInputElement>("hypConfidence").value = String(
    draft.confidence,
  );
  getRequiredElement<HTMLElement>("hypConfidenceValue").textContent = String(
    draft.confidence,
  );
  getRequiredElement<HTMLTextAreaElement>("hypExplanation").value =
    draft.explanation;
  getRequiredElement<HTMLTextAreaElement>("hypAlternative").value =
    draft.alternative;

  const evidenceSelect = getRequiredElement<HTMLSelectElement>("hypEvidence");
  const savedIds = draft.evidenceIds;
  Array.from(evidenceSelect.options).forEach((option) => {
    option.selected = savedIds.includes(option.value as EvidenceId);
  });
}

export function saveHypothesis(): void {
  const suspectValue =
    getRequiredElement<HTMLSelectElement>("hypSuspect").value;
  const draft: HypothesisDraft = {
    suspectId: isPersonId(suspectValue) ? suspectValue : "",
    nature: getRequiredElement<HTMLSelectElement>("hypNature").value,
    evidenceIds: getSelectedOptions(
      getRequiredElement<HTMLSelectElement>("hypEvidence"),
    ),
    confidence: Number(
      getRequiredElement<HTMLInputElement>("hypConfidence").value,
    ),
    explanation:
      getRequiredElement<HTMLTextAreaElement>("hypExplanation").value,
    alternative:
      getRequiredElement<HTMLTextAreaElement>("hypAlternative").value,
    savedAt: new Date().toISOString(),
  };

  try {
    localStorage.setItem(STORAGE_KEY_HYPOTHESIS, JSON.stringify(draft));
  } catch (err) {
    console.error("Could not save hypothesis draft", err);
    alert("Your hypothesis could not be saved to local storage.");
    return;
  }

  const msg = getRequiredElement<HTMLElement>("hypothesisSavedMsg");
  msg.classList.remove("hidden");
  setTimeout(function () {
    msg.classList.add("hidden");
  }, 2000);
}

export function getSelectedOptions(selectEl: HTMLSelectElement): EvidenceId[] {
  //Demo 7: DOM option values are string, so the EvidenceId contract must be checked.
  return Array.from(selectEl.options)
    .filter((option) => option.selected)
    .map((option) => option.value)
    .filter(isEvidenceId);
}
