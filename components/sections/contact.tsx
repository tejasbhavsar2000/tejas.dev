import { ArrowUpRight, Mail } from "lucide-react";
import { Github, Linkedin, Twitter } from "@/components/ui/icons";
import { SITE } from "@/content/site";

export function Contact() {
  const links = [
    { href: SITE.links.email, icon: Mail, label: "Email", handle: SITE.email },
    {
      href: SITE.links.github,
      icon: Github,
      label: "GitHub",
      handle: "tejasbhavsar2000",
    },
    {
      href: SITE.links.twitter,
      icon: Twitter,
      label: "Twitter",
      handle: SITE.twitterHandle,
    },
    {
      href: SITE.links.linkedin,
      icon: Linkedin,
      label: "LinkedIn",
      handle: "tejas-bhavsar",
    },
  ];

  return (
    <section
      id="contact"
      className="scroll-mt-24 border-t border-border py-16 sm:py-24"
    >
      <p className="mb-4 flex items-center gap-3 font-mono text-2xs uppercase tracking-[0.16em] text-muted">
        <span className="text-accent tnum">05</span>
        <span className="h-px w-6 bg-border" />
        Contact
      </p>
      <h2 className="max-w-[18ch] text-4xl font-semibold">
        If any of this is your kind of problem, say hello.
      </h2>

      <ul className="mt-10 grid gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-2">
        {links.map(({ href, icon: Icon, label, handle }) => (
          <li key={label}>
            <a
              href={href}
              target="_blank"
              rel="noreferrer"
              className="group flex items-center gap-4 bg-bg p-5 transition-colors hover:bg-surface"
            >
              <Icon size={17} className="text-muted transition-colors group-hover:text-accent" />
              <span className="flex-1">
                <span className="block text-sm font-medium">{label}</span>
                <span className="block font-mono text-2xs text-muted">
                  {handle}
                </span>
              </span>
              <ArrowUpRight
                size={14}
                className="text-muted transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent"
              />
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
