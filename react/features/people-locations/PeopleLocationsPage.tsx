import { NavLink, Outlet } from "react-router-dom";

//Exercise 4 Demo 8: the old tab buttons called switchPeopleTab() which only
// toggled a .hidden class in the DOM. The tabs are now real nested routes
// (/team/people and /team/locations) rendered through <Outlet/>, so each tab
// has a bookmarkable URL. NavLink applies the .active class itself.
export function PeopleLocationsPage() {
  return (
    <section id="view-people" className="view active">
      <h2>People &amp; Locations</h2>
      <nav className="tab-bar">
        <NavLink
          to="/team/people"
          className={({ isActive }) => `tab-btn ${isActive ? "active" : ""}`}
        >
          People
        </NavLink>
        <NavLink
          to="/team/locations"
          className={({ isActive }) => `tab-btn ${isActive ? "active" : ""}`}
        >
          Locations
        </NavLink>
      </nav>
      <Outlet />
    </section>
  );
}
