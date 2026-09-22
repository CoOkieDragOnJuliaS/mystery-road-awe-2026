//Importing functions from other modules
import * as storage from "./storage/localStorage.js";
import { navigateTo } from "./navigation/router.js";
import * as router from "./navigation/router.js";
import { setupEventListeners } from "./utils/setup.js";
import * as api from "./data/api.js";
import * as people from "./views/people.js";
import * as evidence from "./views/evidenceBasic.js";
import * as workspace from "./views/workspace.js";

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

function initApp() {
  //No try-catch causes errors if JSON storage is manipulated
  try{
  storage.loadBookmarksFromStorage();
  storage.loadNotesFromStorage();
  } catch (error) {
    console.error("Error loading data from localStorage:", error);
  }
  setupEventListeners();

  //Try catch error for the loading of all data for JSON storage manipulation
  try{
  api.loadAllData().then(function () {
    router.handleHashChange();
    storage.loadNoteAsync("E01").then(function (firstNote) {
    console.log("First note preview:", firstNote)});
  });
  }  catch (error) {
    console.error("Error loading all data:", error);
  }
}

window.addEventListener("DOMContentLoaded", initApp);
window.addEventListener("hashchange", router.handleHashChange);
