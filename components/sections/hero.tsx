import { Mail } from "lucide-react";
import { Github, Linkedin, Twitter } from "@/components/ui/icons";
import { DotField } from "@/components/canvas/dot-field";
import { Reveal } from "@/components/ui/reveal";
import { SITE } from "@/content/site";

export function Hero() {
  const social = [
    { href: SITE.links.github, icon: Github, label: "GitHub" },
    { href: SITE.links.twitter, icon: Twitter, label: "Twitter" },
    { href: SITE.links.linkedin, icon: Linkedin, label: "LinkedIn" },
    { href: SITE.links.email, icon: Mail, label: "Email" },
  ];

  return (
    <div className="relative isolate">
      {/* No horizontal bleed: past the container edge it overflows the viewport
          on narrow screens. Vertical bleed is harmless. */}
      <DotField className="pointer-events-none absolute inset-x-0 -bottom-4 -top-8 -z-10" />

      <div className="max-w-[44rem] py-24 sm:py-32">
        <Reveal>
          <h1 className="text-6xl font-semibold leading-[0.98] tracking-[-0.03em]">
            {SITE.name}
          </h1>
        </Reveal>

        <Reveal delay={0.06}>
          <p className="mt-7 max-w-[26ch] text-2xl font-medium leading-[1.25] text-accent">
            {SITE.role}.
          </p>
          <p className="mt-2 max-w-[34ch] text-2xl leading-[1.25] text-muted">
            {SITE.intro}
          </p>
        </Reveal>

        <Reveal delay={0.12}>
          <p className="mt-8 text-base text-muted">
            Previously @{" "}
            <a
              href={SITE.previously.href}
              target="_blank"
              rel="noreferrer"
              className="link-draw font-medium text-accent"
            >
              {SITE.previously.company} ({SITE.previously.badge})
            </a>
          </p>
        </Reveal>

        <Reveal delay={0.18}>
          <div className="mt-10 flex flex-wrap items-center gap-2">
            {social.map(({ href, icon: Icon, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                className="grid size-10 place-items-center rounded-sm text-muted transition-all duration-200 hover:-translate-y-0.5 hover:bg-surface hover:text-accent"
              >
                <Icon size={17} />
              </a>
            ))}
            <a
              href={SITE.links.resume}
              target="_blank"
              rel="noreferrer"
              className="ml-1 rounded-sm px-3 py-2 text-sm text-muted transition-all duration-200 hover:-translate-y-0.5 hover:bg-surface hover:text-text"
            >
              Résumé
            </a>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
