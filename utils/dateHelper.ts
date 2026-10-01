export function formatDate(timestamp: string | null | undefined): string {
  if (!timestamp) return "Unknown date";

  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) return timestamp;

  return (
    date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    }) +
    " " +
    date.toLocaleTimeString(undefined, {
      hour: "2-digit",
      minute: "2-digit",
    })
  );
}
