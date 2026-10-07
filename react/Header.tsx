import type { ViewName } from "../types/domain.ts";

// Props make the header reusable: the parent supplies the active view and
// decides what should happen when a navigation button is clicked.
interface HeaderProps {
  currentView: ViewName;
  onNavigate: (view: ViewName) => void;
}

// A single configuration list generates every navigation button.
const VIEWS: { id: ViewName; label: string }[] = [
  { id: "dashboard", label: "Dashboard" },
  { id: "evidence", label: "Evidence" },
  { id: "people", label: "People & Locations" },
  { id: "timeline", label: "Timeline" },
  { id: "workspace", label: "Workspace" },
];

// Displays the product branding and the application's main navigation.
export function Header({ currentView, onNavigate }: HeaderProps) {
  return (
    <header className="app-header">
      <div className="header-inner">
        {/* Branding section with the logo, title, and case description. */}
        <div className="brand">
          <img
            src="assets/logo/logo.svg"
            alt="Project ReMotion logo"
            className="brand-logo"
          />
          <div>
            <h1>Project ReMotion</h1>
            <p className="subtitle">
              Investigate the failure of an AI-assisted rehabilitation robot.
            </p>
          </div>
        </div>
        {/* Build one button per view and visually mark the selected view. */}
        <nav className="main-nav" aria-label="Main navigation">
          {VIEWS.map((view) => (
            <button
              key={view.id}
              type="button"
              className={`nav-btn ${currentView === view.id ? "active" : ""}`}
              onClick={() => onNavigate(view.id)}
            >
              {view.label}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
}
