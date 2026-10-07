// Defines the numeric total and caption required by a statistic card.
interface StatCardProps {
  value: number;
  label: string;
}

// Small reusable presentation component used for every dashboard statistic.
export function StatCard({ value, label }: StatCardProps) {
  return (
    <div className="stat-card">
      <div className="stat-value">{value}</div>
      <div className="stat-label">{label}</div>
    </div>
  );
}
