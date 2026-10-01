export type EvidenceStatus = "unreviewed" | "reviewed" | "flagged";
export type EvidenceRelevance = "unknown" | "relevant" | "irrelevant";

export type StatusBadgeClass =
  | "badge-unreviewed"
  | "badge-reviewed"
  | "badge-flagged";
  
export type RelevanceBadgeClass = "badge-unreviewed" | "badge-relevant";

// Refactor to arrow function
export const getStatusBadgeClass = (
  //Demo 5 -- if you delete null or undefined a call with undefined can receive an error Argument of type 'undefined' is not assignable to parameter of type 'EvidenceStatus'.
  status: EvidenceStatus | null | undefined,
): StatusBadgeClass => {
  const normalizedStatus = (status ?? "").toLowerCase();

  if (normalizedStatus === "reviewed") return "badge-reviewed";
  if (normalizedStatus === "flagged") return "badge-flagged";

  return "badge-unreviewed";
};

// Refactor to arrow function
export const getRelevanceBadgeClass = (
  relevance: EvidenceRelevance | null | undefined,
): RelevanceBadgeClass => {
  const normalizedRelevance = (relevance ?? "").toLowerCase();
  if (normalizedRelevance === "relevant") return "badge-relevant";
  return "badge-unreviewed";
};