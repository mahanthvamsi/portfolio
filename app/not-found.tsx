"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Globe3D, GlobeMarker } from "@/components/3d-globe";
import { Spotlight } from "@/components/ui/Spotlight";
import MagicButton from "@/components/ui/MagicButton";
import { MdHome } from "react-icons/md";
import { cn } from "@/utils/cn";

// ── markers ──────────────────────────────────────────────────────────────────
// ── markers (Global Server Nodes) ─────────────────────────────────────────────
const markers: GlobeMarker[] = [
  // Your actual location / HQ
  { lat: 53.3498, lng: -6.2603, src: "/icons/hq.svg", label: "eu-west-1 (Ireland HQ)" },

  // Major global data centers
  { lat: 39.0438, lng: -77.4874, src: "/icons/server.svg", label: "us-east-1 (N. Virginia)" },
  { lat: 37.7749, lng: -122.4194, src: "/icons/server.svg", label: "us-west-1 (N. California)" },
  { lat: 35.6762, lng: 139.6503, src: "/icons/server.svg", label: "ap-northeast-1 (Tokyo)" },
  { lat: -33.8688, lng: 151.2093, src: "/icons/server.svg", label: "ap-southeast-2 (Sydney)" },
  { lat: 1.3521, lng: 103.8198, src: "/icons/server.svg", label: "ap-southeast-1 (Singapore)" },
  { lat: 50.1109, lng: 8.6821, src: "/icons/server.svg", label: "eu-central-1 (Frankfurt)" },
  { lat: -23.5505, lng: -46.6333, src: "/icons/server.svg", label: "sa-east-1 (São Paulo)" },
  { lat: 19.0760, lng: 72.8777, src: "/icons/server.svg", label: "ap-south-1 (Mumbai)" },
];

// ── fun quips that cycle ──────────────────────────────────────────────────────
const QUIPS = [
  "This page is empty, but my calendar for Backend interviews is wide open.",
  "Route not found. Rerouting your browser to my 'Hire Me' button...",
  "404: Page missing. Unlike my availability for Fullstack roles.",
  "I couldn't find this URL, but you can find me in Ireland (or remote).",
  "This server is lost. Let’s build a better one together.",
  "You broke the route. Hire me to fix it.",
  "Currently searching the globe for this page... and my next SDE role.",
];

// ── glitchy 404 digits ────────────────────────────────────────────────────────
const GlitchChar = ({ char, delay }: { char: string; delay: number }) => {
  const [glitching, setGlitching] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setGlitching(true);
      setTimeout(() => setGlitching(false), 150);
    }, 2000 + delay * 800);
    return () => clearInterval(interval);
  }, [delay]);

  return (
    <span
      className="relative inline-block select-none"
      style={{ fontFamily: "'Impact', 'Arial Black', sans-serif" }}
    >
      <span
        className={cn(
          "transition-all duration-75",
          glitching ? "opacity-0" : "opacity-100"
        )}
      >
        {char}
      </span>
      {glitching && (
        <>
          <span
            className="absolute inset-0 text-purple-400"
            style={{ clipPath: "inset(30% 0 50% 0)", transform: "translateX(-4px)" }}
          >
            {char}
          </span>
          <span
            className="absolute inset-0 text-blue-400"
            style={{ clipPath: "inset(60% 0 0 0)", transform: "translateX(4px)" }}
          >
            {char}
          </span>
        </>
      )}
    </span>
  );
};

// ── hovering city toast ───────────────────────────────────────────────────────
const CityToast = ({ city }: { city: string | null }) => (
  <AnimatePresence>
    {city && (
      <motion.div
        key={city}
        initial={{ opacity: 0, y: 8, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -8, scale: 0.9 }}
        transition={{ duration: 0.2 }}
        className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 px-4 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur-md text-white/90 text-sm font-light tracking-wide whitespace-nowrap"
      >
        📡 Ping {city} ... [404 NOT FOUND]
      </motion.div>
    )}
  </AnimatePresence>
);

// ── main page ─────────────────────────────────────────────────────────────────
export default function NotFound() {
  const [quipIndex, setQuipIndex] = useState(0);
  const [hoveredCity, setHoveredCity] = useState<string | null>(null);
  const [clickCount, setClickCount] = useState(0);

  // cycle quips every 3.5 s
  useEffect(() => {
    const t = setInterval(() => {
      setQuipIndex((i) => (i + 1) % QUIPS.length);
    }, 3500);
    return () => clearInterval(t);
  }, []);

  const handleMarkerClick = (marker: GlobeMarker) => {
    setClickCount((c) => c + 1);
  };

  return (
    <main className="relative min-h-screen bg-black-100 flex items-center justify-center overflow-hidden">
      {/* ── grid background ── */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]" />
        <div className="absolute pointer-events-none inset-0 bg-black-100 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
      </div>

      {/* ── spotlights ── */}
      <div className="absolute inset-0 pointer-events-none">
        <Spotlight className="absolute -top-40 -left-10 md:-left-32 md:-top-20 h-screen w-screen" fill="white" />
        <Spotlight className="absolute top-0 left-1/2 h-screen w-screen" fill="purple" />
        <Spotlight className="absolute top-0 right-0 h-screen w-screen" fill="blue" />
      </div>

      {/* ── layout ── */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 flex flex-col lg:flex-row items-center justify-between gap-12 py-20">

        {/* ── LEFT: text block ── */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left"
        >
          {/* glitchy 404 */}
          <h1
            className="text-[10rem] md:text-[14rem] font-black leading-none mb-4"
            style={{ color: "white", letterSpacing: "-0.02em" }}
          >
            {"404".split("").map((c, i) => (
              <GlitchChar key={i} char={c} delay={i} />
            ))}
          </h1>

          {/* sub-heading */}
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-2xl md:text-3xl font-light mb-6"
            style={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Page Not Found
          </motion.h2>

          {/* cycling quip */}
          <div className="h-12 mb-8 flex items-center">
            <AnimatePresence mode="wait">
              <motion.p
                key={quipIndex}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.4 }}
                className="text-white/60 text-base md:text-lg font-light max-w-sm"
              >
                {QUIPS[quipIndex]}
              </motion.p>
            </AnimatePresence>
          </div>

          {/* globe interaction counter easter egg */}
          <AnimatePresence>
            {clickCount > 0 && (
              <motion.p
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="text-white/30 text-xs mb-6 font-mono tracking-widest"
              >
                {clickCount === 1
                  ? "Nice click. Still 404 though."
                  : clickCount < 5
                  ? `${clickCount} cities checked. Still nothing.`
                  : clickCount < 10
                  ? `You've clicked ${clickCount} cities. You're dedicated.`
                  : `${clickCount} clicks deep. The page doesn't exist on ANY continent.`}
              </motion.p>
            )}
          </AnimatePresence>

          {/* skill pills */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="flex flex-wrap gap-2 mb-10 justify-center lg:justify-start"
          >
            {["Lost in Space", "HTTP 404", "Route Missing", "URL Vanished"].map((tag, i) => (
              <span
                key={tag}
                className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/50 text-xs font-light"
              >
                {tag}
              </span>
            ))}
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, duration: 0.4 }}
          >
            <Link href="/">
              <MagicButton
                title="Back to Home"
                icon={<MdHome />}
                position="right"
              />
            </Link>
          </motion.div>
        </motion.div>

        {/* ── RIGHT: globe ── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, ease: "easeOut", delay: 0.2 }}
          className="flex-1 relative flex items-center justify-center w-full max-w-lg lg:max-w-none"
          style={{ minHeight: 420 }}
        >
          {/* glow ring behind globe */}
          <div
            className="absolute inset-0 rounded-full pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse at center, rgba(102,126,234,0.15) 0%, transparent 70%)",
            }}
          />

          {/* label above globe */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.6 }}
            className="absolute -top-2 left-1/2 -translate-x-1/2 text-white/30 text-xs tracking-[0.3em] uppercase font-light whitespace-nowrap z-10"
          >
            Searching the entire planet…
          </motion.p>

          {/* globe wrapper */}
          <div className="relative w-full" style={{ aspectRatio: "1/1" }}>
            <Globe3D
              markers={markers}
              config={{
                atmosphereColor: "#4da6ff",
                atmosphereIntensity: 20,
                bumpScale: 5,
                autoRotateSpeed: 0.4,
              }}
              onMarkerClick={handleMarkerClick}
              onMarkerHover={(marker) =>
                setHoveredCity(marker?.label ?? null)
              }
            />
            <CityToast city={hoveredCity} />
          </div>

          {/* hint text */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4, duration: 0.6 }}
            className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-white/20 text-xs tracking-widest uppercase font-light whitespace-nowrap"
          >
            Click a city ↑
          </motion.p>
        </motion.div>
      </div>

      {/* ── bottom scroll line (mirrors hero) ── */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-20">
        <span className="text-white text-xs tracking-widest uppercase">404</span>
        <div className="w-[1px] h-10 bg-gradient-to-b from-white to-transparent" />
      </div>
    </main>
  );
}