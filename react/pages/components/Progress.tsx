type ProgressProps = {
  progressPct: number;
};
 
export function Progress({ progressPct }: ProgressProps) {
  return (
    <div className="dashboard-panel">
      <h3>Review progress</h3>
      <div className="progress-bar-outer">
        <div
          className="progress-bar-inner"
          style={{ width: `${progressPct}%` }}
        ></div>
      </div>
      <p>{progressPct}% of evidence reviewed</p>
    </div>
  );
}