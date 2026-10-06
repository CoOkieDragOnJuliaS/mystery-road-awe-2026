import type { ViewName } from "../types/domain.ts";

type HeaderProps  = {
  currentView: ViewName;
  onNavigate: (view: ViewName) => void;
};
 
const VIEWS: { id: ViewName; label: string }[] = [
  { id: "dashboard", label: "Dashboard" },
  { id: "evidence", label: "Evidence" },
  { id: "people", label: "People & Locations" },
  { id: "timeline", label: "Timeline" },
  { id: "workspace", label: "Workspace" },
];
 
export function Header({ currentView, onNavigate }: HeaderProps) {
  return (
    <header className="app-header">
      <div className="header-inner">
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