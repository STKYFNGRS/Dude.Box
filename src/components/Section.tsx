import { ReactNode } from "react";

type SectionProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  children?: ReactNode;
};

export function Section({ eyebrow, title, description, children }: SectionProps) {
  return (
    <section className="py-12 border-b border-border">
      <div className="flex flex-col gap-4">
        {eyebrow ? (
          <span className="text-xs uppercase tracking-[0.35em] muted">{eyebrow}</span>
        ) : null}
        <h2 className="section-title text-3xl">{title}</h2>
        {description ? <p className="muted max-w-2xl">{description}</p> : null}
        {children}
      </div>
    </section>
  );
}
