// The parent calculates the percentage; this component only presents it.
interface ProgressProps {
  progressPct: number;
}

// Displays review completion as both a visual bar and readable text.
export function Progress({ progressPct }: ProgressProps) {
  return (
    <div className="dashboard-panel">
      <h3>Review progress</h3>
      <div className="progress-bar-outer">
        {/* React style objects set dynamic CSS properties directly. */}
        <div
          className="progress-bar-inner"
          style={{ width: `${progressPct}%` }}
        ></div>
      </div>
      <p>{progressPct}% of evidence reviewed</p>
    </div>
  );
}
