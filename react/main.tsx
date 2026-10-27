import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HashRouter } from "react-router-dom";
import { App } from "./app/App.tsx";
import { loadAllData } from "../data/api.ts";

const container = document.getElementById("root");

if (!container) throw new Error("Missing #root mount point");

//Exercise 4 Demo 8: HashRouter keeps the existing #/… URL scheme so no dev-
// server rewrite rules are needed; the router owns location state instead of
// the manual hashchange listener from Exercise 3.
loadAllData().then(() => {
  createRoot(container).render(
    <StrictMode>
      <HashRouter>
        <App />
      </HashRouter>
    </StrictMode>,
  );
});
