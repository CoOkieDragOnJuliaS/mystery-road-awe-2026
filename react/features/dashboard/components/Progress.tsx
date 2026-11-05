//Exercise 5 - change from type to interface, why?
/*
  Both can be used to describe an object or a function signature
  TYPE alias can also be used for types like primitives, unions and tuples
  Both can be extended, but syntax different.
  A class can implement a inteface or type alias
  A interface can be defined multiple times! --> will be treated as a single interface.
*/
interface ProgressProps {
  progressPct: number;
}

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
