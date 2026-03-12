"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Sparkles, Mail, Share2, Calendar, FileText, Headphones, BarChart3 } from "lucide-react";
import { useEffect, useRef, useCallback, useState } from "react";

const ease = [0.16, 1, 0.3, 1] as const;

/* ── Agent orbit items ── */
const agents = [
  { icon: Mail, label: "Mail Agent", desc: "Drafts and sends emails automatically, follow-ups included." },
  { icon: Share2, label: "Social Agent", desc: "Posts, schedules and engages across your social channels." },
  { icon: Calendar, label: "Planning Agent", desc: "Manages your calendar, books meetings, optimizes your time." },
  { icon: FileText, label: "Content Agent", desc: "Generates articles, product sheets and SEO content on the fly." },
  { icon: Headphones, label: "Support Agent", desc: "Answers your customers 24/7 with intelligence and empathy." },
  { icon: BarChart3, label: "Data Agent", desc: "Analyzes your data and generates actionable reports." },
];

/* ── Pre-compute orbit positions for 6 agents on 240° arc ── */
const arcSpan = 240;
function getOrbitPos(index: number, total: number, radius: number) {
  const angle = -90 - arcSpan / 2 + (index / (total - 1)) * arcSpan;
  const rad = (angle * Math.PI) / 180;
  return {
    x: Math.cos(rad) * radius,
    y: Math.sin(rad) * radius,
    isTop: Math.sin(rad) < 0,
  };
}

/* ── Interactive 3D dot sphere on <canvas> ── */
function DotSphere({ size = 500 }: { size?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouse = useRef({ x: 0, y: 0, active: false });
  const rotation = useRef({ x: 0.35, y: 0 });
  const velocity = useRef({ x: 0, y: 0 });

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    mouse.current.x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    mouse.current.y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
  }, []);

  const handleMouseEnter = useCallback(() => { mouse.current.active = true; }, []);
  const handleMouseLeave = useCallback(() => { mouse.current.active = false; }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    ctx.scale(dpr, dpr);

    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseenter", handleMouseEnter);
    canvas.addEventListener("mouseleave", handleMouseLeave);

    const numPoints = 900;
    const goldenAngle = Math.PI * (3 - Math.sqrt(5));
    const points: [number, number, number][] = [];

    for (let i = 0; i < numPoints; i++) {
      const y = 1 - (i / (numPoints - 1)) * 2;
      const r = Math.sqrt(1 - y * y);
      const theta = goldenAngle * i;
      points.push([Math.cos(theta) * r, y, Math.sin(theta) * r]);
    }

    const hues = [350, 330, 210, 280, 340, 200];
    const batchSize = 18;
    const colors = points.map((_, i) => hues[Math.floor(i / batchSize) % hues.length]);

    const sphereRadius = size * 0.36;
    let time = 0;
    let animId: number;

    function render() {
      ctx!.clearRect(0, 0, size, size);
      const cx = size / 2;
      const cy = size / 2;
      time += 0.012;

      if (mouse.current.active) {
        velocity.current.x += (mouse.current.y * 0.02 - velocity.current.x) * 0.08;
        velocity.current.y += (mouse.current.x * 0.02 - velocity.current.y) * 0.08;
      } else {
        velocity.current.x += (0.001 - velocity.current.x) * 0.02;
        velocity.current.y += (0.003 - velocity.current.y) * 0.02;
      }

      rotation.current.x += velocity.current.x;
      rotation.current.y += velocity.current.y;

      const cosY = Math.cos(rotation.current.y), sinY = Math.sin(rotation.current.y);
      const cosX = Math.cos(rotation.current.x), sinX = Math.sin(rotation.current.x);

      const projected = points.map(([px, py, pz], i) => {
        const x1 = px * cosY - pz * sinY;
        const z1 = px * sinY + pz * cosY;
        const y1 = py * cosX - z1 * sinX;
        const z2 = py * sinX + z1 * cosX;
        return { x: x1, y: y1, z: z2, idx: i };
      });

      projected.sort((a, b) => a.z - b.z);

      for (const p of projected) {
        const depth = (p.z + 1) / 2;
        const screenX = cx + p.x * sphereRadius;
        const screenY = cy + p.y * sphereRadius;
        const dotRadius = 0.35 + depth * 0.65;
        const baseHue = colors[p.idx];
        const hue = (baseHue + Math.sin(time * 0.8 + p.idx * 0.02) * 15 + 360) % 360;
        const sat = 65 + depth * 25;
        const light = 35 + depth * 40;
        const alpha = 0.06 + depth * 0.65;
        const specular = Math.max(0, p.x * 0.4 - p.y * 0.5 + p.z * 0.6);
        const specBoost = specular > 0.4 ? (specular - 0.4) * 0.8 : 0;
        const finalLight = Math.min(90, light + specBoost * 40);
        const finalAlpha = Math.min(1, alpha + specBoost * 0.3);
        const finalRadius = dotRadius * (1 + specBoost * 0.3);

        if (specBoost > 0.1) {
          ctx!.beginPath();
          ctx!.arc(screenX, screenY, finalRadius * 3, 0, Math.PI * 2);
          ctx!.fillStyle = `hsla(${hue},${sat}%,${finalLight}%,${specBoost * 0.1})`;
          ctx!.fill();
        }

        ctx!.beginPath();
        ctx!.arc(screenX, screenY, finalRadius, 0, Math.PI * 2);
        ctx!.fillStyle = `hsla(${hue},${sat}%,${finalLight}%,${finalAlpha})`;
        ctx!.fill();
      }

      animId = requestAnimationFrame(render);
    }

    render();
    return () => {
      cancelAnimationFrame(animId);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseenter", handleMouseEnter);
      canvas.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [size, handleMouseMove, handleMouseEnter, handleMouseLeave]);

  return <canvas ref={canvasRef} style={{ width: size, height: size, cursor: "grab" }} />;
}

/* ── Orbiting glass icon ── */
function OrbitIcon({
  agent,
  index,
  total,
  radius,
  containerSize,
}: {
  agent: (typeof agents)[number];
  index: number;
  total: number;
  radius: number;
  containerSize: number;
}) {
  const [hovered, setHovered] = useState(false);
  const { x, y, isTop } = getOrbitPos(index, total, radius);
  const Icon = agent.icon;

  // Center of container + offset, minus half icon size (24px ~ w-12/2)
  const iconHalf = 22;
  const left = containerSize / 2 + x - iconHalf;
  const top = containerSize / 2 + y - iconHalf;

  // Tooltip: position to the side on mobile to avoid overflow
  const isLeftSide = x < -radius * 0.3;
  const isRightSide = x > radius * 0.3;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, delay: 1 + index * 0.12, ease }}
      className="absolute"
      style={{ left, top, width: iconHalf * 2, height: iconHalf * 2 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => setHovered((h) => !h)}
    >
      <motion.div
        whileHover={{ scale: 1.15 }}
        className="flex items-center justify-center w-full h-full rounded-full cursor-pointer"
        style={{
          background: "rgba(255,255,255,0.06)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          border: "1px solid rgba(255,255,255,0.1)",
          boxShadow: "0 4px 20px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.08)",
        }}
      >
        <Icon size={16} className="text-white/60" />
      </motion.div>

      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0, y: isTop ? -4 : 4, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: isTop ? -4 : 4, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute z-50 w-44 px-3 py-2.5 rounded-xl pointer-events-none"
            style={{
              top: isTop ? "calc(100% + 8px)" : undefined,
              bottom: !isTop ? "calc(100% + 8px)" : undefined,
              // Clamp horizontally: left-side icons push tooltip right, right-side push left
              ...(isLeftSide
                ? { left: 0 }
                : isRightSide
                  ? { right: 0 }
                  : { left: "50%", marginLeft: -88 }),
              background: "rgba(255,255,255,0.07)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              border: "1px solid rgba(255,255,255,0.1)",
              boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
            }}
          >
            <p className="text-[10px] font-semibold text-white/70 mb-1 tracking-wide uppercase">
              {agent.label}
            </p>
            <p className="text-[10px] leading-relaxed text-white/40">
              {agent.desc}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ── Sphere + orbits section ── */
function SphereSection({ sphereSize, orbitRadius, containerSize }: { sphereSize: number; orbitRadius: number; containerSize: number }) {
  const sphereOffset = (containerSize - sphereSize) / 2;

  return (
    <div className="relative" style={{ width: containerSize, height: containerSize }}>
      {/* Sphere canvas */}
      <div className="absolute" style={{ left: sphereOffset, top: sphereOffset }}>
        <DotSphere size={sphereSize} />
      </div>

      {/* Orbit icons */}
      {agents.map((agent, i) => (
        <OrbitIcon key={agent.label} agent={agent} index={i} total={agents.length} radius={orbitRadius} containerSize={containerSize} />
      ))}

      {/* Center title */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6, ease }}
        >
          <span
            className="inline-flex items-center gap-2 text-[8px] md:text-[9px] font-mono uppercase tracking-[0.2em] px-2.5 py-1 md:px-3 md:py-1.5 rounded-full mb-4 md:mb-5"
            style={{
              border: "1px solid rgba(255,255,255,0.12)",
              color: "rgba(255,255,255,0.4)",
              background: "rgba(255,255,255,0.03)",
              backdropFilter: "blur(8px)",
            }}
          >
            <Sparkles size={9} />
            Coming soon
          </span>
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.8, ease }}
          className="text-center leading-none"
        >
          <span className="text-[1.5rem] md:text-[2.8rem] font-semibold tracking-[-0.03em] text-white/90">
            Gavroch
          </span>
          <span className="text-[1.5rem] md:text-[2.8rem] font-light tracking-[-0.01em] text-white/50">
            .Agent
          </span>
        </motion.h1>
      </div>
    </div>
  );
}

export default function AgentPage() {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [hovering, setHovering] = useState(false);

  useEffect(() => {
    const move = (e: MouseEvent) => setPos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", move);

    const addListeners = () => {
      document.querySelectorAll("[data-hover], a, button").forEach((el) => {
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

      <div className="relative min-h-screen bg-[#050505] text-[#fafafa] overflow-hidden" style={{ cursor: "none" }}>
        {/* Subtle radial glow */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{ background: "radial-gradient(ellipse 60% 50% at 50% 40%, rgba(255,255,255,0.03) 0%, transparent 70%)" }}
        />

        {/* Grain overlay */}
        <div
          className="pointer-events-none fixed inset-0 z-50 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            backgroundRepeat: "repeat",
            backgroundSize: "128px 128px",
          }}
        />

        {/* Back button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease }}
          className="fixed top-6 left-6 md:top-10 md:left-10 z-40"
        >
          <Link
            href="/"
            className="flex items-center gap-2 text-[12px] uppercase tracking-[0.15em] text-white/30 hover:text-white/70 transition-colors duration-300"
          >
            <ArrowLeft size={14} />
            Back
          </Link>
        </motion.div>

        {/* Main content */}
        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 pb-20">

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5, delay: 0.2, ease }}
          >
            {/* Mobile */}
            <div className="block md:hidden">
              <SphereSection sphereSize={240} orbitRadius={145} containerSize={340} />
            </div>
            {/* Desktop */}
            <div className="hidden md:block">
              <SphereSection sphereSize={440} orbitRadius={270} containerSize={620} />
            </div>
          </motion.div>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1, ease }}
            className="mt-2 text-center text-[0.9rem] md:text-[1.05rem] leading-relaxed text-white/25 max-w-[480px]"
          >
            Autonomous AI agents, built for your business.
            <br />
            Automate. Delegate. Scale.
          </motion.p>

          {/* Separator line */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.2, delay: 1.2, ease }}
            className="mt-6 md:mt-8 h-[1px] w-20 origin-center"
            style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)" }}
          />

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.4, ease }}
            className="mt-6 md:mt-8"
          >
            <Link
              href="/#contact"
              className="inline-flex items-center gap-3 px-7 py-3 rounded-full text-[11px] uppercase tracking-[0.15em] font-medium transition-all duration-400"
              style={{ border: "1px solid rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.5)" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.3)";
                e.currentTarget.style.color = "rgba(255,255,255,0.8)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)";
                e.currentTarget.style.color = "rgba(255,255,255,0.5)";
              }}
            >
              Get in touch
            </Link>
          </motion.div>

          {/* Bottom hint */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.8 }}
            className="absolute bottom-8 text-[10px] font-mono uppercase tracking-[0.2em] text-white/10"
          >
            Bespoke artificial intelligence
          </motion.p>
        </div>
      </div>
    </>
  );
}
