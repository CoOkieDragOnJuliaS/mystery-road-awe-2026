import type { CaseData } from "../../../../types/domain.ts";
import { Badge } from "../../../components/Badge.tsx";

type CaseSummaryCardProps = {
  caseData: CaseData | null;
};

export function CaseSummaryCard({ caseData }: CaseSummaryCardProps) {
  return (
    <div className="case-summary-card">
      <h3>{caseData?.title ?? "Case"}</h3>
      <p>
        {/*Exercise 4 Demo 7: shared Badge — the badge markup/class construction
           lives in one place, reused by TimelineEventCard as well.*/}
        <Badge
          label={(caseData?.status ?? "unknown").toUpperCase()}
          variant="flagged"
        />
      </p>
      <p>{caseData?.summary ?? ""}</p>
    </div>
  );
}
