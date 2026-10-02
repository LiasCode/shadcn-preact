import type { ComponentChildren } from "preact";

export function Section({ id, title, children }: { id: string; title: string; children: ComponentChildren }) {
  return (
    <section id={id} className="scroll-mt-20 space-y-3">
      <h2 className="font-semibold text-2xl tracking-tight">{title}</h2>
      {children}
    </section>
  );
}