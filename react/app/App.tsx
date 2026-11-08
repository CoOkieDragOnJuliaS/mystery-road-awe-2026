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
import { BookmarkProvider } from "./BookmarkContext.tsx";
import { useState } from "react";
import { useCaseData } from "../hooks/useCaseData.ts";
import { saveNotesStoreToStorage } from "../../storage/localStorage.ts";
import type { EvidenceId, NotesStore } from "../../types/domain.ts";
import * as state from "../../state/globalState.ts";

//Exercise 4 Demo 8: react-router-dom replaces the hand-rolled useState +
// hashchange plumbing from Exercise 3. The router now owns navigation state;
// unmatched URLs hit the catch-all redirect to "/" (the vanilla
// handleHashChange silently fell back to the dashboard in the same way).
// Evidence and Workspace stay as placeholder routes
export function App() {
  const [notes, setNotes] = useState<NotesStore>(() => state.getNotesStore());

  //Exercise 6 - Demo 9: App uses the application-logic hook; raw backend
  //requests stay outside the component.
  const dataLoad = useCaseData();

  //Exercise 5 - Demo 6: App owns notes and passes the save callback downward.
  function handleSaveNote(id: EvidenceId, text: string): void {
    //Exercise 5 - Demo 9: update the React notes owner immutably.
    const nextNotes = { ...notes, [id]: text };
    setNotes(nextNotes);
    saveNotesStoreToStorage(nextNotes);
  }

  return (
    <>
      <Header />
      <main id="app" className="app-main">
        {/*Exercise 6 - Demo 7: clicking quickly starts a new request and
           causes the previous effect cleanup to abort the older request.*/}
        <button
          type="button"
          className="btn btn-secondary"
          onClick={dataLoad.reload}
        >
          Reload case data
        </button>
        {dataLoad.status === "loading" && (
          //Exercise 6 - Demo 6: pending backend work has an explicit UI state.
          <p className="data-loading" role="status">
            Loading case data...
          </p>
        )}
        {dataLoad.status === "error" && (
          //Exercise 6 - Demo 6: rejected backend work has a separate error
          //message and is not represented as an empty collection.
          <p className="data-error" role="alert">
            Could not load case data: {dataLoad.error}
          </p>
        )}
        {dataLoad.status === "ready" && (
          //Exercise 6 - Demo 5: data-dependent routes render after the
          //backend Promise has fulfilled and global state has been populated.
          <BookmarkProvider>
            <Routes>
              <Route path="/" element={<DashboardPage />} />
              {/*Exercise 4 Demo 8: the old People/Locations tab toggle becomes two
             real nested routes rendered through <Outlet/>.*/}
              <Route path="/team" element={<PeopleLocationsPage />}>
                <Route index element={<Navigate to="people" replace />} />
                <Route path="people" element={<PeopleList />} />
                <Route path="locations" element={<LocationsList />} />
              </Route>
              {/*Exercise 4 Demo 9: route parameter — a specific person's page.*/}
              <Route
                path="/team/people/:personId"
                element={<PersonDetailPage />}
              />
              <Route path="/timeline" element={<TimelinePage />} />
              <Route
                path="/evidence"
                element={
                  <EvidencePage notes={notes} onSaveNote={handleSaveNote} />
                }
              />
              <Route
                path="/workspace"
                element={<WorkspacePage notes={notes} />}
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BookmarkProvider>
        )}
      </main>
    </>
  );
}
