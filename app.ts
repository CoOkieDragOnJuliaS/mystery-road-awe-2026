//Importing functions from other modules
import * as storage from "./storage/localStorage.ts";
import { navigateTo } from "./navigation/router.ts";
import * as router from "./navigation/router.ts";
import { setupEventListeners } from "./utils/setup.ts";
import * as api from "./data/api.ts";
import * as people from "./views/people.ts";
import * as evidence from "./views/evidenceBasic.ts";
import type { PeopleTab, ViewName } from "./types/domain.ts";

declare global {
  interface Window {
    navigateTo: (viewName: ViewName) => void;
    switchPeopleTab: (tab: PeopleTab) => void;
    handleSortChange: () => void;
    saveHypothesis: () => void;
    saveCurrentNote: () => void;
    closeEvidenceDetail: () => void;
  }
}

//---------------------------------------------------------------------
// WINDOW INITIALIZATION
// ---------------------------------------------------------------------

window.navigateTo = navigateTo; // Expose navigateTo for use in inline eventHandling (HTML)
window.switchPeopleTab = people.switchPeopleTab;
window.handleSortChange = evidence.handleSortChange;
window.saveHypothesis = storage.saveHypothesis;

// ---------------------------------------------------------------------
// INIT
// ---------------------------------------------------------------------

function initApp(): void {
  //No try-catch causes errors if JSON storage is manipulated
  try {
    storage.loadBookmarksFromStorage();
    storage.loadNotesFromStorage();
  } catch (error) {
    console.error("Error loading data from localStorage:", error);
  }
  setupEventListeners();

  //Try catch error for the loading of all data for JSON storage manipulation
  void api
    .loadAllData()
    .then(function () {
      router.handleHashChange();
      return storage.loadNoteAsync("E01");
    })
    .then(function (firstNote) {
      console.log("First note preview:", firstNote);
    })
    .catch(function (error: unknown) {
      console.error("Error loading all data:", error);
    });
}

window.addEventListener("DOMContentLoaded", initApp);

// Code smell - already handled by setup.js
//window.addEventListener("hashchange", router.handleHashChange);
