/* eslint-disable @next/next/no-img-element */
"use client";

/**
 * /card — Business card. Dark, minimal, centered.
 * Recto + Verso, each 1008×648px (85×55mm at ~300dpi).
 */

const W = 1008;
const H = 648;

function techIconUrl(name: string) {
  const localIcons: Record<string, string> = {
    OpenAI: "/img/openai.svg",
    AWS: "/img/aws.svg",
  };
  if (localIcons[name]) return localIcons[name];
  const slugs: Record<string, string> = {
    "Next.js": "nextdotjs",
    React: "react",
    TypeScript: "typescript",
    "Node.js": "nodedotjs",
    Claude: "anthropic",
    Figma: "figma",
    Vercel: "vercel",
    Supabase: "supabase",
  };
  return `https://cdn.simpleicons.org/${slugs[name]}/ffffff`;
}

function Grain({ id, opacity = 0.25 }: { id: string; opacity?: number }) {
  return (
    <div className="absolute inset-0 pointer-events-none" style={{ opacity }}>
      <svg width="100%" height="100%">
        <filter id={id}>
          <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="4" stitchTiles="stitch" />
        </filter>
        <rect width="100%" height="100%" filter={`url(#${id})`} />
      </svg>
    </div>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="relative overflow-hidden"
      style={{ width: W, height: H, minHeight: H, maxHeight: H, background: "#050505" }}
    >
      {children}
    </div>
  );
}

export default function CardPage() {
  return (
    <div style={{ width: W, overflow: "hidden" }}>

      {/* ═══ RECTO ═══ */}
      <Card>
        <Grain id="grainFront" opacity={0.3} />
        {/* Top accent */}
        <div className="absolute top-0 left-0 right-0" style={{ height: 2, background: "linear-gradient(90deg, transparent 15%, #F0C040 50%, transparent 85%)", opacity: 0.5 }} />

        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center">

          {/* Logo — centered */}
          <p style={{
            margin: "0 0 8px 0",
            fontSize: 28,
            fontWeight: 700,
            letterSpacing: "0.18em",
            color: "#fff",
          }}>
            GAVROCH<span style={{ fontWeight: 400, color: "rgba(255,255,255,0.25)", letterSpacing: "0.1em" }}>.DEV</span>
          </p>

          {/* Tagline */}
          <p style={{
            margin: "0 0 36px 0", fontSize: 9, letterSpacing: "0.35em", textTransform: "uppercase" as const,
            color: "rgba(255,255,255,0.15)", fontFamily: "var(--font-mono), monospace",
          }}>
            We listen. We build. We ship.
          </p>

          {/* Tech icons — big, spread below logo */}
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "center", gap: 36,
          }}>
            {["Next.js", "React", "TypeScript", "Node.js", "OpenAI", "Claude", "Figma", "Vercel"].map((t) => (
              <img key={t} src={techIconUrl(t)} alt="" style={{ width: 48, height: 48, opacity: 0.3 }} />
            ))}
          </div>

          {/* Bottom tagline */}
          <p style={{
            position: "absolute", bottom: 44,
            margin: 0, fontSize: 9, letterSpacing: "0.3em", textTransform: "uppercase" as const,
            color: "rgba(255,255,255,0.12)", fontFamily: "var(--font-mono), monospace",
          }}>
            AI-Native Full-Stack Studio — Paris
          </p>
        </div>
      </Card>

      {/* ═══ VERSO ═══ */}
      <Card>
        <Grain id="grainBack" opacity={0.3} />
        {/* Top accent */}
        <div className="absolute top-0 left-0 right-0" style={{ height: 2, background: "linear-gradient(90deg, transparent 15%, #F0C040 50%, transparent 85%)", opacity: 0.5 }} />

        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center">

          {/* Small label — site style */}
          <p style={{
            position: "absolute", top: 44,
            margin: 0, fontSize: 9, letterSpacing: "0.3em", textTransform: "uppercase" as const,
            color: "rgba(255,255,255,0.2)", fontFamily: "var(--font-mono), monospace",
          }}>
            Let&apos;s build something great
          </p>

          {/* Big slogan — site section title style */}
          <div style={{ marginBottom: 32 }}>
            <p style={{
              margin: 0,
              fontSize: 44,
              fontWeight: 500,
              lineHeight: 1,
              letterSpacing: "-0.03em",
              color: "#fff",
            }}>
              Your vision.
            </p>
            <p style={{
              margin: 0,
              fontSize: 44,
              fontWeight: 500,
              lineHeight: 1,
              letterSpacing: "-0.03em",
              color: "rgba(255,255,255,0.25)",
            }}>
              Our code.
            </p>
          </div>

          {/* Contact row */}
          <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
            <p style={{ margin: 0, fontSize: 13, letterSpacing: "0.02em", color: "rgba(255,255,255,0.45)" }}>
              svabekadrien@gmail.com
            </p>
            <span style={{ width: 3, height: 3, borderRadius: "50%", background: "rgba(255,255,255,0.15)" }} />
            <p style={{ margin: 0, fontSize: 13, letterSpacing: "0.02em", color: "rgba(255,255,255,0.45)" }}>
              +33 6 48 76 38 88
            </p>
            <span style={{ width: 3, height: 3, borderRadius: "50%", background: "rgba(255,255,255,0.15)" }} />
            <p style={{ margin: 0, fontSize: 13, letterSpacing: "0.02em", color: "#F0C040", fontWeight: 500 }}>
              gavroch.com
            </p>
          </div>

          {/* Bottom */}
          <div style={{
            position: "absolute", bottom: 44,
            display: "flex", alignItems: "center", gap: 20,
          }}>
            <p style={{
              margin: 0, fontSize: 14, fontWeight: 700, letterSpacing: "0.18em", color: "rgba(255,255,255,0.12)",
            }}>
              GAVROCH<span style={{ fontWeight: 400, color: "rgba(255,255,255,0.06)" }}>.DEV</span>
            </p>
            <span style={{ width: 3, height: 3, borderRadius: "50%", background: "rgba(255,255,255,0.08)" }} />
            <p style={{
              margin: 0, fontSize: 9, letterSpacing: "0.25em", textTransform: "uppercase" as const,
              color: "rgba(255,255,255,0.1)", fontFamily: "var(--font-mono), monospace",
            }}>
              Adrien Svabek — Co-founder
            </p>
          </div>
        </div>
      </Card>

    </div>
  );
}
