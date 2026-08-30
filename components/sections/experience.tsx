"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRight, ChevronDown } from "lucide-react";
import { EXPERIENCE } from "@/content/experience";
import { Section } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { SITE } from "@/content/site";

export function Experience() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <Section
      id="experience"
      variant="split"
      title="Proof I show up."
      lede="The teams that put up with me."
    >
      <ol className="border-t border-border">
        {EXPERIENCE.map((role, i) => {
          const isOpen = open === i;
          const isAlai = role.company === SITE.previously.company;
          const name = role.badge
            ? `${role.company} (${role.badge})`
            : role.company;

          return (
            <Reveal
              as="li"
              key={`${role.company}-${role.start}`}
              delay={i * 0.05}
              className="border-b border-border"
            >
              <button
                onClick={() => setOpen(isOpen ? null : i)}
                aria-expanded={isOpen}
                className="group flex w-full items-start gap-5 py-6 text-left"
              >
                <span className="flex-1">
                  {/* The whole row toggles, so the company cannot be a link
                      here: an anchor inside a button is invalid markup. Alai is
                      linked in the summary below, and in the hero. */}
                  <span
                    className={`block text-xl font-semibold ${
                      isAlai
                        ? "text-accent"
                        : "transition-colors group-hover:text-accent"
                    }`}
                  >
                    {name}
                  </span>
                  <span className="mt-1 block text-base text-muted">
                    {role.title}
                  </span>
                  <span className="mt-1 block text-sm text-muted tnum">
                    {role.start} to {role.end}
                  </span>
                </span>

                <ChevronDown
                  size={18}
                  className={`mt-1.5 shrink-0 text-muted transition-transform duration-300 group-hover:text-accent ${
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
                    <div className="max-w-[58ch] pb-9">
                      <p className="mb-4 text-base leading-relaxed text-muted">
                        {role.summary}
                      </p>

                      {/* A standalone link rather than the company name tacked
                          onto the end of the summary, which read as a dangling
                          fragment. */}
                      {isAlai && (
                        <a
                          href={SITE.previously.href}
                          target="_blank"
                          rel="noreferrer"
                          className="link-draw mb-7 inline-flex items-center gap-1 text-base font-medium text-accent"
                        >
                          getalai.com
                          <ArrowUpRight size={15} />
                        </a>
                      )}

                      <ul className="mt-3 space-y-4">
                        {role.highlights.map((h) => (
                          <li key={h.text} className="flex gap-3">
                            <span className="mt-[0.7rem] size-1 shrink-0 rounded-full bg-accent" />
                            <span className="text-base leading-relaxed">
                              {h.text}
                              {h.metric && (
                                <span className="text-muted"> ({h.metric})</span>
                              )}
                            </span>
                          </li>
                        ))}
                      </ul>

                      <p className="mt-7 text-sm text-muted">
                        {role.stack.join(" · ")}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </Reveal>
          );
        })}
      </ol>
    </Section>
  );
}
