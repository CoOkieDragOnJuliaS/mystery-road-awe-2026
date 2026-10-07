import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";
import { loadAllData } from "../data/api.ts";

// Locate the HTML element where React will control the page content.
const container = document.getElementById("root");

// Stop immediately if index.html does not provide React's mount point.
if (!container) throw new Error("Missing #root mount point");

// Load the case data into global state before components try to read it.
loadAllData().then(() => {
  // createRoot starts React; StrictMode adds development-only checks.
  createRoot(container).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
});
