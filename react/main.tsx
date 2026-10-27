import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
//Module app has not exported member app?
import { App } from "./app/App.tsx";
import { loadAllData } from "../data/api.ts";

const container = document.getElementById("root");

if (!container) throw new Error("Missing #root mount point");

loadAllData().then(() => {
  createRoot(container).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
});
