import { ReactNode } from "react";

type CardProps = {
  title: string;
  children: ReactNode;
  className?: string;
};

export function Card({ title, children, className }: CardProps) {
  return (
    <div className={`card rounded-lg p-6 ${className ?? ""}`}>
      <h3 className="section-title text-xl mb-3">{title}</h3>
      <div className="text-sm muted leading-relaxed">{children}</div>
    </div>
  );
}
