"use client";

import dynamic from "next/dynamic";
import { Section } from "@/components/ui/section";
import { STACK } from "@/content/stack";

// React Flow is a real chunk of JavaScript — it only loads once you scroll here.
const StackGraph = dynamic(
  () => import("@/components/sections/stack-graph").then((m) => m.StackGraph),
  {
    ssr: false,
    loading: () => (
      <div className="grid h-[26rem] place-items-center rounded-lg border border-border bg-surface font-mono text-2xs text-muted">
        loading graph…
      </div>
    ),
  },
);

export function Stack() {
  return (
    <Section
      id="stack"
      index="03"
      label="Stack"
      title="Drawn with something that's on it."
      lede="React Flow is in the list below, so the list below is a React Flow graph. Drag the nodes around."
    >
      <StackGraph />

      <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {STACK.map((group) => (
          <li key={group.id}>
            <p className="mb-2 font-mono text-2xs uppercase tracking-wider text-accent">
              {group.label}
            </p>
            <ul className="flex flex-wrap gap-1.5">
              {group.items.map((item) => (
                <li key={item.name}>
                  {item.href ? (
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-block rounded-xs border border-border px-2 py-0.5 text-xs text-muted transition-colors hover:border-accent hover:text-accent"
                    >
                      {item.name}
                    </a>
                  ) : (
                    <span className="inline-block rounded-xs border border-border px-2 py-0.5 text-xs text-muted">
                      {item.name}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </Section>
  );
}
