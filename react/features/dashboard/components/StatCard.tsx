import { Card } from "./Card.tsx";

type StatCardProps = {
  value: number;
  label: string;
};

export function StatCard({ value, label }: StatCardProps) {
  return (
    // Exercise 4 Demo 1: Changed the HTML structure to use the Card component because of parent-children / Card becomes the shell
    <Card className="stat-card">
      <div className="stat-value">{value}</div>
      <div className="stat-label">{label}</div>
    </Card>
  );
}
