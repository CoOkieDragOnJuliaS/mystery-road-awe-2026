import { useEffect, useState } from "react";
import type { ViewName } from "../types/domain.ts";
import { isViewName } from "../types/domain.ts";
import { Header } from "./Header.tsx";
import { DashboardPage } from "./pages/DashboardPage.tsx";

// Reads the URL hash and converts it into a valid application view.
// Unknown or missing hashes fall back to the dashboard.
function getViewFromHash(): ViewName {
  const raw = window.location.hash.replace("#", "");
  return isViewName(raw) ? raw : "dashboard";
}

// Root component: owns navigation state and renders the selected page.
export function App() {
  const [currentView, setCurrentView] = useState<ViewName>("dashboard");

  // Keeps React state synchronized with browser back/forward navigation.
  useEffect(() => {
    const onHashChange = () => setCurrentView(getViewFromHash());
    window.addEventListener("hashchange", onHashChange);

    // React runs this cleanup when App is removed from the page.
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  // Changes both the shareable URL and the currently rendered React view.
  const navigateTo = (view: ViewName) => {
    window.location.hash = view;
    setCurrentView(view);
  };

  return (
    <>
      {/* The header receives navigation state and a callback instead of owning it. */}
      <Header currentView={currentView} onNavigate={navigateTo} />

      {/* Conditional rendering acts as a small client-side router. */}
      <main id="app" className="app-main">
        {currentView === "dashboard" && <DashboardPage />}
        {currentView === "evidence" && <EvidencePage />}
        {currentView === "people" && <PeoplePage />}
        {currentView === "timeline" && <TimelinePage />}
        {currentView === "workspace" && <WorkspacePage />}
      </main>
    </>
  );
}

// Exercise 3 - Demo 9 - building header/branding, the navigation bar, and a routing skeleton in React + TypeScript
// These placeholders will be replaced as the remaining views are migrated to React.
function EvidencePage() {
  return <h2>Evidence</h2>;
}

function PeoplePage() {
  return <h2>People</h2>;
}

function TimelinePage() {
  return <h2>Timeline</h2>;
}

function WorkspacePage() {
  return <h2>Workspace</h2>;
}
