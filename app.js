//Importing functions from other modules
import * as state from "./state/globalState.js";
import * as storage from "./storage/localStorage.js";
import { navigateTo } from "./navigation/router.js";
import * as router from "./navigation/router.js";
import { setupEventListeners } from "./utils/setup.js";
import * as dashboard from "./views/dashboard.js";
import * as evidence from "./views/evidenceBasic.js";
import * as timeline from "./views/timeline.js";
import * as workspace from "./views/workspace.js";
import * as people from "./views/people.js";
import * as api from "./data/api.js";


// ---------------------------------------------------------------------
// INIT
// ---------------------------------------------------------------------

function initApp() {
  storage.loadBookmarksFromStorage();
  storage.loadNotesFromStorage();
  setupEventListeners();

  api.loadAllData().then(function () {
    router.handleHashChange();
    var firstNote = storage.loadNoteAsync("E01");
    console.log("First note preview:", firstNote);
  });
}

window.addEventListener("DOMContentLoaded", initApp);
window.addEventListener("hashchange", router.handleHashChange);
