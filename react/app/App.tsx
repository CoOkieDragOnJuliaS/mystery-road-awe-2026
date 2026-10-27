import { useEffect, useState } from "react";
import type { ViewName } from "../../types/domain.ts";
import { isViewName } from "../../types/domain.ts";
import { Header } from "./Header.tsx";
//Exercise 4 Demo 6: reorganized by feature — app shell in react/app/,
// shared UI in react/components/, pages in react/features/<feature>/.
import { DashboardPage } from "../features/dashboard/DashboardPage.tsx";
import { TimelinePage } from "../features/timeline/TimelinePage.tsx";
import { PeopleList } from "../features/people-locations/PeopleList.tsx";
import { LocationsList } from "../features/people-locations/LocationsList.tsx";

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
    window.location.hash = view; // updates the URL
    setCurrentView(view); // updates React state immediately
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

//Exercise 4 Demo 5: renders the real migrated lists. The People/Locations
// tab split becomes real routes in Demo 8.
function PeoplePage() {
  return (
    <section id="view-people" className="view active">
      <h2>People &amp; Locations</h2>
      <PeopleList />
      <LocationsList />
    </section>
  );
}

function WorkspacePage() {
  return <h2>Workspace</h2>;
}
