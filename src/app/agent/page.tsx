"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Sparkles, Mail, Share2, Calendar, FileText, Headphones, BarChart3 } from "lucide-react";
import { useEffect, useRef, useCallback, useState } from "react";

const ease = [0.16, 1, 0.3, 1] as const;

/* ── Agent orbit items ── */
const agents = [
  { icon: Mail, label: "Agent Mail", desc: "Rédige et envoie vos emails automatiquement, relances incluses." },
  { icon: Share2, label: "Agent Réseaux", desc: "Publie, planifie et engage sur vos réseaux sociaux." },
  { icon: Calendar, label: "Agent Planning", desc: "Gère votre agenda, prend vos rendez-vous, optimise votre temps." },
  { icon: FileText, label: "Agent Contenu", desc: "Génère articles, fiches produit et contenus SEO à la volée." },
  { icon: Headphones, label: "Agent Support", desc: "Répond à vos clients 24/7 avec intelligence et empathie." },
  { icon: BarChart3, label: "Agent Data", desc: "Analyse vos données et génère des rapports actionnables." },
];

/* ── Interactive 3D dot sphere on <canvas> ── */
function DotSphere({ size = 500 }: { size?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouse = useRef({ x: 0, y: 0, active: false });
  const rotation = useRef({ x: 0.35, y: 0 });
  const velocity = useRef({ x: 0, y: 0 });

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      mouse.current.x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      mouse.current.y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    },
    []
  );

  const handleMouseEnter = useCallback(() => {
    mouse.current.active = true;
  }, []);

  const handleMouseLeave = useCallback(() => {
    mouse.current.active = false;
  }, []);

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

    // Single clean sphere — fibonacci distribution
    const numPoints = 900;
    const goldenAngle = Math.PI * (3 - Math.sqrt(5));
    const points: [number, number, number][] = [];

    for (let i = 0; i < numPoints; i++) {
      const y = 1 - (i / (numPoints - 1)) * 2;
      const r = Math.sqrt(1 - y * y);
      const theta = goldenAngle * i;
      points.push([Math.cos(theta) * r, y, Math.sin(theta) * r]);
    }

    // Color palette in batches: red, rose/pink, electric blue — no green, no orange
    // Assign colors in chunks of ~20 points for batch effect
    const hues = [350, 330, 210, 280, 340, 200]; // red, rose, electric blue, purple, pink, blue
    const batchSize = 18;
    const colors = points.map((_, i) => {
      const batch = Math.floor(i / batchSize);
      return hues[batch % hues.length];
    });

    const sphereRadius = size * 0.36;
    let time = 0;
    let animId: number;

    function render() {
      ctx!.clearRect(0, 0, size, size);
      const cx = size / 2;
      const cy = size / 2;
      time += 0.012;

      // Mouse-driven rotation with inertia
      if (mouse.current.active) {
        const targetVx = mouse.current.y * 0.02;
        const targetVy = mouse.current.x * 0.02;
        velocity.current.x += (targetVx - velocity.current.x) * 0.08;
        velocity.current.y += (targetVy - velocity.current.y) * 0.08;
      } else {
        velocity.current.x += (0.001 - velocity.current.x) * 0.02;
        velocity.current.y += (0.003 - velocity.current.y) * 0.02;
      }

      rotation.current.x += velocity.current.x;
      rotation.current.y += velocity.current.y;

      const cosY = Math.cos(rotation.current.y);
      const sinY = Math.sin(rotation.current.y);
      const cosX = Math.cos(rotation.current.x);
      const sinX = Math.sin(rotation.current.x);

      // Project all points
      const projected = points.map(([px, py, pz], i) => {
        const x1 = px * cosY - pz * sinY;
        const z1 = px * sinY + pz * cosY;
        const y1 = py * cosX - z1 * sinX;
        const z2 = py * sinX + z1 * cosX;
        return { x: x1, y: y1, z: z2, idx: i };
      });

      // Sort by z for depth
      projected.sort((a, b) => a.z - b.z);

      for (const p of projected) {
        const depth = (p.z + 1) / 2; // 0 (back) → 1 (front)
        const screenX = cx + p.x * sphereRadius;
        const screenY = cy + p.y * sphereRadius;

        // Dot size: very small
        const dotRadius = 0.35 + depth * 0.65;

        // Slow hue drift within batch color range
        const baseHue = colors[p.idx];
        const hue = (baseHue + Math.sin(time * 0.8 + p.idx * 0.02) * 15 + 360) % 360;

        // Saturation & lightness by depth
        const sat = 65 + depth * 25;
        const light = 35 + depth * 40;
        const alpha = 0.06 + depth * 0.65;

        // Specular highlight (top-right light)
        const specular = Math.max(0, p.x * 0.4 - p.y * 0.5 + p.z * 0.6);
        const specBoost = specular > 0.4 ? (specular - 0.4) * 0.8 : 0;

        const finalLight = Math.min(90, light + specBoost * 40);
        const finalAlpha = Math.min(1, alpha + specBoost * 0.3);
        const finalRadius = dotRadius * (1 + specBoost * 0.3);

        // Glow on bright front-facing dots
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

  return (
    <canvas
      ref={canvasRef}
      style={{ width: size, height: size, cursor: "grab" }}
    />
  );
}

/* ── Orbiting glass icon ── */
function OrbitIcon({
  agent,
  index,
  total,
  radius,
}: {
  agent: (typeof agents)[number];
  index: number;
  total: number;
  radius: number;
}) {
  const [hovered, setHovered] = useState(false);
  // Spread icons over a 240° arc centered on top, leaving bottom clear for text
  const arcSpan = 240;
  const angle = -90 - arcSpan / 2 + (index / (total - 1)) * arcSpan;
  const rad = (angle * Math.PI) / 180;
  const x = Math.cos(rad) * radius;
  const y = Math.sin(rad) * radius;
  const Icon = agent.icon;

  // Tooltip direction: show below for top-half icons, above for bottom-half
  const tooltipBelow = y < 0;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, delay: 1 + index * 0.12, ease }}
      className="absolute"
      style={{
        left: `${270 + x}px`,
        top: `${270 + y}px`,
        transform: "translate(-50%, -50%)",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <motion.div
        whileHover={{ scale: 1.15 }}
        className="relative flex items-center justify-center w-11 h-11 md:w-12 md:h-12 rounded-full cursor-pointer"
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

      {/* Tooltip on hover */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0, y: tooltipBelow ? -4 : 4, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: tooltipBelow ? -4 : 4, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute z-50 w-48 px-3.5 py-2.5 rounded-xl pointer-events-none"
            style={{
              top: tooltipBelow ? "calc(100% + 10px)" : undefined,
              bottom: !tooltipBelow ? "calc(100% + 10px)" : undefined,
              left: "50%",
              transform: "translateX(-50%)",
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

export default function AgentPage() {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [hovering, setHovering] = useState(false);

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

    <div className="relative min-h-screen bg-[#050505] text-[#fafafa] overflow-hidden" style={{ cursor: "none" }}>
      {/* Subtle radial glow */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 40%, rgba(255,255,255,0.03) 0%, transparent 70%)",
        }}
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
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 pb-20">

        {/* Sphere + orbit icons + centered text */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, delay: 0.2, ease }}
          className="relative"
          style={{ width: 540, height: 540 }}
        >
          {/* 3D Dot Sphere — absolutely centered */}
          <div
            className="absolute"
            style={{ left: 270, top: 270, transform: "translate(-50%, -50%)" }}
          >
            <div className="hidden md:block">
              <DotSphere size={360} />
            </div>
            <div className="block md:hidden">
              <DotSphere size={240} />
            </div>
          </div>

          {/* Orbiting glassmorphism icons */}
          {agents.map((agent, i) => (
            <OrbitIcon key={agent.label} agent={agent} index={i} total={agents.length} radius={230} />
          ))}

          {/* Title overlaid at center */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6, ease }}
            >
              <span
                className="inline-flex items-center gap-2 text-[9px] font-mono uppercase tracking-[0.2em] px-3 py-1.5 rounded-full mb-5"
                style={{
                  border: "1px solid rgba(255,255,255,0.12)",
                  color: "rgba(255,255,255,0.4)",
                  background: "rgba(255,255,255,0.03)",
                  backdropFilter: "blur(8px)",
                }}
              >
                <Sparkles size={10} />
                Coming soon
              </span>
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.8, ease }}
              className="text-center leading-none"
            >
              <span className="text-[clamp(1.4rem,4.5vw,2.8rem)] font-semibold tracking-[-0.03em] text-white/90">
                Gavroch
              </span>
              <span className="text-[clamp(1.4rem,4.5vw,2.8rem)] font-light tracking-[-0.01em] text-white/50">
                .Agent
              </span>
            </motion.h1>
          </div>
        </motion.div>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1, ease }}
          className="-mt-2 text-center text-[clamp(0.85rem,1.8vw,1.05rem)] leading-relaxed text-white/25 max-w-[480px]"
        >
          Des agents IA autonomes, pensés pour votre business.
          <br />
          Automatisez. Déléguez. Scalez.
        </motion.p>

        {/* Separator line */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.2, delay: 1.2, ease }}
          className="mt-8 h-[1px] w-20 origin-center"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)",
          }}
        />

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.4, ease }}
          className="mt-8"
        >
          <Link
            href="/#contact"
            className="inline-flex items-center gap-3 px-7 py-3 rounded-full text-[11px] uppercase tracking-[0.15em] font-medium transition-all duration-400"
            style={{
              border: "1px solid rgba(255,255,255,0.12)",
              color: "rgba(255,255,255,0.5)",
            }}
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
            Nous contacter
          </Link>
        </motion.div>


        {/* Bottom hint */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.8 }}
          className="absolute bottom-8 text-[10px] font-mono uppercase tracking-[0.2em] text-white/10"
        >
          Intelligence artificielle sur mesure
        </motion.p>
      </div>
    </div>
    </>
  );
}
