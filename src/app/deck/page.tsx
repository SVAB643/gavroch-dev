/* eslint-disable @next/next/no-img-element */
"use client";

/**
 * /deck — Static slide-optimized page for PDF generation.
 * Each section = one slide at 1440 × 900px.
 * Same visual style as the main site, no animations.
 */

function techIconUrl(name: string, color: string) {
  const localIcons: Record<string, Record<string, string>> = {
    OpenAI: { ffffff: "/img/openai.svg", "888888": "/img/openai-gray.svg" },
    AWS: { ffffff: "/img/aws.svg", "888888": "/img/aws-gray.svg" },
  };
  if (localIcons[name]) return localIcons[name][color] || localIcons[name].ffffff;
  const slugs: Record<string, string> = {
    "Next.js": "nextdotjs",
    React: "react",
    TypeScript: "typescript",
    "Node.js": "nodedotjs",
    Claude: "anthropic",
    "Claude API": "anthropic",
    LangChain: "langchain",
    "Tailwind CSS": "tailwindcss",
    Figma: "figma",
    Vercel: "vercel",
    Supabase: "supabase",
  };
  return `https://cdn.simpleicons.org/${slugs[name]}/${color}`;
}

/* ─── Grain overlay component ─── */
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
  )
}

/* ─── Slide wrapper — forces 1440×900 ─── */
function Slide({ children, className = "", style = {} }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) {
  return (
    <section
      className={`relative overflow-hidden ${className}`}
      style={{ width: 1440, height: 900, minHeight: 900, maxHeight: 900, ...style }}
    >
      {children}
    </section>
  )
}

export default function DeckPage() {
  return (
    <div style={{ width: 1440, overflow: "hidden" }}>

      {/* ═══ SLIDE 1 — HERO ═══ */}
      <Slide
        style={{
          background: "linear-gradient(to bottom, #F5F0E8 0%, #FFD000 25%, #FF8C00 50%, #CC2200 80%, #991100 100%)",
          color: "#1a1a1a",
        }}
      >
        {/* Grain */}
        <div className="absolute inset-0 pointer-events-none" style={{ opacity: 0.7 }}>
          <svg width="100%" height="100%">
            <filter id="grainCover">
              <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="5" stitchTiles="stitch" />
            </filter>
            <rect width="100%" height="100%" filter="url(#grainCover)" />
          </svg>
        </div>

        <div className="relative z-10 flex flex-col justify-between h-full" style={{ padding: "72px 100px" }}>
          {/* Top bar */}
          <div className="flex items-center justify-between">
            <span className="text-[22px] font-semibold tracking-[0.1em]" style={{ color: "#1a1a1a" }}>
              GAVROCH<span className="font-mono font-normal tracking-[0.06em]" style={{ color: "rgba(0,0,0,0.35)" }}>.DEV</span>
            </span>
            <p className="text-[11px] uppercase tracking-[0.25em] font-mono" style={{ color: "rgba(0,0,0,0.3)" }}>
              Paris, 2025
            </p>
          </div>

          {/* Center — big statement */}
          <div className="flex flex-col items-center text-center" style={{ gap: 32 }}>
            {/* Tagline above */}
            <div className="flex items-center gap-6">
              <div style={{ width: 40, height: 1, background: "rgba(0,0,0,0.15)" }} />
              <p className="text-[11px] uppercase tracking-[0.35em] font-mono" style={{ color: "rgba(0,0,0,0.4)" }}>
                AI-Native Full-Stack Studio
              </p>
              <div style={{ width: 40, height: 1, background: "rgba(0,0,0,0.15)" }} />
            </div>

            {/* Main heading */}
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {["We listen.", "We build.", "We ship."].map((line) => (
                <h1
                  key={line}
                  className="text-[7.5rem] font-medium uppercase"
                  style={{ lineHeight: 0.92, letterSpacing: "-0.04em", color: "#1a1a1a" }}
                >
                  {line}
                </h1>
              ))}
            </div>

            {/* Sub */}
            <p className="text-[1.1rem]" style={{ lineHeight: 1.6, color: "rgba(0,0,0,0.4)", maxWidth: 520 }}>
              The Gen&nbsp;Z spirit to unlock your full&nbsp;potential.
            </p>
          </div>

          {/* Bottom bar */}
          <div className="flex items-end justify-between">
            <div className="flex items-center gap-8">
              {["Design", "Code", "AI", "Deploy"].map((tag, i) => (
                <span key={tag} className="flex items-center gap-8">
                  <span className="text-[10px] uppercase tracking-[0.2em] font-mono" style={{ color: "rgba(0,0,0,0.3)" }}>
                    {tag}
                  </span>
                  {i < 3 && <span style={{ width: 3, height: 3, borderRadius: "50%", background: "rgba(0,0,0,0.15)" }} />}
                </span>
              ))}
            </div>
            <p className="text-[10px] font-mono tracking-wider" style={{ color: "rgba(0,0,0,0.25)" }}>
              gavroch.com
            </p>
          </div>
        </div>
      </Slide>

      {/* ═══ SLIDE 2 — STUDIO ═══ */}
      <Slide className="section-dark">
        <Grain id="grainStudio" opacity={0.3} />
        <div className="relative z-10 flex flex-col justify-between h-full" style={{ padding: "64px 80px" }}>
          <p className="text-[11px] uppercase tracking-[0.3em] font-mono" style={{ color: "rgba(255,255,255,0.3)" }}>
            What we do
          </p>

          <div className="flex items-end justify-between gap-16">
            <div style={{ flex: "1 1 0" }}>
              <h2 className="text-[5.5rem] font-medium" style={{ lineHeight: 1, letterSpacing: "-0.04em", color: "#fff" }}>
                Full-Stack<br />
                <span style={{ color: "rgba(255,255,255,0.3)" }}>Web Development</span><br />
                Studio
              </h2>
            </div>
            <div style={{ maxWidth: 380 }}>
              <p className="text-[15px]" style={{ lineHeight: 1.8, color: "rgba(255,255,255,0.5)" }}>
                We design, code, and deploy digital products built to perform.
                Our AI-native approach lets us move faster without ever sacrificing quality.
              </p>
            </div>
          </div>

          {/* Tech grid — 2 rows of 4, identical to site */}
          <div className="grid grid-cols-4" style={{ gap: 1, background: "rgba(255,255,255,0.06)", borderRadius: 20, overflow: "hidden" }}>
            {[
              { label: "Next.js", cat: "Framework" },
              { label: "React", cat: "UI" },
              { label: "TypeScript", cat: "Language" },
              { label: "Node.js", cat: "Runtime" },
              { label: "OpenAI", cat: "AI" },
              { label: "Claude", cat: "AI" },
              { label: "Figma", cat: "Design" },
              { label: "Vercel", cat: "Deploy" },
            ].map((tech) => (
              <div
                key={tech.label}
                className="flex flex-col items-center justify-center text-center"
                style={{ background: "#050505", padding: "24px 12px" }}
              >
                <img src={techIconUrl(tech.label, "ffffff")} alt="" className="w-8 h-8 mb-3" style={{ opacity: 0.8 }} />
                <span className="text-[15px] font-semibold" style={{ color: "#fff" }}>{tech.label}</span>
                <span className="text-[10px] uppercase tracking-[0.15em] font-mono" style={{ marginTop: 6, color: "rgba(255,255,255,0.3)" }}>{tech.cat}</span>
              </div>
            ))}
          </div>
        </div>
      </Slide>

      {/* ═══ SLIDE 3 — ABOUT ═══ */}
      <Slide style={{ background: "#fafafa" }}>
        <Grain id="grainAbout" opacity={0.15} />
        <div className="relative z-10 flex flex-col justify-between h-full" style={{ padding: "64px 80px" }}>
          <p className="text-[11px] uppercase tracking-[0.25em] font-mono" style={{ color: "rgba(0,0,0,0.3)" }}>
            About
          </p>

          <div className="grid grid-cols-12 gap-16">
            <div className="col-span-5">
              <h2 className="text-[4rem] font-medium" style={{ lineHeight: 1.05, letterSpacing: "-0.03em", color: "#0a0a0a" }}>
                A new kind{" "}
                <span style={{ color: "rgba(0,0,0,0.25)" }}>of studio.</span>
              </h2>
              <p className="text-[14px] max-w-md mt-8" style={{ lineHeight: 1.9, color: "rgba(0,0,0,0.5)" }}>
                We&apos;re a tight crew of developers and designers based in Paris.
                Born in the AI era, we build digital products that move fast, look sharp,
                and actually work. No legacy thinking, no corporate BS.
              </p>
            </div>
            <div className="col-span-6 col-start-7">
              {[
                { title: "AI-Native", desc: "AI isn't an add-on, it's in our DNA. We code with it, think with it, ship with it. Result: 10x faster, 10x smarter." },
                { title: "Gen Z Mindset", desc: "We're the generation that grew up with code. No pointless processes, no endless meetings. Just ship it." },
                { title: "Obsessed w/ Quality", desc: "Fast doesn't mean sloppy. Every pixel, every line of code, every interaction is designed for performance." },
              ].map((v) => (
                <div key={v.title} className="border-t py-6" style={{ borderColor: "rgba(0,0,0,0.08)" }}>
                  <div className="flex items-start gap-8">
                    <h3 className="text-[1.15rem] font-medium" style={{ letterSpacing: "-0.01em", minWidth: 160 }}>
                      {v.title}
                    </h3>
                    <p className="text-[13px]" style={{ lineHeight: 1.8, color: "rgba(0,0,0,0.5)" }}>
                      {v.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div />
        </div>
      </Slide>

      {/* ═══ SLIDE 4 — SERVICES ═══ */}
      <Slide style={{ background: "#fafafa" }}>
        <Grain id="grainServices" opacity={0.15} />
        <div className="relative z-10 flex flex-col justify-between h-full" style={{ padding: "64px 80px" }}>
          <div>
            <p className="text-[11px] uppercase tracking-[0.25em] font-mono mb-8" style={{ color: "rgba(0,0,0,0.3)" }}>
              Services
            </p>
            <h2 className="text-[4rem] font-medium" style={{ lineHeight: 1.05, letterSpacing: "-0.03em", color: "#0a0a0a" }}>
              Built different.{" "}
              <span style={{ color: "#E8943A" }}>Powered by AI.</span>
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-0">
            {[
              { num: "01", title: "Design", desc: "Interfaces that convert. UX research, UI design, design systems — we craft experiences your users will love." },
              { num: "02", title: "Full-Stack Dev", desc: "React, Next.js, Node, databases — we own the entire stack. Clean, performant, scalable code. Zero tech debt." },
              { num: "03", title: "AI Integration", desc: "We integrate AI where it matters. Chatbots, automation, RAG, agents — we transform your workflows with the best models on the market." },
              { num: "04", title: "Ship & Scale", desc: "CI/CD, cloud, monitoring, edge computing. Your product goes live in record time, ready to handle growth." },
            ].map((s, i) => (
              <div key={s.num} className={`border-t py-8 ${i % 2 === 0 ? "pr-10" : ""}`} style={{ borderColor: "rgba(0,0,0,0.08)" }}>
                <span className="text-[11px] font-mono block mb-5" style={{ color: "rgba(0,0,0,0.2)" }}>{s.num}</span>
                <h3 className="text-[2rem] font-medium" style={{ letterSpacing: "-0.02em", marginBottom: 12 }}>{s.title}</h3>
                <p className="text-[13px] max-w-md" style={{ lineHeight: 1.8, color: "rgba(0,0,0,0.5)" }}>{s.desc}</p>
              </div>
            ))}
          </div>

          {/* Stats row at bottom */}
          <div className="flex gap-16">
            {[
              { num: "10+", label: "Projects shipped" },
              { num: "AI-Native", label: "From day one" },
              { num: "Every client", label: "comes back" },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-[1.5rem] font-medium" style={{ letterSpacing: "-0.03em", marginBottom: 4, color: "#E8943A" }}>
                  {stat.num}
                </p>
                <p className="text-[10px] uppercase tracking-[0.2em] font-mono" style={{ color: "rgba(0,0,0,0.3)" }}>
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </Slide>

      {/* ═══ SLIDE 5 — PROCESS ═══ */}
      <Slide style={{ background: "#fafafa" }}>
        <Grain id="grainProcess" opacity={0.15} />
        <div className="relative z-10 flex flex-col justify-between h-full" style={{ padding: "64px 80px" }}>
          <div>
            <p className="text-[11px] uppercase tracking-[0.25em] font-mono mb-8" style={{ color: "rgba(0,0,0,0.3)" }}>
              Our process
            </p>
            <h2 className="text-[4rem] font-medium" style={{ lineHeight: 1.05, letterSpacing: "-0.03em", color: "#0a0a0a" }}>
              From zero to live{" "}
              <span style={{ color: "rgba(0,0,0,0.25)" }}>in record time.</span>
            </h2>
          </div>

          <div className="grid grid-cols-4 gap-0">
            {[
              { step: "01", title: "Discover", desc: "A first meeting to understand your brand, your vision, and what you love. We curate the best sites in your industry so we design with intention." },
              { step: "02", title: "Design", desc: "We craft your site live on a shared platform. You see every change in real time, comment, and markup — nothing ships without your sign-off." },
              { step: "03", title: "Build", desc: "Clean code, fast iterations, AI-powered development. Your site comes to life exactly as designed." },
              { step: "04", title: "Launch", desc: "Deploy, monitor, optimize. Your product is live and we stick around to help it grow." },
            ].map((p) => (
              <div key={p.step} className="border-t pr-8 pt-6 pb-8" style={{ borderColor: "rgba(0,0,0,0.08)" }}>
                <span className="text-[11px] font-mono tracking-wider block" style={{ marginBottom: 28, color: "#E8943A" }}>{p.step}</span>
                <h3 className="text-[1.25rem] font-medium" style={{ letterSpacing: "-0.01em", marginBottom: 12 }}>{p.title}</h3>
                <p className="text-[12px]" style={{ lineHeight: 1.8, color: "rgba(0,0,0,0.45)" }}>{p.desc}</p>
              </div>
            ))}
          </div>

          <div />
        </div>
      </Slide>

      {/* ═══ SLIDE 6 — PROJECTS ═══ */}
      <Slide style={{ background: "#fafafa" }}>
        <div className="relative z-10 flex flex-col justify-between h-full" style={{ padding: "64px 80px" }}>
          <div>
            <p className="text-[11px] uppercase tracking-[0.25em] font-mono mb-5" style={{ color: "rgba(0,0,0,0.3)" }}>
              Selected work
            </p>
            <h2 className="text-[3.5rem] font-medium" style={{ lineHeight: 1.05, letterSpacing: "-0.03em", color: "#0a0a0a" }}>
              What we&apos;ve built{" "}
              <span style={{ color: "rgba(0,0,0,0.2)" }}>recently.</span>
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-6">
            {[
              { title: "Ambroise Partners", category: "Corporate Site", desc: "Strategic and financial advisory dedicated to healthcare innovation.", image: "/img/projects/ambroise.png", url: "ambroisepartners.com" },
              { title: "Gavroch.com", category: "Studio Site", desc: "Our own AI-native full-stack web development studio.", image: "/img/projects/gavroch.png", url: "www.gavroch.com" },
            ].map((p, i) => (
              <div key={p.title}>
                <div className="overflow-hidden rounded-2xl" style={{ background: "#fff", border: "1px solid rgba(0,0,0,0.07)", boxShadow: "0 2px 16px rgba(0,0,0,0.04)" }}>
                  <div className="flex items-center gap-2 px-4" style={{ height: 36, borderBottom: "1px solid rgba(0,0,0,0.05)" }}>
                    <div className="flex items-center gap-1.5">
                      <div className="w-[9px] h-[9px] rounded-full" style={{ background: "#ff5f57" }} />
                      <div className="w-[9px] h-[9px] rounded-full" style={{ background: "#febc2e" }} />
                      <div className="w-[9px] h-[9px] rounded-full" style={{ background: "#28c840" }} />
                    </div>
                    <div className="ml-2 flex-1 max-w-[240px] flex items-center rounded-md px-3" style={{ height: 22, background: "rgba(0,0,0,0.03)" }}>
                      <span className="text-[10px] font-mono truncate" style={{ color: "rgba(0,0,0,0.25)" }}>{p.url}</span>
                    </div>
                  </div>
                  <div className="overflow-hidden" style={{ height: 340 }}>
                    <img src={p.image} alt={p.title} className="w-full h-auto" style={{ position: "relative", top: 0, left: 0 }} />
                  </div>
                </div>
                <div className="flex items-start justify-between mt-4 px-1">
                  <div>
                    <div className="flex items-center gap-2.5 mb-1">
                      <span className="text-[10px] font-mono" style={{ color: "rgba(0,0,0,0.2)" }}>0{i + 1}</span>
                      <h3 className="text-[1.1rem] font-medium" style={{ letterSpacing: "-0.02em", color: "#0a0a0a" }}>{p.title}</h3>
                    </div>
                    <p className="text-[12px]" style={{ color: "rgba(0,0,0,0.4)" }}>{p.desc}</p>
                  </div>
                  <span className="shrink-0 text-[9px] font-mono tracking-wider px-2.5 py-1 rounded-full mt-0.5" style={{ background: "rgba(0,0,0,0.04)", color: "rgba(0,0,0,0.4)" }}>
                    {p.category}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div />
        </div>
      </Slide>

      {/* ═══ SLIDE 7 — SHOWCASE ═══ */}
      <Slide style={{ background: "#fafafa" }}>
        <div className="relative z-10 flex flex-col justify-between h-full" style={{ padding: "64px 80px" }}>
          <div className="flex items-end justify-between">
            <div>
              <p className="text-[11px] uppercase tracking-[0.25em] font-mono mb-5" style={{ color: "rgba(0,0,0,0.3)" }}>
                Showcase
              </p>
              <h2 className="text-[3.5rem] font-medium" style={{ lineHeight: 1.05, letterSpacing: "-0.03em", color: "#0a0a0a" }}>
                We can build{" "}
                <span style={{ color: "rgba(0,0,0,0.2)" }}>anything.</span>
              </h2>
            </div>
            <p className="text-[13px] max-w-xs" style={{ color: "rgba(0,0,0,0.4)", lineHeight: 1.7 }}>
              From luxury brands to health platforms — the kind of sites we craft every day.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {[
              { title: "Lucis", category: "Health", image: "/img/projects/lucis.png" },
              { title: "Panacea", category: "Healthcare", image: "/img/projects/panacea.png" },
              { title: "Yelo", category: "Ride-Hailing", image: "/img/projects/yelo.png" },
              { title: "NEON", category: "Film", image: "/img/projects/neonrated.png" },
              { title: "Volta SKAI", category: "Real Estate", image: "/img/projects/voltaskai.png" },
              { title: "Aupale Vodka", category: "Brand", image: "/img/projects/aupalevodka.png" },
            ].map((p) => (
              <div key={p.title}>
                <div className="overflow-hidden rounded-xl" style={{ background: "#fff", border: "1px solid rgba(0,0,0,0.06)", boxShadow: "0 1px 8px rgba(0,0,0,0.03)" }}>
                  <div className="overflow-hidden" style={{ height: 180 }}>
                    <img src={p.image} alt={p.title} className="w-full h-auto" />
                  </div>
                </div>
                <div className="flex items-center justify-between mt-2.5 px-0.5">
                  <h3 className="text-[0.85rem] font-medium" style={{ letterSpacing: "-0.02em", color: "#0a0a0a" }}>{p.title}</h3>
                  <span className="text-[8px] font-mono tracking-wider px-2 py-0.5 rounded-full" style={{ background: "rgba(0,0,0,0.04)", color: "rgba(0,0,0,0.4)" }}>
                    {p.category}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div />
        </div>
      </Slide>

      {/* ═══ SLIDE 8 — PRICING ═══ */}
      <Slide className="section-dark">
        <Grain id="grainPricing" opacity={0.25} />
        <div className="relative z-10 flex flex-col justify-between h-full" style={{ padding: "56px 80px" }}>
          <div>
            <p className="text-[11px] uppercase tracking-[0.25em] font-mono mb-6" style={{ color: "rgba(255,255,255,0.4)" }}>
              Pricing
            </p>
            <h2 className="text-[3.5rem] font-medium" style={{ lineHeight: 1.05, letterSpacing: "-0.03em" }}>
              Transparent pricing.<br />
              <span style={{ color: "rgba(255,255,255,0.3)" }}>No surprises.</span>
            </h2>
          </div>

          <div className="grid grid-cols-3 gap-5">
            {[
              {
                name: "Starter", price: "399", highlight: false,
                desc: "A complete, professional website to establish your online presence.",
                features: ["Full website", "Template-based design", "Fully responsive", "1 post-launch revision", "On-demand support"],
                maintenance: "€30/mo",
              },
              {
                name: "Custom Build", price: "629", highlight: true,
                desc: "A conversion-optimized site with real guidance throughout the process.",
                features: ["Conversion-focused site", "Fully responsive", "Local SEO", "Google Business optimization", "1 month support", "4 revisions included"],
                maintenance: "€30/mo",
              },
              {
                name: "Brand + Build", price: "999", highlight: false,
                desc: "The full package — bespoke design, advanced UX, and 3 months partnership.",
                features: ["Custom design from scratch", "UX for conversions", "Advanced local SEO", "Speed optimization", "Analytics setup", "3 months support"],
                maintenance: "€10/mo",
              },
            ].map((plan) => (
              <div
                key={plan.name}
                className="flex flex-col rounded-2xl overflow-hidden"
                style={{
                  background: plan.highlight
                    ? "linear-gradient(165deg, rgba(232,148,58,0.12) 0%, rgba(232,148,58,0.04) 100%)"
                    : "rgba(255,255,255,0.03)",
                  border: plan.highlight
                    ? "1px solid rgba(232,148,58,0.3)"
                    : "1px solid rgba(255,255,255,0.08)",
                }}
              >
                {plan.highlight && (
                  <div className="h-[2px]" style={{ background: "linear-gradient(90deg, transparent, #E8943A, transparent)" }} />
                )}
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-[11px] uppercase tracking-[0.2em] font-mono" style={{ color: plan.highlight ? "#E8943A" : "rgba(255,255,255,0.35)" }}>
                      {plan.name}
                    </p>
                    {plan.highlight && (
                      <span className="text-[8px] uppercase tracking-[0.15em] font-mono px-2 py-0.5 rounded-full" style={{ background: "rgba(232,148,58,0.15)", color: "#E8943A" }}>
                        Popular
                      </span>
                    )}
                  </div>
                  <span className="text-[2.8rem] font-medium" style={{ letterSpacing: "-0.04em", color: "#fff" }}>
                    €{plan.price}
                  </span>
                  <p className="text-[11px] mt-3 mb-4" style={{ lineHeight: 1.7, color: "rgba(255,255,255,0.45)" }}>
                    {plan.desc}
                  </p>
                  <div className="mb-3" style={{ height: 1, background: plan.highlight ? "rgba(232,148,58,0.15)" : "rgba(255,255,255,0.06)" }} />
                  <div className="flex-1 flex flex-col gap-2.5">
                    {plan.features.map((f) => (
                      <div key={f} className="flex items-start gap-2.5">
                        <svg className="mt-0.5 shrink-0" width="12" height="12" viewBox="0 0 14 14" fill="none">
                          <path d="M3.5 7L6 9.5L10.5 4.5" stroke={plan.highlight ? "#E8943A" : "rgba(255,255,255,0.25)"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <span className="text-[11px]" style={{ color: "rgba(255,255,255,0.6)", lineHeight: 1.4 }}>{f}</span>
                      </div>
                    ))}
                  </div>
                  <p className="text-[10px] font-mono mt-3" style={{ color: "rgba(255,255,255,0.25)" }}>
                    Maintenance: {plan.maintenance}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <p className="text-center text-[11px]" style={{ color: "rgba(255,255,255,0.25)", lineHeight: 1.7 }}>
            All websites are built with the same technical quality. The difference lies in the level of support and guidance.
          </p>
        </div>
      </Slide>

      {/* ═══ SLIDE 9 — TEAM ═══ */}
      <Slide className="section-dark">
        <Grain id="grainTeam" opacity={0.25} />
        <div className="relative z-10 flex flex-col justify-between h-full" style={{ padding: "64px 80px" }}>
          <div>
            <p className="text-[11px] uppercase tracking-[0.25em] font-mono mb-6" style={{ color: "rgba(255,255,255,0.4)" }}>
              The team
            </p>
            <h2 className="text-[4rem] font-medium" style={{ lineHeight: 1.05, letterSpacing: "-0.03em" }}>
              Two founders.{" "}
              <span style={{ color: "rgba(255,255,255,0.3)" }}>One vision.</span>
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-8">
            {[
              {
                name: "Adrien Svabek", initials: "AS", photo: "/img/adrien.jpeg",
                role: "Co-founder, Developer & UX/UI Designer",
                desc: "Dauphine PSL, MSc 224 Finance, Impact & Technology. Ex tech startups & tech investment banking. Builds brands, ships sites, apps, and CRMs.",
                education: "MSc 224, Dauphine PSL",
                experience: ["EY", "Cambon Partners"],
              },
              {
                name: "Alexandre Cohen-Skalli", initials: "AC", photo: "/img/alexandre.jpeg",
                role: "Co-founder, Developer & UX/UI Designer",
                desc: "Dauphine PSL, MSc 203 Financial Markets. Algorithmic trading background, quant models on live trading floors. Clean architecture, relentless performance.",
                education: "MSc 203, Dauphine PSL",
                experience: ["Goldman Sachs", "HSBC", "Société Générale"],
              },
            ].map((member) => (
              <div
                key={member.name}
                className="flex flex-col items-center text-center rounded-2xl"
                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", padding: "36px 32px" }}
              >
                <div className="w-24 h-24 rounded-full overflow-hidden shrink-0" style={{ border: "2px solid rgba(255,140,0,0.2)", marginBottom: 20 }}>
                  <img
                    src={member.photo}
                    alt={member.name}
                    className="w-full h-full rounded-full object-cover"
                    style={{ filter: member.name === "Alexandre Cohen-Skalli" ? "grayscale(100%)" : undefined }}
                  />
                </div>
                <h3 className="text-[1.25rem] font-medium" style={{ marginBottom: 4 }}>{member.name}</h3>
                <p className="text-[11px] uppercase tracking-[0.15em] font-mono" style={{ color: "#E8943A", marginBottom: 14 }}>
                  {member.role}
                </p>
                <p className="text-[13px] max-w-sm" style={{ lineHeight: 1.7, color: "rgba(255,255,255,0.5)", marginBottom: 14 }}>
                  {member.desc}
                </p>
                <p className="text-[10px] uppercase tracking-[0.15em] font-mono" style={{ color: "rgba(255,255,255,0.25)", marginBottom: 10 }}>
                  {member.education}
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                  {member.experience.map((company) => (
                    <span
                      key={company}
                      className="text-[10px] tracking-[0.08em] font-mono"
                      style={{ padding: "5px 12px", borderRadius: 100, border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.4)" }}
                    >
                      {company}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div />
        </div>
      </Slide>

      {/* ═══ SLIDE 10 — CONTACT ═══ */}
      <Slide className="section-dark">
        <Grain id="grainContact" opacity={0.25} />
        <div className="relative z-10 flex flex-col justify-center h-full" style={{ padding: "64px 80px" }}>
          <div className="grid grid-cols-12 gap-16">
            <div className="col-span-7">
              <p className="text-[11px] uppercase tracking-[0.25em] font-mono mb-12" style={{ color: "rgba(255,255,255,0.4)" }}>
                Contact
              </p>
              <h2 className="text-[5rem] font-medium" style={{ lineHeight: 1, letterSpacing: "-0.04em" }}>
                Ready to build&nbsp;?
              </h2>
              <h2 className="text-[5rem] font-medium" style={{ lineHeight: 1, letterSpacing: "-0.04em", color: "#E8943A", marginTop: 8 }}>
                Let&apos;s talk.
              </h2>
            </div>
            <div className="col-span-4 col-start-9 flex flex-col justify-center gap-10">
              <div className="flex flex-col gap-6">
                <div className="flex items-center gap-4 text-[14px]" style={{ color: "rgba(255,255,255,0.5)" }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="4" width="20" height="16" rx="2" />
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                  </svg>
                  svabekadrien@gmail.com
                </div>
                <div className="flex items-center gap-4 text-[14px]" style={{ color: "rgba(255,255,255,0.5)" }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                  WhatsApp
                </div>
                <div className="flex items-center gap-4 text-[14px]" style={{ color: "rgba(255,255,255,0.5)" }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  Paris, France
                </div>
              </div>
              <div className="border-t" style={{ borderColor: "rgba(255,255,255,0.06)", paddingTop: 24 }}>
                <p className="text-[10px] uppercase tracking-[0.2em] font-mono" style={{ marginBottom: 12, color: "rgba(255,255,255,0.15)" }}>
                  Socials
                </p>
                <div className="flex gap-6">
                  {["LinkedIn", "GitHub", "Twitter"].map((s) => (
                    <span key={s} className="text-[12px] tracking-wider" style={{ color: "rgba(255,255,255,0.25)" }}>
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer bar */}
        <div className="absolute bottom-0 left-0 right-0" style={{ borderTop: "1px solid rgba(255,255,255,0.04)", padding: "20px 80px" }}>
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono tracking-wider" style={{ color: "rgba(255,255,255,0.15)" }}>
              &copy; 2025 GAVROCH.DEV
            </span>
            <span className="text-[16px] font-semibold tracking-[0.08em]" style={{ color: "#fff" }}>
              GAVROCH<span className="font-mono font-normal tracking-[0.06em]" style={{ color: "rgba(255,255,255,0.45)" }}>.DEV</span>
            </span>
          </div>
        </div>
      </Slide>

    </div>
  );
}
