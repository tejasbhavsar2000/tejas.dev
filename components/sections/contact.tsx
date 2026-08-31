"use client";

import { useState } from "react";
import { ArrowUpRight, Check, Copy, Mail } from "lucide-react";
import { Github, Linkedin, Twitter } from "@/components/ui/icons";
import { Section } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import {
  SortableList,
  SortableItem,
  useSortable,
} from "@/components/ui/sortable";
import { SITE } from "@/content/site";

const LINKS = [
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

const LINK_IDS = LINKS.map((l) => l.label);

export function Contact() {
  const [copied, setCopied] = useState(false);
  const { order, setOrder, move, enabled } = useSortable(LINK_IDS);
  const byLabel = new Map(LINKS.map((l) => [l.label, l]));

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(SITE.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard can be blocked, so fall back to the mail client.
      window.location.href = SITE.links.email;
    }
  };

  return (
    <Section
      id="contact"
      variant="band"
      title="Say hi."
      lede="I promise I reply."
    >
      <Reveal>
        <button
          onClick={copyEmail}
          className="group flex w-full items-center gap-4 border-y border-border py-7 text-left"
        >
          <Mail
            size={20}
            className="text-muted transition-colors group-hover:text-accent"
          />
          <span className="flex-1">
            <span className="block text-xl font-medium transition-colors group-hover:text-accent">
              {SITE.email}
            </span>
            <span className="mt-0.5 block text-sm text-muted">
              {copied ? "Copied to your clipboard" : "Click to copy"}
            </span>
          </span>
          {copied ? (
            <Check size={18} className="shrink-0 text-accent" />
          ) : (
            <Copy
              size={17}
              className="shrink-0 text-muted transition-colors group-hover:text-accent"
            />
          )}
        </button>
      </Reveal>

      <SortableList
        order={order}
        onReorder={setOrder}
        move={move}
        enabled={enabled}
        className="divide-y divide-border border-b border-border"
      >
        {order.map((id, i) => {
          const link = byLabel.get(id);
          if (!link) return null;
          const { href, icon: Icon, label, handle } = link;
          return (
            <SortableItem key={label} id={label}>
              <Reveal delay={(i + 1) * 0.05}>
                <a
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex items-center gap-4 py-5 transition-transform duration-300 hover:translate-x-1"
                >
                  <Icon
                    size={18}
                    className="text-muted transition-colors group-hover:text-accent"
                  />
                  <span className="flex-1">
                    <span className="block text-base font-medium transition-colors group-hover:text-accent">
                      {label}
                    </span>
                    <span className="block text-sm text-muted">{handle}</span>
                  </span>
                  <ArrowUpRight
                    size={15}
                    className="text-muted transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent"
                  />
                </a>
              </Reveal>
            </SortableItem>
          );
        })}
      </SortableList>
    </Section>
  );
}
