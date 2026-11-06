import { Navigate, Route, Routes } from "react-router-dom";
import { Header } from "./Header.tsx";
import { DashboardPage } from "../features/dashboard/DashboardPage.tsx";
import { PeopleLocationsPage } from "../features/people-locations/PeopleLocationsPage.tsx";
import { PeopleList } from "../features/people-locations/PeopleList.tsx";
import { LocationsList } from "../features/people-locations/LocationsList.tsx";
import { PersonDetailPage } from "../features/people-locations/PersonDetailPage.tsx";
import { TimelinePage } from "../features/timeline/TimelinePage.tsx";
import { EvidencePage } from "../features/evidence/EvidencePage.tsx";
import { WorkspacePage } from "../features/workspace/WorkspacePage.tsx";
import { useState } from "react";
import { saveBookmarksToStorage } from "../../storage/localStorage.ts";
import { type EvidenceId } from "../../types/domain.ts";
import * as state from "../../state/globalState.ts";

//Exercise 4 Demo 8: react-router-dom replaces the hand-rolled useState +
// hashchange plumbing from Exercise 3. The router now owns navigation state;
// unmatched URLs hit the catch-all redirect to "/" (the vanilla
// handleHashChange silently fell back to the dashboard in the same way).
// Evidence and Workspace stay as placeholder routes
export function App() {
  //Exercise 5 - Demo 5: App is the lowest common owner of bookmark state.
  const [bookmarkIds, setBookmarkIds] = useState<EvidenceId[]>(() =>
    state.getBookmarks(),
  );

  function handleToggleBookmark(id: EvidenceId): void {
    const next = bookmarkIds.includes(id)
      ? bookmarkIds.filter((currentId) => currentId !== id)
      : [...bookmarkIds, id];

    setBookmarkIds(next);
    state.setBookmarks(next);
    saveBookmarksToStorage();
  }

  return (
    <>
      <Header />
      <main id="app" className="app-main">
        <Routes>
          <Route
            path="/"
            element={<DashboardPage bookmarkIds={bookmarkIds} />}
          />
          {/*Exercise 4 Demo 8: the old People/Locations tab toggle becomes two
             real nested routes rendered through <Outlet/>.*/}
          <Route path="/team" element={<PeopleLocationsPage />}>
            <Route index element={<Navigate to="people" replace />} />
            <Route path="people" element={<PeopleList />} />
            <Route path="locations" element={<LocationsList />} />
          </Route>
          {/*Exercise 4 Demo 9: route parameter — a specific person's page.*/}
          <Route path="/team/people/:personId" element={<PersonDetailPage />} />
          <Route path="/timeline" element={<TimelinePage />} />
          <Route
            path="/evidence"
            element={
              <EvidencePage
                bookmarkIds={bookmarkIds}
                onToggleBookmark={handleToggleBookmark}
              />
            }
          />
          <Route
            path="/workspace"
            element={<WorkspacePage bookmarkIds={bookmarkIds} />}
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </>
  );
}
