import type { ReactNode } from "react";

//Exercise 4 Demo 1: Card takes children instead of a data prop, so the same
// shell markup can wrap person cards, location cards and timeline events
// without knowing what is inside.
interface CardProps {
  className?: string;
  children: ReactNode;
}

export function Card({ className = "", children }: CardProps) {
  return <div className={`card ${className}`}>{children}</div>;
}
