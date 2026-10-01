export type EvidenceStatus = "unreviewed" | "reviewed" | "flagged";
export type EvidenceRelevance = "unknown" | "relevant" | "irrelevant";

export type StatusBadgeClass =
  | "badge-unreviewed"
  | "badge-reviewed"
  | "badge-flagged";
  
export type RelevanceBadgeClass = "badge-unreviewed" | "badge-relevant";

// Refactor to arrow function
export const getStatusBadgeClass = (
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