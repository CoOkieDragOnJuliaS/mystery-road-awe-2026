import { Navigate, Route, Routes } from "react-router-dom";
import { Header } from "./Header.tsx";
import { DashboardPage } from "../features/dashboard/DashboardPage.tsx";
import { PeopleLocationsPage } from "../features/people-locations/PeopleLocationsPage.tsx";
import { PeopleList } from "../features/people-locations/PeopleList.tsx";
import { LocationsList } from "../features/people-locations/LocationsList.tsx";
import { PersonDetailPage } from "../features/people-locations/PersonDetailPage.tsx";
import { TimelinePage } from "../features/timeline/TimelinePage.tsx";

//Exercise 4 Demo 8: react-router-dom replaces the hand-rolled useState +
// hashchange plumbing from Exercise 3. The router now owns navigation state;
// unmatched URLs hit the catch-all redirect to "/" (the vanilla
// handleHashChange silently fell back to the dashboard in the same way).
// Evidence and Workspace stay as placeholder routes — their migration is
// Exercise 5 scope.
export function App() {
  return (
    <>
      <Header />
      <main id="app" className="app-main">
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
          <Route path="/team/people/:personId" element={<PersonDetailPage />} />
          <Route path="/timeline" element={<TimelinePage />} />
          <Route path="/evidence" element={<h2>Evidence</h2>} />
          <Route path="/workspace" element={<h2>Workspace</h2>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </>
  );
}
