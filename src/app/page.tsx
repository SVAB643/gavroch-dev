"use client";

import { useState, useEffect, useRef } from "react";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useInView,
  AnimatePresence,
} from "framer-motion";
import { ArrowUpRight, Mail, MapPin } from "lucide-react";

/* ─── DATA ─── */

const services = [
  {
    num: "01",
    title: "Design",
    desc: "Interfaces that convert. UX research, UI design, design systems — we craft experiences your users will love.",
  },
  {
    num: "02",
    title: "Full-Stack Dev",
    desc: "React, Next.js, Node, databases — we own the entire stack. Clean, performant, scalable code. Zero tech debt.",
  },
  {
    num: "03",
    title: "AI Integration",
    desc: "We integrate AI where it matters. Chatbots, automation, RAG, agents — we transform your workflows with the best models on the market.",
  },
  {
    num: "04",
    title: "Ship & Scale",
    desc: "CI/CD, cloud, monitoring, edge computing. Your product goes live in record time, ready to handle growth.",
  },
];

const processSteps = [
  {
    step: "01",
    title: "Discover",
    desc: "We capture your vision, analyze your market, and identify the quick wins and game changers.",
  },
  {
    step: "02",
    title: "Prototype",
    desc: "In days, not months. Interactive prototypes, user testing, ultra-fast iterations.",
  },
  {
    step: "03",
    title: "Build",
    desc: "Short sprints, weekly demos, continuous feedback. We code with AI to move 10x faster.",
  },
  {
    step: "04",
    title: "Launch",
    desc: "Deploy, monitor, optimize. Your product is live and we stick around to help it grow.",
  },
];

const projects = [
  {
    title: "Ambroise Partners",
    category: "Corporate Site",
    year: "2025",
    desc: "Strategic and financial advisory dedicated to healthcare innovation.",
    image: "/img/projects/ambroise.png",
    url: "https://ambroise-partners.vercel.app/",
  },
  {
    title: "Gavroch.com",
    category: "Studio Site",
    year: "2025",
    desc: "Our own AI-native full-stack web development studio.",
    image: "/img/projects/gavroch.png",
    url: "https://www.gavroch.com/",
  },
];

const showcase = [
  {
    title: "Lucis",
    category: "Health & Wellness",
    desc: "Complete health checkup platform — preventive care, reimagined.",
    image: "/img/projects/lucis.png",
    url: "https://www.lucis.life/",
  },
  {
    title: "Panacea",
    category: "Healthcare Innovation",
    desc: "Venture building and capital platform transforming science into healthcare.",
    image: "/img/projects/panacea.png",
    url: "https://www.panacea-hq.com/",
  },
  {
    title: "Yelo",
    category: "Ride-Hailing",
    desc: "Premium ride-hailing with curated music and nightlife vibes.",
    image: "/img/projects/yelo.png",
    url: "https://www.rideyelo.com/",
  },
  {
    title: "NEON",
    category: "Film & Entertainment",
    desc: "Independent film distributor specializing in distinctive cinema.",
    image: "/img/projects/neonrated.png",
    url: "https://www.neonrated.com/",
  },
  {
    title: "Volta SKAI",
    category: "Luxury Real Estate",
    desc: "Luxury residential development with panoramic sea views.",
    image: "/img/projects/voltaskai.png",
    url: "https://voltaskai.endover.ee/en/",
  },
  {
    title: "Aupale Vodka",
    category: "Premium Brand",
    desc: "Premium Canadian vodka crafted from glacier-sourced water.",
    image: "/img/projects/aupalevodka.png",
    url: "https://www.aupalevodka.com/en/",
  },
];

const values = [
  {
    title: "AI-Native",
    desc: "AI isn't an add-on, it's in our DNA. We code with it, think with it, ship with it. Result: 10x faster, 10x smarter.",
  },
  {
    title: "Gen Z Mindset",
    desc: "We're the generation that grew up with code. No pointless processes, no endless meetings. Just ship it.",
  },
  {
    title: "Obsessed w/ Quality",
    desc: "Fast doesn't mean sloppy. Every pixel, every line of code, every interaction is designed for performance.",
  },
];

function techIconUrl(name: string, color: string) {
  const localIcons: Record<string, Record<string, string>> = {
    "OpenAI": { ffffff: "/img/openai.svg", "888888": "/img/openai-gray.svg" },
    "AWS": { ffffff: "/img/aws.svg", "888888": "/img/aws-gray.svg" },
  };
  if (localIcons[name]) return localIcons[name][color] || localIcons[name].ffffff;
  const slugs: Record<string, string> = {
    "Next.js": "nextdotjs",
    "React": "react",
    "TypeScript": "typescript",
    "Node.js": "nodedotjs",
    "Claude": "anthropic",
    "Claude API": "anthropic",
    "LangChain": "langchain",
    "Tailwind CSS": "tailwindcss",
    "Figma": "figma",
    "Vercel": "vercel",
    "Supabase": "supabase",
  };
  return `https://cdn.simpleicons.org/${slugs[name]}/${color}`;
}

const techs = [
  "Next.js",
  "React",
  "TypeScript",
  "Node.js",
  "OpenAI",
  "Claude API",
  "LangChain",
  "Tailwind CSS",
  "Figma",
  "Vercel",
  "AWS",
  "Supabase",
];

const navLinks = [
  { label: "Services", href: "#services" },
  { label: "Pricing", href: "#pricing" },
  { label: "Projects", href: "#projects" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

/* ─── ANIM VARIANTS ─── */

const ease = [0.16, 1, 0.3, 1] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (d: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, delay: d, ease },
  }),
};

const slideUp = {
  hidden: { y: "100%" },
  visible: (d: number) => ({
    y: 0,
    transition: { duration: 1.2, delay: d, ease },
  }),
};

/* ─── PAGE ─── */

export default function Home() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [hovering, setHovering] = useState(false);

  // Scroll progress
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 30,
    restDelta: 0.001,
  });

  const heroRef = useRef<HTMLElement>(null);

  // Hero scroll-driven orange overlay
  const { scrollYProgress: heroProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const orangeOpacity = useTransform(heroProgress, [0, 0.7, 1], [0, 0.3, 1]);

  // Section refs for inView
  const servicesRef = useRef(null);
  const statsRef = useRef(null);
  const processRef = useRef(null);
  const pricingRef = useRef(null);
  const projetsRef = useRef(null);
  const aboutRef = useRef(null);
  const teamRef = useRef(null);
  const contactRef = useRef(null);
  const mailRef = useRef(null);
  const showcaseRef = useRef(null);

  const servicesInView = useInView(servicesRef, { once: true, margin: "-100px" });
  const statsInView = useInView(statsRef, { once: true, margin: "-100px" });
  const processInView = useInView(processRef, { once: true, margin: "-100px" });
  const pricingInView = useInView(pricingRef, { once: true, margin: "-100px" });
  const projetsInView = useInView(projetsRef, { once: true, margin: "-100px" });
  const aboutInView = useInView(aboutRef, { once: true, margin: "-100px" });
  const teamInView = useInView(teamRef, { once: true, margin: "-100px" });
  const contactInView = useInView(contactRef, { once: true, margin: "-100px" });
  const mailInView = useInView(mailRef, { once: true, margin: "-100px" });
  const showcaseInView = useInView(showcaseRef, { once: true, margin: "-100px" });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);


  // Custom cursor
  useEffect(() => {
    const move = (e: MouseEvent) => setPos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", move);

    const addListeners = () => {
      document
        .querySelectorAll("[data-hover], a, button")
        .forEach((el) => {
          el.addEventListener("mouseenter", () => setHovering(true));
          el.addEventListener("mouseleave", () => setHovering(false));
        });
    };
    addListeners();
    const observer = new MutationObserver(addListeners);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener("mousemove", move);
      observer.disconnect();
    };
  }, []);

  return (
    <>
      {/* Custom cursor */}
      <motion.div
        className="fixed top-0 left-0 w-4 h-4 rounded-full bg-white pointer-events-none z-[999] mix-blend-difference hidden md:block"
        animate={{ x: pos.x - 8, y: pos.y - 8, scale: hovering ? 4 : 1 }}
        transition={{ type: "spring", stiffness: 500, damping: 28, mass: 0.5 }}
      />

      {/* Scroll progress */}
      <motion.div
        style={{ scaleX }}
        className="fixed bottom-0 left-0 right-0 h-[2px] bg-fg origin-left z-[100]"
      />

      {/* ═══════════════════ NAVBAR ═══════════════════ */}
      <motion.header
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled ? "bg-bg/80 backdrop-blur-xl" : ""
        }`}
        style={{ color: scrolled ? undefined : "#1a1a1a" }}
      >
        <div className="wrapper flex items-center justify-between h-[60px] md:h-[80px]">
          <a href="#" className="relative z-50" data-hover>
            <span className="text-[16px] md:text-[18px] font-semibold tracking-[0.08em]">
              GAVROCH
              <span className="font-mono font-normal tracking-[0.06em]" style={{ color: scrolled ? undefined : "rgba(0,0,0,0.45)" }}>
                .DEV
              </span>
            </span>
          </a>

          <nav className="hidden md:flex items-center gap-10">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                data-hover
                className={`nav-link text-[12px] uppercase tracking-[0.15em] transition-colors duration-300 ${
                  scrolled ? "text-muted hover:text-fg" : "hover:text-black"
                }`}
                style={scrolled ? undefined : { color: "rgba(0,0,0,0.5)" }}
              >
                {link.label}
              </a>
            ))}
          </nav>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden relative z-50 flex flex-col gap-1.5"
            data-hover
            aria-label="Menu"
          >
            <motion.span
              animate={menuOpen ? { rotate: 45, y: 5 } : { rotate: 0, y: 0 }}
              className="block w-5 h-[1px] bg-current origin-center"
            />
            <motion.span
              animate={menuOpen ? { opacity: 0 } : { opacity: 1 }}
              className="block w-5 h-[1px] bg-current"
            />
            <motion.span
              animate={menuOpen ? { rotate: -45, y: -5 } : { rotate: 0, y: 0 }}
              className="block w-5 h-[1px] bg-current origin-center"
            />
          </button>
        </div>
      </motion.header>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 z-40 bg-bg flex flex-col items-start justify-center gap-8"
            style={{ paddingLeft: 48, paddingRight: 48 }}
          >
            {navLinks.map((link, i) => (
              <motion.a
                key={link.label}
                href={link.href}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.08 }}
                onClick={() => setMenuOpen(false)}
                className="text-[clamp(2rem,7vw,3.5rem)] font-medium tracking-[-0.02em] leading-tight text-fg/80 hover:text-fg transition-colors"
              >
                {link.label}
              </motion.a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══════════════════ HERO ═══════════════════ */}
      <section
        ref={heroRef}
        className="relative flex flex-col justify-end overflow-hidden pt-[80px] pb-[48px] md:pt-[128px] md:pb-[96px]"
        style={{ minHeight: "100vh", background: "linear-gradient(to bottom, #F5F0E8 0%, #FFD000 25%, #FF8C00 50%, #CC2200 80%, #991100 100%)", color: "#1a1a1a" }}
      >
        {/* Animated color waves — hidden on mobile for performance */}
        <motion.div
          className="hero-blob absolute z-0 pointer-events-none"
          animate={{ y: [0, -200, 100, -160, 60, 0], x: [0, 70, -60, 50, -40, 0], rotate: [0, 4, -3, 5, -4, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          style={{ top: "20%", left: "-30%", right: "-30%", height: "50%", background: "#FFD000", borderRadius: "40%", filter: "blur(120px)", opacity: 0.7 }}
        />
        <motion.div
          className="hero-blob absolute z-0 pointer-events-none"
          animate={{ y: [0, 180, -150, 120, -90, 0], x: [0, -90, 70, -60, 50, 0], rotate: [0, -5, 4, -6, 3, 0] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
          style={{ top: "35%", left: "-40%", right: "-40%", height: "45%", background: "#FF6600", borderRadius: "45%", filter: "blur(120px)", opacity: 0.7 }}
        />
        <motion.div
          className="hero-blob absolute z-0 pointer-events-none"
          animate={{ y: [0, -130, 160, -110, 80, 0], x: [0, 60, -80, 40, -70, 0], rotate: [0, 6, -4, 5, -3, 0] }}
          transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
          style={{ bottom: "-30%", left: "-25%", right: "-25%", height: "60%", background: "#CC2200", borderRadius: "50%", filter: "blur(100px)", opacity: 0.6 }}
        />
        <motion.div
          className="hero-blob absolute z-0 pointer-events-none"
          animate={{ y: [0, 140, -100, 80, -60, 0], x: [0, -50, 80, -40, 60, 0], rotate: [0, -3, 5, -4, 2, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          style={{ top: "5%", left: "-20%", right: "-20%", height: "40%", background: "#F5F0E8", borderRadius: "40%", filter: "blur(110px)", opacity: 0.5 }}
        />

        {/* Static grain overlay */}
        <div
          className="grain-overlay absolute inset-0 z-[1] pointer-events-none"
          style={{ opacity: 0.8 }}
        >
          <svg width="100%" height="100%">
            <filter id="heroGrain">
              <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="5" stitchTiles="stitch" />
            </filter>
            <rect width="100%" height="100%" filter="url(#heroGrain)" />
          </svg>
        </div>

        {/* Scroll-driven orange overlay */}
        <motion.div
          className="absolute inset-0 z-[1] pointer-events-none"
          style={{
            opacity: orangeOpacity,
            background: "radial-gradient(ellipse at 50% 80%, rgba(255,120,0,0.95) 0%, rgba(255,160,30,0.8) 40%, rgba(255,100,0,0.6) 70%, rgba(255,80,0,0.4) 100%)",
          }}
        />

        <div className="wrapper relative z-10 flex flex-col justify-between" style={{ minHeight: "calc(100vh - 160px)" }}>
          {/* Top — tagline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="text-[11px] uppercase tracking-[0.25em]"
            style={{ color: "rgba(0,0,0,0.35)" }}
          >
            AI-Native Full-Stack Studio &mdash; Paris
          </motion.p>

          {/* Center — main heading */}
          <div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {["We listen.", "We build.", "We ship."].map((line, i) => (
                <div key={line} className="overflow-hidden">
                  <motion.h1
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    transition={{
                      duration: 1.2,
                      delay: 1 + i * 0.15,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className="text-[clamp(3rem,10vw,8rem)] font-medium uppercase"
                    style={{ lineHeight: 0.9, letterSpacing: "-0.04em", color: "#1a1a1a" }}
                  >
                    {line}
                  </motion.h1>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom — subline left, CTA right */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.8 }}
            className="flex flex-col md:flex-row md:items-end justify-between"
            style={{ gap: 32 }}
          >
            <div>
              <p className="text-[clamp(1.15rem,2.2vw,1.45rem)] font-medium" style={{ lineHeight: 1.5, color: "#1a1a1a", maxWidth: 480 }}>
                The Gen&nbsp;Z spirit to unlock your full&nbsp;potential.
              </p>
              <p className="text-[clamp(0.85rem,1.5vw,1rem)] uppercase tracking-[0.15em]" style={{ marginTop: 12, color: "rgba(0,0,0,0.35)" }}>
                Design &middot; Code &middot; AI &middot; Deploy
              </p>
            </div>
            <motion.a
              href="#services"
              data-hover
              className="text-[12px] uppercase tracking-[0.2em] font-medium flex items-center gap-4 group shrink-0"
              style={{ color: "#1a1a1a" }}
              whileHover={{ x: 4 }}
            >
              Discover
              <span className="inline-block h-[1px] bg-black group-hover:w-16 transition-all duration-500" style={{ width: 40 }} />
            </motion.a>
          </motion.div>
        </div>

        <motion.div
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 1.5, delay: 2.2 }}
          className="absolute bottom-0 left-1/2 origin-top hidden md:block z-10"
          style={{ background: "rgba(0,0,0,0.15)", width: 1, height: 56 }}
        />
      </section>

      {/* ═══════════════════ STUDIO SECTION ═══════════════════ */}
      <section
        className="relative overflow-hidden py-[56px] md:py-[160px]"
        style={{ background: "#050505", color: "#fafafa" }}
      >
        <div className="grain-overlay absolute inset-0 pointer-events-none" style={{ opacity: 0.3 }}>
          <svg width="100%" height="100%"><filter id="grainStudio"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="4" stitchTiles="stitch" /></filter><rect width="100%" height="100%" filter="url(#grainStudio)" /></svg>
        </div>
        <div className="wrapper">
          {/* Large statement */}
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-2 md:gap-16">
            <div style={{ flex: "1 1 0" }}>
              <motion.p
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                custom={0}
                className="text-[11px] uppercase tracking-[0.3em] font-mono mb-2 md:mb-8"
                style={{ color: "rgba(255,255,255,0.3)" }}
              >
                What we do
              </motion.p>
              <motion.h2
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                custom={0.1}
                className="text-[clamp(2.5rem,7vw,6rem)] font-medium"
                style={{ lineHeight: 1, letterSpacing: "-0.04em", color: "#fff" }}
              >
                Full-Stack
                <br />
                <span style={{ color: "rgba(255,255,255,0.3)" }}>Web Development</span>
                <br />
                Studio
              </motion.h2>
            </div>

            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              custom={0.3}
              className="md:flex-[0_1_380px]"
            >
              <p className="text-[15px]" style={{ lineHeight: 1.8, color: "rgba(255,255,255,0.5)" }}>
                We design, code, and deploy digital products built to perform.
                Our AI-native approach lets us move faster without ever sacrificing quality.
              </p>
              <motion.a
                href="#services"
                data-hover
                className="inline-flex items-center gap-3 text-[12px] uppercase tracking-[0.2em] font-medium group mt-2 md:mt-8"
                style={{ color: "#fff" }}
                whileHover={{ x: 4 }}
              >
                Our services
                <span className="inline-block h-[1px] bg-white group-hover:w-16 transition-all duration-500" style={{ width: 40 }} />
              </motion.a>
            </motion.div>
          </div>

          {/* Horizontal divider */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={0.4}
            className="mt-[8px] mb-[8px] md:mt-[80px] md:mb-[80px]"
            style={{ height: 1, background: "rgba(255,255,255,0.08)" }}
          />

          {/* Tech stack grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-4" style={{ gap: 1, background: "rgba(255,255,255,0.06)", borderRadius: 20, overflow: "hidden" }}>
            {[
              { label: "Next.js", cat: "Framework" },
              { label: "React", cat: "UI" },
              { label: "TypeScript", cat: "Language" },
              { label: "Node.js", cat: "Runtime" },
              { label: "OpenAI", cat: "AI" },
              { label: "Claude", cat: "AI" },
              { label: "Figma", cat: "Design" },
              { label: "Vercel", cat: "Deploy" },
            ].map((tech, i) => (
              <motion.div
                key={tech.label}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i * 0.05}
                className="flex flex-col items-center justify-center text-center px-3 py-6 md:px-5 md:py-12"
                style={{ background: "#050505" }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={techIconUrl(tech.label, "ffffff")} alt="" loading="lazy" className="w-6 h-6 md:w-9 md:h-9 mb-3 md:mb-4" style={{ opacity: 0.8 }} />
                <span className="text-[13px] md:text-[17px] font-semibold" style={{ color: "#fff" }}>{tech.label}</span>
                <span className="text-[11px] uppercase tracking-[0.15em] font-mono" style={{ marginTop: 10, color: "rgba(255,255,255,0.3)" }}>{tech.cat}</span>
              </motion.div>
            ))}
          </div>

          {/* Tags */}
          <div
            className="flex flex-wrap justify-center mt-8 md:mt-16"
            style={{ gap: 12 }}
          >
            {[
              "AI-Native",
              "Full-Stack",
              "Gen Z Energy",
              "Ship Fast",
              "Design-Driven",
              "Pixel Perfect",
            ].map((tag, i) => (
              <motion.span
                key={tag}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i * 0.05}
                className="text-[11px] uppercase tracking-[0.15em] font-mono"
                style={{
                  padding: "10px 22px",
                  borderRadius: 100,
                  border: "1px solid rgba(255,140,0,0.35)",
                  color: "rgba(255,140,0,0.7)",
                }}
              >
                {tag}
              </motion.span>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════ MARQUEE ═══════════════════ */}
      <div
        className="border-t border-b border-border overflow-hidden"
        style={{ paddingTop: 20, paddingBottom: 20 }}
      >
        <motion.div
          animate={{ x: [0, "-50%"] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="flex whitespace-nowrap"
          style={{ gap: 48 }}
        >
          {[0, 1].map((r) => (
            <div key={r} className="flex" style={{ gap: 48 }}>
              {techs.map((tech) => (
                <span
                  key={`${r}-${tech}`}
                  className="flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-muted/40 font-mono"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={techIconUrl(tech, "888888")} alt="" loading="lazy" width={12} height={12} style={{ opacity: 0.5 }} />
                  {tech}
                </span>
              ))}
            </div>
          ))}
        </motion.div>
      </div>

      {/* ═══════════════════ À PROPOS ═══════════════════ */}
      <section id="about" className="relative overflow-hidden py-[56px] md:py-[140px]" ref={aboutRef}>
        <div className="grain-overlay absolute inset-0 pointer-events-none" style={{ opacity: 0.15 }}>
          <svg width="100%" height="100%"><filter id="grainAbout"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="4" stitchTiles="stitch" /></filter><rect width="100%" height="100%" filter="url(#grainAbout)" /></svg>
        </div>
        <div className="wrapper">
          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate={aboutInView ? "visible" : "hidden"}
            custom={0}
            className="text-[11px] uppercase tracking-[0.25em] text-muted font-mono mb-6 md:mb-16"
          >
            About
          </motion.p>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16">
            {/* Left column */}
            <div className="md:col-span-5">
              <div className="overflow-hidden">
                <motion.h2
                  variants={slideUp}
                  initial="hidden"
                  animate={aboutInView ? "visible" : "hidden"}
                  custom={0.1}
                  className="text-[clamp(2rem,5vw,4.5rem)] font-medium"
                  style={{ lineHeight: 1.05, letterSpacing: "-0.03em" }}
                >
                  A new kind{" "}
                  <span className="text-muted">of studio.</span>
                </motion.h2>
              </div>

              <motion.p
                variants={fadeUp}
                initial="hidden"
                animate={aboutInView ? "visible" : "hidden"}
                custom={0.25}
                className="text-[14px] text-muted max-w-md mt-5 md:mt-8"
                style={{ lineHeight: 1.9 }}
              >
                We&apos;re a tight crew of developers and designers based in Paris.
                Born in the AI era, we build digital products that move fast, look sharp,
                and actually work. No legacy thinking, no corporate BS.
              </motion.p>

              <motion.p
                variants={fadeUp}
                initial="hidden"
                animate={aboutInView ? "visible" : "hidden"}
                custom={0.35}
                className="text-[14px] text-muted max-w-md"
                style={{ lineHeight: 1.9, marginTop: 16 }}
              >
                We leverage AI to code faster, design smarter, and ship things
                that would take traditional agencies months. That&apos;s our unfair advantage.
              </motion.p>
            </div>

            {/* Right column - values */}
            <div className="md:col-span-6 md:col-start-7">
              {values.map((v, i) => (
                <motion.div
                  key={v.title}
                  variants={fadeUp}
                  initial="hidden"
                  animate={aboutInView ? "visible" : "hidden"}
                  custom={0.2 + i * 0.12}
                  className="border-t border-border py-6 md:py-10"
                >
                  <div className="flex flex-col md:flex-row md:items-start" style={{ gap: 32 }}>
                    <h3
                      className="text-[1.25rem] font-medium"
                      style={{ letterSpacing: "-0.01em", minWidth: 160 }}
                    >
                      {v.title}
                    </h3>
                    <p className="text-[14px] text-muted" style={{ lineHeight: 1.8 }}>
                      {v.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════ STATS BANNER ═══════════════════ */}
      <section className="section-dark relative overflow-hidden py-[48px] md:py-[120px]" ref={statsRef}>
        <div className="grain-overlay absolute inset-0 pointer-events-none" style={{ opacity: 0.25 }}>
          <svg width="100%" height="100%"><filter id="grainStats"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="4" stitchTiles="stitch" /></filter><rect width="100%" height="100%" filter="url(#grainStats)" /></svg>
        </div>
        <div className="wrapper">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate={statsInView ? "visible" : "hidden"}
            custom={0}
            className="flex flex-col md:flex-row md:items-center justify-between gap-10 md:gap-12"
          >
            <h2
              className="text-[clamp(2rem,5vw,4rem)] font-medium max-w-2xl"
              style={{ lineHeight: 1.1, letterSpacing: "-0.03em" }}
            >
              We don&apos;t just talk,
              <br />
              we ship.
            </h2>
            <div className="flex flex-wrap gap-8 md:gap-16">
              {[
                { num: "50+", label: "Projects shipped" },
                { num: "10x", label: "Faster with AI" },
                { num: "100%", label: "Client retention" },
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  variants={fadeUp}
                  initial="hidden"
                  animate={statsInView ? "visible" : "hidden"}
                  custom={0.15 + i * 0.1}
                >
                  <p
                    className="text-[clamp(1.75rem,4vw,3rem)] font-medium"
                    style={{ letterSpacing: "-0.03em", marginBottom: 4, color: "#F5C46A" }}
                  >
                    {stat.num}
                  </p>
                  <p className="text-[11px] uppercase tracking-[0.2em] text-fg-light/40 font-mono">
                    {stat.label}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════ SERVICES ═══════════════════ */}
      <section id="services" className="relative overflow-hidden py-[56px] md:py-[140px]" ref={servicesRef}>
        <div className="grain-overlay absolute inset-0 pointer-events-none" style={{ opacity: 0.15 }}>
          <svg width="100%" height="100%"><filter id="grainServices"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="4" stitchTiles="stitch" /></filter><rect width="100%" height="100%" filter="url(#grainServices)" /></svg>
        </div>
        <div className="wrapper">
          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate={servicesInView ? "visible" : "hidden"}
            custom={0}
            className="text-[11px] uppercase tracking-[0.25em] text-muted font-mono mb-6 md:mb-16"
          >
            Services
          </motion.p>

          <div className="mb-8 md:mb-20">
            <div className="overflow-hidden">
              <motion.h2
                variants={slideUp}
                initial="hidden"
                animate={servicesInView ? "visible" : "hidden"}
                custom={0.1}
                className="text-[clamp(2rem,5vw,4.5rem)] font-medium max-w-4xl"
                style={{ lineHeight: 1.05, letterSpacing: "-0.03em" }}
              >
                Built different.{" "}
                <span style={{ color: "#E8943A" }}>Powered by AI.</span>
              </motion.h2>
            </div>
          </div>

          <div
            className="grid grid-cols-1 md:grid-cols-2"
            style={{ gap: 0 }}
          >
            {services.map((s, i) => (
              <motion.div
                key={s.num}
                variants={fadeUp}
                initial="hidden"
                animate={servicesInView ? "visible" : "hidden"}
                custom={0.15 + i * 0.1}
                className="group border-t border-border py-8 md:py-10"
                style={{ paddingRight: i % 2 === 0 ? 40 : 0 }}
              >
                <span
                  className="text-[11px] font-mono text-muted/40 tracking-wider block"
                  style={{ marginBottom: 20 }}
                >
                  {s.num}
                </span>
                <h3
                  className="text-[clamp(1.5rem,3vw,2.25rem)] font-medium group-hover:translate-x-2 transition-transform duration-500"
                  style={{ letterSpacing: "-0.02em", marginBottom: 16 }}
                >
                  {s.title}
                </h3>
                <p className="text-[14px] text-muted max-w-md" style={{ lineHeight: 1.8 }}>
                  {s.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════ BRAND STATEMENT ═══════════════════ */}
      <section
        className="section-dark relative overflow-hidden"
        style={{ paddingTop: "clamp(48px, 10vw, 120px)", paddingBottom: "clamp(48px, 10vw, 120px)" }}
        onMouseMove={(e) => {
          const textEl = e.currentTarget.querySelector<HTMLElement>(".brand-text-wrap");
          if (!textEl) return;
          const rect = textEl.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          textEl.querySelectorAll<HTMLElement>(".brand-glow").forEach((g) => {
            g.style.setProperty("--mx", `${x}px`);
            g.style.setProperty("--my", `${y}px`);
            g.style.opacity = "1";
          });
        }}
        onMouseLeave={(e) => {
          e.currentTarget.querySelectorAll<HTMLElement>(".brand-glow").forEach((g) => {
            g.style.opacity = "0";
          });
        }}
      >
        <div className="grain-overlay absolute inset-0 pointer-events-none" style={{ opacity: 0.25 }}>
          <svg width="100%" height="100%"><filter id="grainBrand"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="4" stitchTiles="stitch" /></filter><rect width="100%" height="100%" filter="url(#grainBrand)" /></svg>
        </div>
        <div className="wrapper flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="brand-text-wrap relative select-none"
            data-hover
          >
            {/* Base — faint outline */}
            <h2
              className="text-center font-medium"
              style={{
                fontSize: "clamp(2.5rem, 8vw, 8rem)",
                lineHeight: 1.05,
                letterSpacing: "-0.04em",
                color: "transparent",
                WebkitTextStroke: "1px rgba(255,255,255,0.06)",
              }}
            >
              Become a memorable brand.
            </h2>
            {/* Fill layer — animated gradient inside letters, masked to mouse */}
            <h2
              className="brand-glow brand-fill absolute inset-0 text-center font-medium pointer-events-none"
              aria-hidden="true"
              style={{
                fontSize: "clamp(2.5rem, 8vw, 8rem)",
                lineHeight: 1.05,
                letterSpacing: "-0.04em",
                background: "linear-gradient(135deg, #F5F0E8, #FFD000, #FF8C00, #CC2200, #FF8C00, #FFD000, #F5F0E8)",
                backgroundSize: "300% 300%",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                WebkitTextStroke: "0px transparent",
                animation: "brandGradientMove 6s ease-in-out infinite",
                opacity: 0,
                transition: "opacity 0.6s ease",
                maskImage: "radial-gradient(ellipse 900px 600px at var(--mx, 50%) var(--my, 50%), black 0%, transparent 75%)",
                WebkitMaskImage: "radial-gradient(ellipse 900px 600px at var(--mx, 50%) var(--my, 50%), black 0%, transparent 75%)",
              }}
            >
              Become a memorable brand.
            </h2>
            {/* Glow layers — 5 layers, each with unique color/size/speed/orbit */}
            {[
              { color: "rgba(245,240,232,0.35)", stroke: 1, blur: 4, w: 900, h: 650, dur: "4.2s", anim: "bOrb1", delay: "0s" },
              { color: "rgba(255,208,0,0.5)", stroke: 1.2, blur: 10, w: 700, h: 450, dur: "3.1s", anim: "bOrb2", delay: "-0.8s" },
              { color: "rgba(255,140,0,0.55)", stroke: 1.5, blur: 14, w: 1000, h: 550, dur: "5.3s", anim: "bOrb3", delay: "-1.6s" },
              { color: "rgba(255,80,0,0.4)", stroke: 1, blur: 18, w: 800, h: 800, dur: "3.8s", anim: "bOrb4", delay: "-2.4s" },
              { color: "rgba(204,34,0,0.3)", stroke: 1.3, blur: 22, w: 600, h: 900, dur: "6.1s", anim: "bOrb5", delay: "-0.5s" },
            ].map((l, i) => (
              <h2
                key={i}
                className="brand-glow absolute inset-0 text-center font-medium pointer-events-none"
                aria-hidden="true"
                style={{
                  fontSize: "clamp(2.5rem, 8vw, 8rem)",
                  lineHeight: 1.05,
                  letterSpacing: "-0.04em",
                  color: "transparent",
                  WebkitTextStroke: `${l.stroke}px ${l.color}`,
                  filter: `drop-shadow(0 0 ${l.blur}px ${l.color})`,
                  opacity: 0,
                  transition: "opacity 0.6s ease",
                  maskImage: `radial-gradient(ellipse ${l.w}px ${l.h}px at var(--mx, 50%) var(--my, 50%), black 0%, transparent 80%)`,
                  WebkitMaskImage: `radial-gradient(ellipse ${l.w}px ${l.h}px at var(--mx, 50%) var(--my, 50%), black 0%, transparent 80%)`,
                  animation: `${l.anim} ${l.dur} ease-in-out ${l.delay} infinite`,
                }}
              >
                Become a memorable brand.
              </h2>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════ PROCESS ═══════════════════ */}
      <section className="relative overflow-hidden py-[56px] md:py-[140px]" ref={processRef}>
        <div className="grain-overlay absolute inset-0 pointer-events-none" style={{ opacity: 0.15 }}>
          <svg width="100%" height="100%"><filter id="grainProcess"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="4" stitchTiles="stitch" /></filter><rect width="100%" height="100%" filter="url(#grainProcess)" /></svg>
        </div>
        <div className="wrapper">
          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate={processInView ? "visible" : "hidden"}
            custom={0}
            className="text-[11px] uppercase tracking-[0.25em] text-muted font-mono mb-6 md:mb-16"
          >
            Our process
          </motion.p>

          <div className="mb-8 md:mb-20">
            <div className="overflow-hidden">
              <motion.h2
                variants={slideUp}
                initial="hidden"
                animate={processInView ? "visible" : "hidden"}
                custom={0.1}
                className="text-[clamp(2rem,5vw,4.5rem)] font-medium max-w-4xl"
                style={{ lineHeight: 1.05, letterSpacing: "-0.03em" }}
              >
                From zero to live{" "}
                <span className="text-muted">in record time.</span>
              </motion.h2>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4" style={{ gap: 0 }}>
            {processSteps.map((p, i) => (
              <motion.div
                key={p.step}
                variants={fadeUp}
                initial="hidden"
                animate={processInView ? "visible" : "hidden"}
                custom={0.15 + i * 0.12}
                className="border-t border-border pt-6 pb-8 pr-4 md:pt-8 md:pb-12 md:pr-10"
              >
                <span
                  className="text-[11px] font-mono tracking-wider block"
                  style={{ marginBottom: 32, color: "#E8943A" }}
                >
                  {p.step}
                </span>
                <h3
                  className="text-[1.25rem] font-medium"
                  style={{ letterSpacing: "-0.01em", marginBottom: 12 }}
                >
                  {p.title}
                </h3>
                <p className="text-[13px] text-muted" style={{ lineHeight: 1.8 }}>
                  {p.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>


      {/* ═══════════════════ PROJETS ═══════════════════ */}
      <section id="projects" className="relative overflow-hidden pt-[56px] pb-[32px] md:pt-[140px] md:pb-[40px]" ref={projetsRef} style={{ background: "#fafafa" }}>
        <div className="wrapper">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12 md:mb-20">
            <div>
              <motion.p
                variants={fadeUp}
                initial="hidden"
                animate={projetsInView ? "visible" : "hidden"}
                custom={0}
                className="text-[11px] uppercase tracking-[0.25em] font-mono mb-5 md:mb-8"
                style={{ color: "rgba(0,0,0,0.3)" }}
              >
                Selected work
              </motion.p>
              <motion.h2
                variants={slideUp}
                initial="hidden"
                animate={projetsInView ? "visible" : "hidden"}
                custom={0.1}
                className="text-[clamp(2rem,5vw,4.5rem)] font-medium"
                style={{ lineHeight: 1.05, letterSpacing: "-0.03em", color: "#0a0a0a" }}
              >
                What we&apos;ve built{" "}
                <span style={{ color: "rgba(0,0,0,0.2)" }}>recently.</span>
              </motion.h2>
            </div>
            <motion.p
              variants={fadeUp}
              initial="hidden"
              animate={projetsInView ? "visible" : "hidden"}
              custom={0.2}
              className="text-[13px] max-w-xs mt-4 md:mt-0 hidden md:block"
              style={{ color: "rgba(0,0,0,0.4)", lineHeight: 1.7 }}
            >
              A selection of projects we&apos;ve designed, developed, and shipped for our clients.
            </motion.p>
          </div>

          {/* Projects — 2-column staggered grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
            {projects.map((p, i) => (
              <motion.a
                key={p.title}
                href={p.url}
                target="_blank"
                rel="noopener noreferrer"
                variants={fadeUp}
                initial="hidden"
                animate={projetsInView ? "visible" : "hidden"}
                custom={0.15 + i * 0.1}
                className="group block"
                data-hover
                style={{ marginTop: i % 2 !== 0 ? 48 : 0 }}
              >
                {/* Card */}
                <div
                  className="relative overflow-hidden rounded-2xl transition-all duration-500 group-hover:shadow-xl"
                  style={{
                    background: "#fff",
                    border: "1px solid rgba(0,0,0,0.07)",
                    boxShadow: "0 2px 16px rgba(0,0,0,0.04)",
                  }}
                >
                  {/* Browser chrome */}
                  <div className="flex items-center gap-2 px-4" style={{ height: 36, borderBottom: "1px solid rgba(0,0,0,0.05)" }}>
                    <div className="flex items-center gap-1.5">
                      <div className="w-[9px] h-[9px] rounded-full" style={{ background: "#ff5f57" }} />
                      <div className="w-[9px] h-[9px] rounded-full" style={{ background: "#febc2e" }} />
                      <div className="w-[9px] h-[9px] rounded-full" style={{ background: "#28c840" }} />
                    </div>
                    <div
                      className="ml-2 flex-1 max-w-[240px] flex items-center rounded-md px-3"
                      style={{ height: 22, background: "rgba(0,0,0,0.03)" }}
                    >
                      <span className="text-[10px] font-mono truncate" style={{ color: "rgba(0,0,0,0.25)" }}>
                        {p.url?.replace("https://", "").replace(/\/$/, "")}
                      </span>
                    </div>
                  </div>

                  {/* Screenshot */}
                  <div className="relative overflow-hidden" style={{ height: 340 }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={p.image}
                      alt={p.title}
                      loading="lazy"
                      className="w-full h-auto"
                      style={{ position: "absolute", top: 0, left: 0 }}
                    />
                    {/* Hover overlay */}
                    <div
                      className="absolute inset-0 flex items-end p-5 transition-opacity duration-500 opacity-0 group-hover:opacity-100"
                      style={{ background: "linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 50%)" }}
                    >
                      <span className="text-[11px] uppercase tracking-[0.15em] font-medium text-white/90">
                        View project &rarr;
                      </span>
                    </div>
                  </div>
                </div>

                {/* Info */}
                <div className="flex items-start justify-between mt-4 px-1">
                  <div>
                    <div className="flex items-center gap-2.5 mb-1">
                      <span className="text-[10px] font-mono" style={{ color: "rgba(0,0,0,0.2)" }}>
                        0{i + 1}
                      </span>
                      <h3 className="text-[1.05rem] md:text-[1.15rem] font-medium" style={{ letterSpacing: "-0.02em", color: "#0a0a0a" }}>
                        {p.title}
                      </h3>
                    </div>
                    <p className="text-[12px]" style={{ color: "rgba(0,0,0,0.4)" }}>
                      {p.desc}
                    </p>
                  </div>
                  <span
                    className="shrink-0 text-[9px] font-mono tracking-wider px-2.5 py-1 rounded-full mt-0.5"
                    style={{ background: "rgba(0,0,0,0.04)", color: "rgba(0,0,0,0.4)" }}
                  >
                    {p.category}
                  </span>
                </div>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════ SHOWCASE ═══════════════════ */}
      <section className="relative overflow-hidden pt-[32px] pb-[56px] md:pt-[40px] md:pb-[120px]" ref={showcaseRef} style={{ background: "#fafafa" }}>
        <div className="wrapper">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12 md:mb-20">
            <div>
              <motion.p
                variants={fadeUp}
                initial="hidden"
                animate={showcaseInView ? "visible" : "hidden"}
                custom={0}
                className="text-[11px] uppercase tracking-[0.25em] font-mono mb-5 md:mb-8"
                style={{ color: "rgba(0,0,0,0.3)" }}
              >
                Showcase
              </motion.p>
              <motion.h2
                variants={slideUp}
                initial="hidden"
                animate={showcaseInView ? "visible" : "hidden"}
                custom={0.1}
                className="text-[clamp(2rem,5vw,4.5rem)] font-medium"
                style={{ lineHeight: 1.05, letterSpacing: "-0.03em", color: "#0a0a0a" }}
              >
                We can build{" "}
                <span style={{ color: "rgba(0,0,0,0.2)" }}>anything.</span>
              </motion.h2>
            </div>
            <motion.p
              variants={fadeUp}
              initial="hidden"
              animate={showcaseInView ? "visible" : "hidden"}
              custom={0.2}
              className="text-[13px] max-w-xs mt-4 md:mt-0 hidden md:block"
              style={{ color: "rgba(0,0,0,0.4)", lineHeight: 1.7 }}
            >
              From luxury brands to health platforms — the kind of sites we craft every day.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
            {showcase.map((p, i) => (
              <motion.a
                key={p.title}
                href={p.url}
                target="_blank"
                rel="noopener noreferrer"
                variants={fadeUp}
                initial="hidden"
                animate={showcaseInView ? "visible" : "hidden"}
                custom={0.1 + i * 0.07}
                className="group block"
                data-hover
              >
                <div
                  className="relative overflow-hidden rounded-xl transition-all duration-500 group-hover:shadow-lg"
                  style={{
                    background: "#fff",
                    border: "1px solid rgba(0,0,0,0.06)",
                    boxShadow: "0 1px 8px rgba(0,0,0,0.03)",
                  }}
                >
                  <div className="relative overflow-hidden" style={{ height: 220 }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={p.image}
                      alt={p.title}
                      loading="lazy"
                      className="w-full h-auto"
                      style={{ position: "absolute", top: 0, left: 0 }}
                    />
                    <div
                      className="absolute inset-0 flex items-end p-4 transition-opacity duration-500 opacity-0 group-hover:opacity-100"
                      style={{ background: "linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 50%)" }}
                    >
                      <span className="text-[10px] uppercase tracking-[0.15em] font-medium text-white/90">
                        Visit &rarr;
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-3 px-0.5">
                  <h3 className="text-[0.9rem] font-medium" style={{ letterSpacing: "-0.02em", color: "#0a0a0a" }}>
                    {p.title}
                  </h3>
                  <span
                    className="text-[8px] font-mono tracking-wider px-2 py-0.5 rounded-full"
                    style={{ background: "rgba(0,0,0,0.04)", color: "rgba(0,0,0,0.4)" }}
                  >
                    {p.category}
                  </span>
                </div>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════ PRICING ═══════════════════ */}
      <section id="pricing" className="section-dark relative overflow-hidden py-[56px] md:py-[140px]" ref={pricingRef}>
        <div className="grain-overlay absolute inset-0 pointer-events-none" style={{ opacity: 0.25 }}>
          <svg width="100%" height="100%"><filter id="grainPricing"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="4" stitchTiles="stitch" /></filter><rect width="100%" height="100%" filter="url(#grainPricing)" /></svg>
        </div>
        <div className="wrapper">
          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate={pricingInView ? "visible" : "hidden"}
            custom={0}
            className="text-[11px] uppercase tracking-[0.25em] font-mono mb-6 md:mb-16"
            style={{ color: "rgba(255,255,255,0.4)" }}
          >
            Pricing
          </motion.p>

          <div className="mb-8 md:mb-20">
            <div className="overflow-hidden">
              <motion.h2
                variants={slideUp}
                initial="hidden"
                animate={pricingInView ? "visible" : "hidden"}
                custom={0.1}
                className="text-[clamp(2rem,5vw,4.5rem)] font-medium max-w-4xl"
                style={{ lineHeight: 1.05, letterSpacing: "-0.03em" }}
              >
                Transparent pricing.
                <br />
                <span style={{ color: "rgba(255,255,255,0.3)" }}>No surprises.</span>
              </motion.h2>
            </div>
          </div>

          <div className="group/pricing grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
            {[
              {
                name: "Starter",
                price: "399",
                desc: "A complete, professional website to establish your online presence — fast and reliable.",
                features: [
                  "Full website",
                  "Professional template-based design",
                  "Fully responsive on all devices",
                  "1 post-launch revision included",
                  "On-demand support",
                  "Optional \"Built by Gavroch.Dev\" badge",
                ],
                maintenance: "€30/mo — hosting, security & backups",
                extra: "€100 per additional change",
                cta: "Get started",
              },
              {
                name: "Custom Build",
                price: "629",
                highlight: true,
                desc: "Our core offering — a conversion-optimized site with real guidance throughout the process.",
                features: [
                  "Conversion-focused full website",
                  "Fully responsive on all devices",
                  "Local SEO tailored to your business",
                  "Google Business optimization",
                  "1 month of dedicated support",
                  "4 reasonable revisions included",
                  "Priority assistance",
                ],
                maintenance: "€30/mo — hosting & security",
                extra: "€70 per additional revision",
                cta: "Get started",
              },
              {
                name: "Brand + Build",
                price: "999",
                desc: "The full package — bespoke design, advanced UX, and 3 months of hands-on partnership.",
                features: [
                  "Full website + dedicated landing page",
                  "Custom design from scratch",
                  "UX engineered for conversions",
                  "Advanced local SEO",
                  "Premium speed optimization",
                  "Google Analytics & tracking setup",
                  "Advanced mobile optimization",
                  "3 months of ongoing support",
                  "Site adjustments & visibility consulting",
                  "Performance tracking & continuous optimization",
                ],
                maintenance: "€10/mo — hosting & security",
                extra: "€40 per revision — priority & fast turnaround",
                cta: "Get started",
              },
            ].map((plan, i) => (
              <motion.div
                key={plan.name}
                variants={fadeUp}
                initial="hidden"
                animate={pricingInView ? "visible" : "hidden"}
                custom={0.15 + i * 0.1}
                className="group/card relative flex flex-col rounded-2xl overflow-hidden transition-all duration-500 opacity-60 hover:opacity-100 group-hover/pricing:opacity-50 hover:!opacity-100"
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
                  <div
                    className="absolute top-0 left-0 right-0 h-[2px]"
                    style={{ background: "linear-gradient(90deg, transparent, #E8943A, transparent)" }}
                  />
                )}

                <div className="p-7 md:p-9 flex-1 flex flex-col">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-6">
                    <p className="text-[12px] uppercase tracking-[0.2em] font-mono" style={{ color: plan.highlight ? "#E8943A" : "rgba(255,255,255,0.35)" }}>
                      {plan.name}
                    </p>
                    {plan.highlight && (
                      <span
                        className="text-[9px] uppercase tracking-[0.15em] font-mono px-2.5 py-1 rounded-full"
                        style={{ background: "rgba(232,148,58,0.15)", color: "#E8943A" }}
                      >
                        Popular
                      </span>
                    )}
                  </div>

                  {/* Price */}
                  <div className="mb-5">
                    <span
                      className="text-[clamp(2.8rem,4.5vw,3.8rem)] font-medium"
                      style={{ letterSpacing: "-0.04em", color: plan.highlight ? "#fff" : "#fff" }}
                    >
                      €{plan.price}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-[13px] mb-7" style={{ lineHeight: 1.7, color: "rgba(255,255,255,0.45)" }}>
                    {plan.desc}
                  </p>

                  {/* Divider */}
                  <div className="mb-6" style={{ height: 1, background: plan.highlight ? "rgba(232,148,58,0.15)" : "rgba(255,255,255,0.06)" }} />

                  {/* Features */}
                  <div className="flex-1 flex flex-col gap-3.5 mb-7">
                    {plan.features.map((f) => (
                      <div key={f} className="flex items-start gap-3">
                        <svg className="mt-0.5 shrink-0" width="14" height="14" viewBox="0 0 14 14" fill="none">
                          <path
                            d="M3.5 7L6 9.5L10.5 4.5"
                            stroke={plan.highlight ? "#E8943A" : "rgba(255,255,255,0.25)"}
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        <span className="text-[13px]" style={{ color: "rgba(255,255,255,0.6)", lineHeight: 1.5 }}>{f}</span>
                      </div>
                    ))}
                  </div>

                  {/* Maintenance & extras */}
                  <div
                    className="mb-7 p-3.5 rounded-lg"
                    style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.04)" }}
                  >
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-[10px] uppercase tracking-[0.15em] font-mono" style={{ color: "rgba(255,255,255,0.3)" }}>
                        Maintenance
                      </span>
                    </div>
                    <p className="text-[11px]" style={{ color: "rgba(255,255,255,0.4)", lineHeight: 1.5 }}>
                      {plan.maintenance}
                    </p>
                    <p className="text-[11px] mt-1" style={{ color: "rgba(255,255,255,0.3)", lineHeight: 1.5 }}>
                      {plan.extra}
                    </p>
                  </div>

                  {/* CTA */}
                  <motion.a
                    href="#contact"
                    data-hover
                    className="text-center text-[12px] uppercase tracking-[0.15em] font-medium py-4 rounded-xl transition-all duration-300"
                    style={{
                      background: plan.highlight
                        ? "linear-gradient(135deg, #E8943A, #D4802A)"
                        : "transparent",
                      color: plan.highlight ? "#050505" : "rgba(255,255,255,0.6)",
                      border: plan.highlight ? "none" : "1px solid rgba(255,255,255,0.12)",
                    }}
                    whileHover={{ scale: 1.02, y: -1 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {plan.cta}
                  </motion.a>
                </div>
              </motion.div>
            ))}
          </div>
          <p className="text-center text-[12px] mt-10 md:mt-14 max-w-xl mx-auto" style={{ color: "rgba(255,255,255,0.3)", lineHeight: 1.7 }}>
            All our websites are built with the same technical quality. The difference lies in the level of support and guidance you choose to receive.
          </p>
        </div>
      </section>

      {/* ═══════════════════ TEAM ═══════════════════ */}
      <section className="section-dark relative overflow-hidden py-[56px] md:py-[140px]" ref={teamRef}>
        <div className="grain-overlay absolute inset-0 pointer-events-none" style={{ opacity: 0.25 }}>
          <svg width="100%" height="100%"><filter id="grainTeam"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="4" stitchTiles="stitch" /></filter><rect width="100%" height="100%" filter="url(#grainTeam)" /></svg>
        </div>
        <div className="wrapper">
          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate={teamInView ? "visible" : "hidden"}
            custom={0}
            className="text-[11px] uppercase tracking-[0.25em] font-mono mb-6 md:mb-16"
            style={{ color: "rgba(255,255,255,0.4)" }}
          >
            The team
          </motion.p>

          <div className="mb-8 md:mb-20">
            <div className="overflow-hidden">
              <motion.h2
                variants={slideUp}
                initial="hidden"
                animate={teamInView ? "visible" : "hidden"}
                custom={0.1}
                className="text-[clamp(2rem,5vw,4.5rem)] font-medium max-w-4xl"
                style={{ lineHeight: 1.05, letterSpacing: "-0.03em" }}
              >
                Two founders.{" "}
                <span style={{ color: "rgba(255,255,255,0.3)" }}>One vision.</span>
              </motion.h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {[
              {
                name: "Adrien Svabek",
                initials: "AS",
                photo: "/img/adrien.jpeg",
                role: "Co-founder, Developer & UX/UI Designer",
                desc: "Full-stack engineer obsessed with clean code and AI integration. Builds products that scale from day one.",
                linkedin: "https://www.linkedin.com/in/adrien-svabek-1451101aa/",
                education: "MSc 224 — Dauphine PSL",
                experience: ["EY", "Cambon Partners"],
              },
              {
                name: "Alexandre Cohen-Skalli",
                initials: "AC",
                photo: "/img/alexandre.jpeg",
                role: "Co-founder, Developer & UX/UI Designer",
                desc: "UI/UX designer with a sharp eye for detail. Turns complex ideas into interfaces people actually enjoy using.",
                linkedin: "https://www.linkedin.com/in/alexandre-cohen-skalli-a718bb206/",
                education: "MSc 203 — Dauphine PSL",
                experience: ["Goldman Sachs", "HSBC", "Société Générale"],
              },
            ].map((member, i) => (
              <motion.div
                key={member.name}
                variants={fadeUp}
                initial="hidden"
                animate={teamInView ? "visible" : "hidden"}
                custom={0.15 + i * 0.12}
                className="flex flex-col items-center text-center p-8 md:p-12 rounded-2xl"
                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={member.photo}
                  alt={member.name}
                  loading="lazy"
                  className="w-28 h-28 md:w-36 md:h-36 rounded-full object-cover"
                  style={{ border: member.name === "Alexandre Cohen-Skalli" ? "3px solid rgba(255,140,0,0.45)" : "2px solid rgba(255,140,0,0.2)", marginBottom: 24, filter: member.name === "Alexandre Cohen-Skalli" ? "grayscale(100%)" : undefined }}
                  onError={(e) => { e.currentTarget.style.display = "none"; e.currentTarget.nextElementSibling?.classList.remove("hidden"); }}
                />
                <div
                  className="hidden w-28 h-28 md:w-36 md:h-36 rounded-full items-center justify-center text-[28px] md:text-[32px] font-medium shrink-0"
                  style={{ background: "rgba(255,140,0,0.12)", color: "#E8943A", border: "2px solid rgba(255,140,0,0.2)", marginBottom: 24 }}
                >
                  {member.initials}
                </div>
                <h3 className="text-[1.35rem] md:text-[1.5rem] font-medium" style={{ marginBottom: 4 }}>
                  {member.name}
                </h3>
                <p className="text-[12px] uppercase tracking-[0.15em] font-mono" style={{ color: "#E8943A", marginBottom: 20 }}>
                  {member.role}
                </p>
                <p className="text-[14px] max-w-sm" style={{ lineHeight: 1.8, color: "rgba(255,255,255,0.5)", marginBottom: 20 }}>
                  {member.desc}
                </p>

                {/* Education */}
                <p className="text-[11px] uppercase tracking-[0.15em] font-mono" style={{ color: "rgba(255,255,255,0.25)", marginBottom: 12 }}>
                  {member.education}
                </p>

                {/* Experience */}
                <div className="flex flex-wrap justify-center gap-2" style={{ marginBottom: 24 }}>
                  {member.experience.map((company) => (
                    <span
                      key={company}
                      className="text-[11px] tracking-[0.08em] font-mono"
                      style={{
                        padding: "6px 14px",
                        borderRadius: 100,
                        border: "1px solid rgba(255,255,255,0.1)",
                        color: "rgba(255,255,255,0.4)",
                      }}
                    >
                      {company}
                    </span>
                  ))}
                </div>

                <a
                  href={member.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-hover
                  className="text-[12px] uppercase tracking-[0.15em] font-mono hover:text-fg-light transition-colors duration-300"
                  style={{ color: "rgba(255,255,255,0.3)" }}
                >
                  LinkedIn &rarr;
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════ MAIL CTA ═══════════════════ */}
      <section className="relative overflow-hidden py-[48px] md:py-[80px]" ref={mailRef} style={{ background: "#fafafa" }}>
        <div className="wrapper">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate={mailInView ? "visible" : "hidden"}
              custom={0}
            >
              <p className="text-[11px] uppercase tracking-[0.25em] font-mono mb-3" style={{ color: "rgba(0,0,0,0.25)" }}>
                Have a project in mind?
              </p>
              <a
                href="mailto:svabekadrien@gmail.com"
                data-hover
                className="group inline-flex items-center gap-4 text-[clamp(1rem,2vw,1.4rem)] font-medium transition-colors duration-300"
                style={{ color: "rgba(0,0,0,0.5)", letterSpacing: "-0.02em" }}
              >
                svabekadrien@gmail.com
                <span
                  className="inline-block w-8 h-[1px] group-hover:w-14 transition-all duration-500"
                  style={{ background: "linear-gradient(90deg, #FFD000, #FF8C00)" }}
                />
              </a>
            </motion.div>
            <motion.p
              variants={fadeUp}
              initial="hidden"
              animate={mailInView ? "visible" : "hidden"}
              custom={0.15}
              className="text-[12px] max-w-[240px] hidden md:block"
              style={{ color: "rgba(0,0,0,0.2)", lineHeight: 1.7, textAlign: "right" }}
            >
              Drop us a line — we reply fast.
            </motion.p>
          </div>
        </div>
      </section>

      {/* ═══════════════════ CONTACT ═══════════════════ */}
      <section id="contact" className="section-dark relative overflow-hidden py-[56px] md:py-[140px]" ref={contactRef}>
        <div className="grain-overlay absolute inset-0 pointer-events-none" style={{ opacity: 0.25 }}>
          <svg width="100%" height="100%"><filter id="grainContact"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="4" stitchTiles="stitch" /></filter><rect width="100%" height="100%" filter="url(#grainContact)" /></svg>
        </div>
        <div className="wrapper">
          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate={contactInView ? "visible" : "hidden"}
            custom={0}
            className="text-[11px] uppercase tracking-[0.25em] font-mono mb-6 md:mb-16"
            style={{ color: "rgba(255,255,255,0.4)" }}
          >
            Contact
          </motion.p>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16">
            {/* Left */}
            <div className="md:col-span-7">
              <div className="overflow-hidden">
                <motion.h2
                  variants={slideUp}
                  initial="hidden"
                  animate={contactInView ? "visible" : "hidden"}
                  custom={0.1}
                  className="text-[clamp(2.5rem,6vw,5.5rem)] font-medium"
                  style={{ lineHeight: 1, letterSpacing: "-0.04em" }}
                >
                  Ready to build&nbsp;?
                </motion.h2>
              </div>
              <div className="overflow-hidden" style={{ marginTop: 8 }}>
                <motion.h2
                  variants={slideUp}
                  initial="hidden"
                  animate={contactInView ? "visible" : "hidden"}
                  custom={0.2}
                  className="text-[clamp(2.5rem,6vw,5.5rem)] font-medium"
                  style={{ lineHeight: 1, letterSpacing: "-0.04em", color: "#E8943A" }}
                >
                  Let&apos;s talk.
                </motion.h2>
              </div>

              <motion.div
                variants={fadeUp}
                initial="hidden"
                animate={contactInView ? "visible" : "hidden"}
                custom={0.35}
                className="mt-10 md:mt-16"
              >
                <motion.a
                  href="mailto:svabekadrien@gmail.com"
                  data-hover
                  className="inline-flex items-center text-[12px] uppercase tracking-[0.2em] font-medium group"
                  style={{ gap: 16 }}
                  whileHover={{ x: 4 }}
                >
                  Hit us up
                  <span
                    className="inline-block h-[1px] bg-fg-light group-hover:w-16 transition-all duration-500"
                    style={{ width: 40 }}
                  />
                </motion.a>
              </motion.div>
            </div>

            {/* Right */}
            <div className="md:col-span-4 md:col-start-9 flex flex-col justify-end gap-8 md:gap-10">
              <motion.div
                variants={fadeUp}
                initial="hidden"
                animate={contactInView ? "visible" : "hidden"}
                custom={0.25}
                style={{ display: "flex", flexDirection: "column", gap: 24 }}
              >
                <a
                  href="mailto:svabekadrien@gmail.com"
                  data-hover
                  className="flex items-center text-[13px] hover:text-fg-light transition-colors duration-300 group"
                  style={{ gap: 16, color: "rgba(255,255,255,0.45)" }}
                >
                  <Mail size={14} style={{ color: "rgba(255,255,255,0.2)" }} />
                  svabekadrien@gmail.com
                </a>
                <div
                  className="flex items-center text-[13px]"
                  style={{ gap: 16, color: "rgba(255,255,255,0.45)" }}
                >
                  <MapPin size={14} style={{ color: "rgba(255,255,255,0.2)" }} />
                  Paris, France
                </div>
              </motion.div>

              <motion.div
                variants={fadeUp}
                initial="hidden"
                animate={contactInView ? "visible" : "hidden"}
                custom={0.35}
                className="border-t border-border-dark"
                style={{ paddingTop: 24 }}
              >
                <p
                  className="text-[11px] uppercase tracking-[0.2em] font-mono"
                  style={{ marginBottom: 16, color: "rgba(255,255,255,0.15)" }}
                >
                  Socials
                </p>
                <div className="flex" style={{ gap: 24 }}>
                  {["LinkedIn", "GitHub", "Twitter"].map((social) => (
                    <a
                      key={social}
                      href="#"
                      data-hover
                      className="text-[12px] hover:text-fg-light transition-colors duration-300 tracking-wider"
                      style={{ color: "rgba(255,255,255,0.25)" }}
                    >
                      {social}
                    </a>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════ FOOTER ═══════════════════ */}
      <footer className="border-t border-border" style={{ paddingTop: 32, paddingBottom: 32 }}>
        <div className="wrapper flex flex-col md:flex-row items-center justify-between" style={{ gap: 16 }}>
          <span className="text-[11px] text-muted/30 font-mono tracking-wider">
            &copy; {new Date().getFullYear()} GAVROCH.DEV
          </span>
          <div className="flex" style={{ gap: 32 }}>
            {["Legal", "Privacy"].map((link) => (
              <a
                key={link}
                href="#"
                className="text-[11px] text-muted/20 hover:text-muted/50 font-mono tracking-wider transition-colors duration-300"
              >
                {link}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </>
  );
}
