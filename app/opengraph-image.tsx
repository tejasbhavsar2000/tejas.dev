import { ImageResponse } from "next/og";
import { SITE } from "@/content/site";

export const alt = `${SITE.name}, ${SITE.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Generated at build time by `next/og`, which ships with Next, so this costs no
 * dependency and no runtime. Without it every shared link renders as a bare
 * text card.
 *
 * Colours are literals rather than the oklch tokens: this renders in Satori,
 * not a browser, and it understands neither CSS variables nor oklch.
 */
export default function OpengraphImage() {
  const bg = "#fbfaf9";
  const ink = "#22201e";
  const muted = "#6b645e";
  const accent = "#c2643a";

  // Satori requires an explicit display on any element with more than one
  // child, and each JSX interpolation counts as one. Precomputing the strings
  // keeps every node down to a single text child.
  const roleLine = `${SITE.role}.`;
  const previously = `Previously @ ${SITE.previously.company} (${SITE.previously.badge})`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          background: bg,
          padding: "88px 96px",
        }}
      >
        <div style={{ display: "flex", height: 8, width: 96, background: accent }} />
        <div
          style={{
            marginTop: 44,
            fontSize: 92,
            fontWeight: 700,
            letterSpacing: "-0.035em",
            color: ink,
          }}
        >
          {SITE.name}
        </div>
        <div style={{ marginTop: 22, fontSize: 40, color: accent }}>
          {roleLine}
        </div>
        <div
          style={{
            marginTop: 10,
            fontSize: 36,
            color: muted,
            maxWidth: 900,
          }}
        >
          {SITE.intro}
        </div>
        <div style={{ marginTop: 44, fontSize: 28, color: muted }}>
          {previously}
        </div>
      </div>
    ),
    size,
  );
}
