//Exercise 4 Demo 7: Badge is extracted as a reusable presentational component.
// It is used by TimelineEventCard (certainty) and CaseSummaryCard (case status),
// replacing the duplicated `<span class="badge badge-…">` template strings and
// the badgeHelper.ts string lookups of the vanilla views.
export type BadgeVariant =
  | "unreviewed"
  | "reviewed"
  | "flagged"
  | "critical"
  | "relevant"
  | "irrelevant"
  | "unknown";

interface BadgeProps {
  label: string;
  variant: BadgeVariant;
}

export function Badge({ label, variant }: BadgeProps) {
  return <span className={`badge badge-${variant}`}>{label}</span>;
}
