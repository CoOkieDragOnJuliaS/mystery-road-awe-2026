import type { CaseData } from "../../../types/domain.ts";

// The case may be null while data is unavailable, so the component provides fallbacks.
interface CaseSummaryCardProps {
  caseData: CaseData | null;
}

// Presents the case title, normalized status badge, and short description.
export function CaseSummaryCard({ caseData }: CaseSummaryCardProps) {
  return (
    <div className="case-summary-card">
      {/* Optional chaining and ?? provide display values when caseData is null. */}
      <h3>{caseData?.title ?? "Case"}</h3>
      <p>
        <span className="badge badge-flagged">
          {(caseData?.status ?? "unknown").toUpperCase()}
        </span>
      </p>
      <p>{caseData?.summary ?? ""}</p>
    </div>
  );
}
