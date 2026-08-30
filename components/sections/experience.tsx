"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ChevronDown } from "lucide-react";
import { EDUCATION, EXPERIENCE } from "@/content/experience";
import { Section } from "@/components/ui/section";

export function Experience() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <Section
      id="experience"
      index="02"
      label="Experience"
      title="Mostly one problem, from several angles."
      lede="How do you make a complicated document feel simple to edit? That question covers almost everything below."
    >
      <ol className="border-t border-border">
        {EXPERIENCE.map((role, i) => {
          const isOpen = open === i;
          return (
            <li key={`${role.company}-${role.start}`} className="border-b border-border">
              <button
                onClick={() => setOpen(isOpen ? null : i)}
                aria-expanded={isOpen}
                className="group flex w-full items-start gap-4 py-5 text-left sm:gap-6"
              >
                <span className="w-[7.5rem] shrink-0 pt-1 font-mono text-2xs text-muted tnum sm:w-[9rem]">
                  {role.start} — {role.end}
                </span>

                <span className="flex-1">
                  <span className="flex flex-wrap items-center gap-2">
                    <span className="font-display text-lg font-semibold">
                      {role.company}
                    </span>
                    {role.badge && (
                      <span className="rounded-xs bg-accent-soft px-1.5 py-0.5 font-mono text-[10px] font-medium text-accent">
                        {role.badge}
                      </span>
                    )}
                  </span>
                  <span className="mt-0.5 block text-sm text-muted">
                    {role.title}
                  </span>
                </span>

                <ChevronDown
                  size={16}
                  className={`mt-1 shrink-0 text-muted transition-transform duration-300 group-hover:text-accent ${
                    isOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.32, ease: [0.25, 1, 0.5, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="pb-8 sm:pl-[10.5rem]">
                      <p className="mb-5 max-w-[60ch] text-sm leading-relaxed text-muted">
                        {role.summary}
                      </p>
                      <ul className="mb-5 space-y-3">
                        {role.highlights.map((h) => (
                          <li key={h.text} className="flex gap-3">
                            <span className="mt-[0.55rem] size-1 shrink-0 rounded-full bg-accent" />
                            <span className="max-w-[62ch] text-sm leading-relaxed">
                              {h.text}
                              {h.metric && (
                                <span className="ml-2 inline-block rounded-xs border border-accent px-1.5 py-px font-mono text-2xs text-accent tnum">
                                  {h.metric}
                                </span>
                              )}
                            </span>
                          </li>
                        ))}
                      </ul>
                      <ul className="flex flex-wrap gap-1.5">
                        {role.stack.map((s) => (
                          <li
                            key={s}
                            className="rounded-xs border border-border px-2 py-0.5 font-mono text-2xs text-muted"
                          >
                            {s}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </li>
          );
        })}
      </ol>

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        {EDUCATION.map((e) => (
          <div
            key={e.school}
            className="rounded-md border border-border p-5"
          >
            <p className="font-display text-sm font-medium">{e.school}</p>
            <p className="mt-1 text-sm text-muted">{e.credential}</p>
            <p className="mt-3 font-mono text-2xs text-accent tnum">{e.result}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}
