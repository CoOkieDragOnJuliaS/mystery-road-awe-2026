import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HashRouter } from "react-router-dom";
import { App } from "./app/App.tsx";
import {
  loadBookmarksFromStorage,
  loadNotesFromStorage,
} from "../storage/localStorage.ts";

const container = document.getElementById("root");

if (!container) throw new Error("Missing #root mount point");

try {
  loadBookmarksFromStorage();
  loadNotesFromStorage();
} catch (error) {
  console.error("Could not restore saved workspace data:", error);
}

//Exercise 4 Demo 8: HashRouter keeps the existing #/… URL scheme so no dev-
// server rewrite rules are needed; the router owns location state instead of
// the manual hashchange listener from Exercise 3.
//Exercise 6 - Demo 5: render the React owner immediately; App starts backend
//loading from useEffect and tracks the pending, fulfilled, and rejected states.
createRoot(container).render(
  <StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </StrictMode>,
);
