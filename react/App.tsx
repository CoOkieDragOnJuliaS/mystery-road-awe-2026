import { useEffect, useState } from "react";
import type { ViewName } from "../types/domain.ts";
import { isViewName } from "../types/domain.ts";
import { Header } from "./Header.tsx";
import { DashboardPage } from "./pages/DashboardPage.tsx";

function getViewFromHash(): ViewName {
  const raw = window.location.hash.replace("#", "");
  return isViewName(raw) ? raw : "dashboard";
}

export function App() {
  const [currentView, setCurrentView] = useState<ViewName>("dashboard");
  //return <h1>Project ReMotion — React shell</h1>;

   // Keep React state in sync when the user uses back/forward buttons
  useEffect(() => {
    const onHashChange = () => setCurrentView(getViewFromHash());
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);
 
  const navigateTo = (view: ViewName) => {
    window.location.hash = view;      // updates the URL
    setCurrentView(view);            // updates React state immediately
  };

  return (
    <>
      <Header currentView={currentView} onNavigate={navigateTo} />
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

//Exercise 3 - Demo 9 - building header/branding, the navigation bar, and a routing skeleton in React + TypeScript

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

