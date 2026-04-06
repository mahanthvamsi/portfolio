"use client";
import React, { useState, useEffect, useRef, useId } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { projects, sortedProjects, Project } from "@/data";

// ─────────────────────────────────────────────────────────────────────────────
// Shared helpers (used by both views)
// ─────────────────────────────────────────────────────────────────────────────
type ViewMode  = "visual" | "engineer";
type DetailTab = "metrics" | "headers" | "response" | "architecture" | "preview";

const TYPE_ACCENT: Record<string, string> = {
  ml: "#a78bfa", fullstack: "#34d399", backend: "#60a5fa", research: "#fb923c",
};
const TYPE_RGB: Record<string, string> = {
  ml: "167,139,250", fullstack: "52,211,153", backend: "96,165,250", research: "251,146,60",
};
const SOURCE_META: Record<string, { label: string; color: string; bg: string; border: string }> = {
  internship: { label: "INTERNSHIP", color: "#fbbf24", bg: "rgba(251,191,36,0.10)",  border: "rgba(251,191,36,0.25)"  },
  production: { label: "PRODUCTION", color: "#34d399", bg: "rgba(52,211,153,0.10)",  border: "rgba(52,211,153,0.25)"  },
  personal:   { label: "PERSONAL",   color: "#a78bfa", bg: "rgba(167,139,250,0.10)", border: "rgba(167,139,250,0.25)" },
};
const METHOD_META: Record<string, { bg: string; text: string; border: string }> = {
  GET:    { bg: "rgba(59,130,246,0.12)",  text: "#60a5fa", border: "rgba(59,130,246,0.28)"  },
  POST:   { bg: "rgba(16,185,129,0.12)",  text: "#34d399", border: "rgba(16,185,129,0.28)"  },
  PUT:    { bg: "rgba(245,158,11,0.12)",  text: "#fbbf24", border: "rgba(245,158,11,0.28)"  },
  DELETE: { bg: "rgba(248,113,113,0.12)", text: "#f87171", border: "rgba(248,113,113,0.28)" },
};

const typeAccent  = (t: string) => TYPE_ACCENT[t]  ?? "#cbacf9";
const typeRGB     = (t: string) => TYPE_RGB[t]      ?? "203,172,249";
const statusColor = (s: number) => s >= 200 && s < 300 ? "#4ade80" : s < 400 ? "#facc15" : "#f87171";
const fmt         = (ms: number) => `${ms}ms`;

// ─────────────────────────────────────────────────────────────────────────────
// ██  MODE TOGGLE
// ─────────────────────────────────────────────────────────────────────────────
function ModeToggle({ mode, onChange }: { mode: ViewMode; onChange: (m: ViewMode) => void }) {
  return (
    <div
      className="inline-flex items-center p-1 rounded-2xl gap-1"
      style={{
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.08)",
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.04)",
      }}
    >
      {([
        {
          id: "visual" as ViewMode,
          label: "Visual",
          icon: (
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path d="M4 6h16M4 10h16M4 14h10M4 18h6" strokeLinecap="round"/>
            </svg>
          ),
        },
        {
          id: "engineer" as ViewMode,
          label: "Engineer",
          icon: (
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>
            </svg>
          ),
        },
      ]).map(({ id, label, icon }) => {
        const active = mode === id;
        return (
          <button
            key={id}
            onClick={() => onChange(id)}
            className="relative flex items-center gap-2 px-5 py-2.5 rounded-xl text-[11.5px] font-semibold transition-colors duration-200"
            style={{ color: active ? "#fff" : "#4a5270", fontFamily: "monospace" }}
          >
            {active && (
              <motion.div
                layoutId="toggle-pill"
                className="absolute inset-0 rounded-xl"
                style={{
                  background: id === "visual"
                    ? "linear-gradient(135deg,rgba(167,139,250,0.25),rgba(203,172,249,0.12))"
                    : "linear-gradient(135deg,rgba(96,165,250,0.22),rgba(52,211,153,0.08))",
                  border: `1px solid ${id === "visual" ? "rgba(167,139,250,0.3)" : "rgba(96,165,250,0.3)"}`,
                  boxShadow: `0 2px 16px ${id === "visual" ? "rgba(167,139,250,0.15)" : "rgba(96,165,250,0.15)"}`,
                }}
                transition={{ type: "spring", stiffness: 480, damping: 32 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-2">{icon}{label}</span>
          </button>
        );
      })}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ██  VISUAL VIEW - Aceternity-style expandable cards
//     Desktop : click → shared layout expand, backdrop blur, navbar hidden
//     Mobile  : always fully expanded, no interaction needed
// ─────────────────────────────────────────────────────────────────────────────

function ExpandedCard({
  project,
  onClose,
  layoutId,
}: {
  project: Project;
  onClose: () => void;
  layoutId: string;
}) {
  const accent = typeAccent(project.type);
  const rgb    = typeRGB(project.type);
  const src    = SOURCE_META[project.source] ?? SOURCE_META.personal;
  const ref    = useRef<HTMLDivElement>(null);

  // Hide navbar while expanded
  useEffect(() => {
    const navbar = document.querySelector("nav") as HTMLElement | null;
    if (navbar) navbar.style.display = "none";
    return () => {
      if (navbar) navbar.style.display = "";
    };
  }, []);

  // Outside click → close
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  // Escape → close
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-40"
        style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(6px)" }}
      />

      {/* Expanded card */}
      <div className="fixed inset-0 z-50 grid place-items-center p-4">
        <motion.div
          layoutId={layoutId}
          ref={ref}
          className="relative w-full max-w-lg flex flex-col overflow-hidden"
          style={{
            background: "rgb(10,11,20)",
            borderRadius: 24,
            border: `1px solid rgba(${rgb},0.35)`,
            boxShadow: `0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(${rgb},0.1)`,
            maxHeight: "90vh",
          }}
        >
          {/* Close */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.05 } }}
            onClick={onClose}
            className="absolute top-3 right-3 z-10 flex items-center justify-center w-7 h-7 rounded-full"
            style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)" }}
          >
            <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </motion.button>

          {/* Image */}
          <motion.div layoutId={`img-${layoutId}`} className="relative h-64 flex-shrink-0 overflow-hidden">
            {project.image ? (
              <img src={project.image} alt={project.title}
                className="w-full h-full object-cover object-top" />
            ) : (
              <div className="w-full h-full" style={{
                background: `
                  radial-gradient(ellipse at 20% 50%, rgba(${rgb},0.3) 0%, transparent 60%),
                  radial-gradient(ellipse at 80% 20%, rgba(${rgb},0.18) 0%, transparent 50%),
                  linear-gradient(135deg, #0d0e1f 0%, #0a0b14 100%)`,
              }}>
                <svg className="absolute inset-0 w-full h-full opacity-[0.07]" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <pattern id={`egrid-${project.id}`} width="32" height="32" patternUnits="userSpaceOnUse">
                      <path d="M 32 0 L 0 0 0 32" fill="none" stroke="white" strokeWidth="0.5"/>
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill={`url(#egrid-${project.id})`}/>
                </svg>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full blur-3xl"
                  style={{ background: `rgba(${rgb},0.5)` }}/>
              </div>
            )}
            <div className="absolute inset-0 pointer-events-none"
              style={{ background: "linear-gradient(to top, rgba(10,11,20,0.85) 0%, transparent 50%)" }}/>
            <div className="absolute top-4 left-4 flex gap-2">
              <span className="px-2.5 py-1 rounded-lg text-[9px] font-bold tracking-widest uppercase backdrop-blur-md border"
                style={{ color: accent, background: `rgba(${rgb},0.12)`, borderColor: `rgba(${rgb},0.25)` }}>
                {project.type}
              </span>
              <span className="px-2.5 py-1 rounded-lg text-[9px] font-bold tracking-widest uppercase backdrop-blur-md border"
                style={{ color: src.color, background: src.bg, borderColor: src.border }}>
                {src.label}
              </span>
            </div>
          </motion.div>

          {/* Scrollable content */}
          <div className="overflow-y-auto flex-1" style={{ scrollbarWidth: "none" }}>
            <div className="p-6 flex flex-col gap-5">

              {/* Title + links */}
              <div className="flex items-start justify-between gap-4">
                <motion.h3 layoutId={`title-${layoutId}`}
                  className="text-2xl font-bold text-white leading-tight">
                  {project.title}
                </motion.h3>
                <div className="flex gap-3 flex-shrink-0 mt-1">
                  {project.github && (
                    <a href={project.github} target="_blank" rel="noreferrer"
                      className="text-slate-500 hover:text-white transition-colors">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.2 11.38.6.1.82-.26.82-.58v-2.03c-3.34.72-4.04-1.61-4.04-1.61-.54-1.38-1.33-1.74-1.33-1.74-1.09-.74.08-.73.08-.73 1.2.08 1.84 1.24 1.84 1.24 1.07 1.83 2.8 1.3 3.48 1 .1-.78.42-1.3.76-1.6-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.52.12-3.17 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 3-.4c1.02 0 2.04.13 3 .4 2.28-1.55 3.3-1.23 3.3-1.23.66 1.65.24 2.87.12 3.17.77.84 1.24 1.91 1.24 3.22 0 4.61-2.8 5.63-5.48 5.92.43.37.81 1.1.81 2.22v3.29c0 .32.22.7.83.58A12 12 0 0 0 24 12C24 5.37 18.63 0 12 0z"/>
                      </svg>
                    </a>
                  )}
                  {project.live && (
                    <a href={project.live} target="_blank" rel="noreferrer"
                      className="text-slate-500 hover:text-[#34d399] transition-colors">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path d="M10 6H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-4M14 4h6m0 0v6m0-6L10 14"/>
                      </svg>
                    </a>
                  )}
                  {project.paper && (
                    <a href={project.paper} target="_blank" rel="noreferrer"
                      className="text-slate-500 hover:text-[#fb923c] transition-colors">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5.586a1 1 0 0 1 .707.293l5.414 5.414a1 1 0 0 1 .293.707V19a2 2 0 0 1-2 2z"/>
                      </svg>
                    </a>
                  )}
                </div>
              </div>

              {/* Full summary */}
              <p className="text-sm text-slate-400 leading-relaxed">{project.summary}</p>

              {/* All metrics */}
              <div className="grid grid-cols-3 gap-2">
                {project.metrics.map((m, mi) => (
                  <motion.div key={m.label}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: mi * 0.05 }}
                    className="flex flex-col px-3 py-2 rounded-xl border"
                    style={{ background: `rgba(${rgb},0.07)`, borderColor: `rgba(${rgb},0.2)` }}>
                    <span className="text-[9px] font-mono text-slate-500 uppercase tracking-tight leading-tight">{m.label}</span>
                    <span className="text-[13px] font-bold font-mono leading-none mt-1" style={{ color: accent }}>{m.value}</span>
                  </motion.div>
                ))}
              </div>

              {/* Full stack */}
              <div className="flex flex-wrap gap-1.5">
                {project.stack.map((s) => (
                  <span key={s}
                    className="px-2.5 py-0.5 rounded-md text-[10px] font-mono text-slate-400"
                    style={{ background: "rgba(255,255,255,0.04)", border: `1px solid rgba(${rgb},0.14)` }}>
                    {s}
                  </span>
                ))}
              </div>

              {/* Status */}
              <div className="flex items-center gap-2 text-[10px] font-mono font-bold" style={{ color: accent }}>
                <span className="relative flex items-center justify-center w-3 h-3">
                  <motion.span className="absolute rounded-full"
                    style={{ background: accent, width: "100%", height: "100%" }}
                    animate={{ scale: [1, 2.2, 1], opacity: [0.7, 0, 0.7] }}
                    transition={{ duration: 2.4, repeat: Infinity, ease: "easeOut" }}/>
                  <span className="relative w-1.5 h-1.5 rounded-full" style={{ background: accent }}/>
                </span>
                {project.status} {project.statusText} · {project.durationMs}ms
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
}

function VisualCard({ project, index }: { project: Project; index: number }) {
  const accent   = typeAccent(project.type);
  const rgb      = typeRGB(project.type);
  const src      = SOURCE_META[project.source] ?? SOURCE_META.personal;
  const uid      = useId();
  const layoutId = `card-${project.id}-${uid}`;
  const [active, setActive] = useState(false);

  // Lock body scroll when expanded
  useEffect(() => {
    document.body.style.overflow = active ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [active]);

  return (
    <>
      <AnimatePresence>
        {active && (
          <ExpandedCard
            project={project}
            layoutId={layoutId}
            onClose={() => setActive(false)}
          />
        )}
      </AnimatePresence>

      <motion.div
        layoutId={active ? undefined : layoutId}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        onClick={() => setActive(true)}
        className="group relative flex flex-col rounded-3xl overflow-hidden bg-[#0a0b14] border border-white/[0.05] hover:border-white/[0.12] transition-all duration-500 md:cursor-pointer"
        style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.4)" }}
      >
        {/* Hover glow border - desktop only */}
        <div className="absolute inset-0 rounded-3xl pointer-events-none z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 hidden md:block"
          style={{ boxShadow: `inset 0 0 0 1px rgba(${rgb},0.4), 0 16px 48px rgba(${rgb},0.1)` }}/>

        {/* Image */}
        <div className="relative h-48 overflow-hidden flex-shrink-0">
          <motion.div layoutId={`img-${layoutId}`}
            className="absolute inset-0 transition-transform duration-700 group-hover:scale-105">
            {project.image ? (
              <img src={project.image} alt={project.title}
                className="w-full h-full object-cover object-top opacity-90 group-hover:opacity-100 transition-opacity duration-500"/>
            ) : (
              <div className="w-full h-full" style={{
                background: `
                  radial-gradient(ellipse at 20% 50%, rgba(${rgb},0.28) 0%, transparent 60%),
                  radial-gradient(ellipse at 80% 20%, rgba(${rgb},0.16) 0%, transparent 50%),
                  radial-gradient(ellipse at 60% 80%, rgba(${rgb},0.1)  0%, transparent 45%),
                  linear-gradient(135deg, #0d0e1f 0%, #0a0b14 100%)`,
              }}>
                <svg className="absolute inset-0 w-full h-full opacity-[0.07]" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <pattern id={`grid-${project.id}`} width="32" height="32" patternUnits="userSpaceOnUse">
                      <path d="M 32 0 L 0 0 0 32" fill="none" stroke="white" strokeWidth="0.5"/>
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill={`url(#grid-${project.id})`}/>
                </svg>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full blur-3xl"
                  style={{ background: `rgba(${rgb},0.45)` }}/>
              </div>
            )}
          </motion.div>

          {/* Vignette */}
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: "linear-gradient(to top, rgba(10,11,20,0.88) 0%, rgba(10,11,20,0.2) 45%, transparent 100%)" }}/>

          {/* Badges */}
          <div className="absolute top-4 left-4 flex gap-2 z-10">
            <span className="px-2.5 py-1 rounded-lg text-[9px] font-bold tracking-widest uppercase backdrop-blur-md border"
              style={{ color: accent, background: `rgba(${rgb},0.12)`, borderColor: `rgba(${rgb},0.25)` }}>
              {project.type}
            </span>
            <span className="px-2.5 py-1 rounded-lg text-[9px] font-bold tracking-widest uppercase backdrop-blur-md border"
              style={{ color: src.color, background: src.bg, borderColor: src.border }}>
              {src.label}
            </span>
          </div>

          {/* Desktop expand hint */}
          <div className="absolute inset-0 hidden md:flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-mono backdrop-blur-md"
              style={{ background: `rgba(${rgb},0.18)`, border: `1px solid rgba(${rgb},0.4)`, color: accent }}>
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"/>
              </svg>
              Expand
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 -mt-5 relative z-10 flex flex-col gap-3">

          <motion.h3 layoutId={`title-${layoutId}`}
            className="text-lg font-bold text-white leading-tight">
            {project.title}
          </motion.h3>

          {/* Summary: 2-line on desktop, full on mobile */}
          <p className="text-sm text-slate-400 leading-relaxed md:line-clamp-2">
            {project.summary}
          </p>

          {/* Metrics: 3 on desktop, all 6 on mobile */}
          <div className="hidden md:flex flex-wrap gap-2">
            {project.metrics.slice(0, 3).map((m) => (
              <div key={m.label} className="flex flex-col px-3 py-1.5 rounded-xl border"
                style={{ background: "rgba(255,255,255,0.03)", borderColor: `rgba(${rgb},0.15)` }}>
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-tight leading-tight">{m.label}</span>
                <span className="text-[14px] font-bold font-mono leading-none mt-0.5" style={{ color: accent }}>{m.value}</span>
              </div>
            ))}
          </div>
          <div className="md:hidden grid grid-cols-3 gap-2">
            {project.metrics.map((m) => (
              <div key={m.label} className="flex flex-col px-3 py-2 rounded-xl border"
                style={{ background: `rgba(${rgb},0.07)`, borderColor: `rgba(${rgb},0.2)` }}>
                <span className="text-[9px] font-mono text-slate-500 uppercase tracking-tight leading-tight">{m.label}</span>
                <span className="text-[13px] font-bold font-mono leading-none mt-1" style={{ color: accent }}>{m.value}</span>
              </div>
            ))}
          </div>

          {/* Stack: 5 on desktop, all on mobile */}
          <div className="flex flex-wrap gap-1.5">
            {project.stack.map((s, si) => (
              <span key={s}
                className={`px-2.5 py-0.5 rounded-md text-[10px] font-mono text-slate-400 ${si >= 5 ? "hidden md:hidden" : ""}`}
                style={{ background: "rgba(255,255,255,0.04)", border: `1px solid rgba(${rgb},0.1)` }}>
                {s}
              </span>
            ))}
            {project.stack.length > 5 && (
              <span className="hidden md:inline px-2.5 py-0.5 text-[10px] font-mono text-slate-600">
                +{project.stack.length - 5}
              </span>
            )}
          </div>

          {/* Footer */}
          <div className="pt-3 flex items-center justify-between border-t border-white/[0.05]">
            <div className="flex gap-4">
              {project.github && (
                <a href={project.github} target="_blank" rel="noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="text-slate-500 hover:text-white transition-colors duration-200">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.2 11.38.6.1.82-.26.82-.58v-2.03c-3.34.72-4.04-1.61-4.04-1.61-.54-1.38-1.33-1.74-1.33-1.74-1.09-.74.08-.73.08-.73 1.2.08 1.84 1.24 1.84 1.24 1.07 1.83 2.8 1.3 3.48 1 .1-.78.42-1.3.76-1.6-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.52.12-3.17 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 3-.4c1.02 0 2.04.13 3 .4 2.28-1.55 3.3-1.23 3.3-1.23.66 1.65.24 2.87.12 3.17.77.84 1.24 1.91 1.24 3.22 0 4.61-2.8 5.63-5.48 5.92.43.37.81 1.1.81 2.22v3.29c0 .32.22.7.83.58A12 12 0 0 0 24 12C24 5.37 18.63 0 12 0z"/>
                  </svg>
                </a>
              )}
              {project.live && (
                <a href={project.live} target="_blank" rel="noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="text-slate-500 hover:text-[#34d399] transition-colors duration-200">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path d="M10 6H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-4M14 4h6m0 0v6m0-6L10 14"/>
                  </svg>
                </a>
              )}
              {project.paper && (
                <a href={project.paper} target="_blank" rel="noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="text-slate-500 hover:text-[#fb923c] transition-colors duration-200">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5.586a1 1 0 0 1 .707.293l5.414 5.414a1 1 0 0 1 .293.707V19a2 2 0 0 1-2 2z"/>
                  </svg>
                </a>
              )}
            </div>
            <div className="flex items-center gap-2 text-[10px] font-mono font-bold tracking-wider" style={{ color: accent }}>
              <span className="relative flex items-center justify-center w-3 h-3">
                <motion.span className="absolute rounded-full"
                  style={{ background: accent, width: "100%", height: "100%" }}
                  animate={{ scale: [1, 2.2, 1], opacity: [0.7, 0, 0.7] }}
                  transition={{ duration: 2.4, repeat: Infinity, ease: "easeOut" }}/>
                <span className="relative w-1.5 h-1.5 rounded-full" style={{ background: accent }}/>
              </span>
              {project.status} {project.statusText}
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ██  ENGINEER VIEW - the original Network Inspector, 100% unchanged
// ─────────────────────────────────────────────────────────────────────────────
function WaterfallBar({ durationMs, index }: { durationMs: number; index: number }) {
  const pct    = Math.min((durationMs / 250) * 100, 100);
  const offset = Math.min(index * 4, 40);
  return (
    <div className="flex items-center gap-2 w-32">
      <div className="flex-1 h-3 bg-white/[0.04] rounded-sm overflow-hidden relative">
        <div className="absolute top-0 h-full rounded-sm"
          style={{ left: `${offset}%`, width: `${Math.max(pct - offset, 4)}%`, background: "linear-gradient(90deg,#7aa2f7,#cbacf9)" }}
        />
      </div>
      <span className="text-[10px] text-[#4a5270] font-mono w-10 text-right">{fmt(durationMs)}</span>
    </div>
  );
}

function TypedResponse({ text }: { text: string }) {
  const [displayed, setDisplayed] = useState("");
  const idx = useRef(0);
  useEffect(() => {
    setDisplayed(""); idx.current = 0;
    const id = setInterval(() => {
      if (idx.current < text.length) { setDisplayed(text.slice(0, idx.current + 1)); idx.current++; }
      else clearInterval(id);
    }, 7);
    return () => clearInterval(id);
  }, [text]);
  const hl = displayed
    .replace(/("[\w\s_]+?")\s*:/g, '<span style="color:#cbacf9">$1</span>:')
    .replace(/:\s*(".*?")/g,       ': <span style="color:#9ece6a">$1</span>')
    .replace(/:\s*(\d+\.?\d*)/g,   ': <span style="color:#ff9e64">$1</span>')
    .replace(/:\s*(true|false)/g,  ': <span style="color:#7dcfff">$1</span>');
  return (
    <pre className="text-[11.5px] leading-relaxed font-mono text-[#c1c2d3] whitespace-pre-wrap"
      dangerouslySetInnerHTML={{ __html: hl + (displayed.length < text.length ? '<span class="animate-pulse">▋</span>' : "") }}
    />
  );
}

function ArchitectureDiagram({ steps }: { steps: string[] }) {
  return (
    <div className="flex flex-col gap-0">
      {steps.map((step, i) => {
        const isArrow = step.startsWith("→");
        return (
          <motion.div key={i} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}>
            {isArrow ? (
              <div className="flex items-center gap-3 pl-4">
                <div className="flex flex-col items-center">
                  <div className="w-px h-4 bg-[#7aa2f7]/30" />
                  <div className="text-[#7aa2f7] text-xs">↓</div>
                </div>
                <div className="px-3 py-1.5 rounded-md border text-[11.5px] font-mono text-[#c1c2d3]"
                  style={{ background: "rgba(122,162,247,0.06)", borderColor: "rgba(122,162,247,0.15)" }}>
                  {step.replace("→ ", "")}
                </div>
              </div>
            ) : (
              <div className="px-3 py-1.5 rounded-md border text-[11.5px] font-mono font-semibold text-white"
                style={{ background: "rgba(203,172,249,0.08)", borderColor: "rgba(203,172,249,0.2)" }}>
                {step}
              </div>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}

function FeaturedCard({ project }: { project: Project }) {
  const tc = typeAccent(project.type);
  const sb = SOURCE_META[project.source] ?? SOURCE_META.personal;
  return (
    <div className="flex flex-col gap-3 p-4 rounded-xl border transition-all hover:border-white/[0.12] cursor-default"
      style={{ background: "rgb(14,16,28)", borderColor: "rgba(255,255,255,0.07)" }}>
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[9px] font-mono px-1.5 py-0.5 rounded" style={{ color: tc, background: `${tc}18` }}>
              {project.type.toUpperCase()}
            </span>
            <span className="text-[9px] font-mono px-1.5 py-0.5 rounded border"
              style={{ color: sb.color, background: sb.bg, borderColor: sb.border }}>
              {sb.label}
            </span>
          </div>
          <div className="text-[13px] font-semibold text-white font-mono leading-tight">{project.title}</div>
        </div>
        <div className="text-right flex-shrink-0">
          <div className="text-[18px] font-bold font-mono" style={{ color: tc }}>{project.metrics[0]?.value}</div>
          <div className="text-[9px] text-[#4a5270] font-mono">{project.metrics[0]?.label}</div>
        </div>
      </div>
      <p className="text-[11px] text-[#4a5270] leading-relaxed line-clamp-2">{project.summary}</p>
      <div className="flex items-center gap-1.5">
        <span className="text-[10px] font-mono text-[#4a5270]">{project.endpoint}</span>
        <span className="text-[#4a5270]">·</span>
        <span className="text-[10px] font-mono" style={{ color: statusColor(project.status) }}>
          {project.status} {fmt(project.durationMs)}
        </span>
      </div>
    </div>
  );
}

function EngineerView({ sorted }: { sorted: Project[] }) {
  const featured = sorted.filter(p => p.priority === "featured");

  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [tabMap, setTabMap]         = useState<Record<string, DetailTab>>({});
  const [filter, setFilter]         = useState("All");
  const [searchVal, setSearchVal]   = useState("");
  const [recording, setRecording]   = useState(true);

  const getTab = (id: string): DetailTab => tabMap[id] ?? "metrics";
  const setTab = (id: string, tab: DetailTab) => setTabMap(prev => ({ ...prev, [id]: tab }));

  const FILTERS = ["All", "ml", "fullstack", "backend", "research", "internship", "production", "personal"];

  const filtered = sorted.filter(p => {
    const matchType   = filter === "All" || p.type === filter || (filter === p.source);
    const matchSearch =
      p.title.toLowerCase().includes(searchVal.toLowerCase()) ||
      p.endpoint.toLowerCase().includes(searchVal.toLowerCase()) ||
      p.stack.some(s => s.toLowerCase().includes(searchVal.toLowerCase()));
    return matchType && matchSearch;
  });

  const totalMs = filtered.reduce((a, p) => a + p.durationMs, 0);

  return (
    <>
      {/* Featured summary */}
      {featured.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-1.5 h-1.5 rounded-full bg-[#34d399] animate-pulse" />
            <span className="text-[11px] font-mono text-[#4a5270] uppercase tracking-wider">Featured Systems</span>
            <div className="flex-1 h-px bg-white/[0.06]" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {featured.map(p => <FeaturedCard key={p.id} project={p} />)}
          </div>
        </div>
      )}

      {/* DevTools shell */}
      <div className="rounded-xl overflow-hidden border border-white/[0.08] shadow-2xl" style={{ background: "rgb(12,13,24)" }}>
        {/* DevTools tab bar */}
        <div className="flex items-center border-b border-white/[0.06]" style={{ background: "rgb(20,22,38)", minHeight: 36 }}>
          {["Elements","Console","Sources","Network","Performance","Memory"].map(t => (
            <div key={t} className={`px-4 py-2 text-[11px] font-mono cursor-default border-b-2 transition-colors ${
              t === "Network" ? "border-[#7aa2f7] text-[#7aa2f7]" : "border-transparent text-[#4a5270] hover:text-[#c1c2d3]"
            }`}>{t}</div>
          ))}
          <div className="ml-auto flex items-center gap-3 pr-4">
            <button onClick={() => setRecording(r => !r)} className="flex items-center gap-1.5 text-[10px] font-mono">
              <div className={`w-2.5 h-2.5 rounded-full ${recording ? "bg-[#f87171] animate-pulse" : "bg-[#4a5270]"}`} />
              <span className={recording ? "text-[#f87171]" : "text-[#4a5270]"}>{recording ? "Recording" : "Stopped"}</span>
            </button>
            <div className="w-px h-4 bg-white/[0.06]" />
            <span className="text-[10px] font-mono text-[#4a5270]">{filtered.length} requests</span>
          </div>
        </div>

        {/* Filter bar */}
        <div className="flex flex-wrap items-center gap-3 px-4 py-2 border-b border-white/[0.06]" style={{ background: "rgb(16,18,32)" }}>
          <div className="relative flex-1 min-w-[180px] max-w-xs">
            <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-[#4a5270]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input type="text" placeholder="Filter by name, endpoint, stack..."
              value={searchVal} onChange={e => setSearchVal(e.target.value)}
              className="w-full bg-white/[0.04] border border-white/[0.08] rounded text-[11px] font-mono text-[#c1c2d3] placeholder-[#4a5270] py-1.5 pl-8 pr-3 outline-none focus:border-[#7aa2f7]/40 transition-colors"
            />
          </div>
          <div className="flex flex-wrap gap-1">
            {FILTERS.map(f => (
              <button key={f} onClick={() => setFilter(f)}
                className="px-2.5 py-1 rounded text-[10px] font-mono transition-all border"
                style={filter === f
                  ? { color: typeAccent(f) || "#cbacf9", borderColor: `${typeAccent(f) || "#cbacf9"}50`, background: `${typeAccent(f) || "#cbacf9"}15` }
                  : { color: "#4a5270", borderColor: "transparent" }}>
                {f}
              </button>
            ))}
          </div>
          <div className="ml-auto text-[10px] font-mono text-[#4a5270] hidden md:flex items-center gap-3">
            <span>DOMContentLoaded: <span className="text-[#60a5fa]">1.2s</span></span>
            <span>Load: <span className="text-[#f87171]">2.4s</span></span>
          </div>
        </div>

        {/* Column headers */}
        <div className="font-mono text-[10px] text-[#4a5270] uppercase tracking-wider border-b border-white/[0.06] px-4 py-1.5 select-none hidden md:grid"
          style={{ gridTemplateColumns: "28px 52px 1fr 96px 80px 56px 64px 144px", background: "rgb(14,16,28)" }}>
          <span /><span>Method</span><span>Name / Endpoint</span>
          <span className="text-center">Status</span><span className="text-center">Source</span>
          <span className="text-right">Type</span><span className="text-right">Size</span>
          <span className="text-right pr-2">Waterfall</span>
        </div>

        {/* Rows */}
        <div>
          <AnimatePresence>
            {filtered.map((p, i) => {
              const mc        = METHOD_META[p.method] ?? METHOD_META.GET;
              const sb        = SOURCE_META[p.source] ?? SOURCE_META.personal;
              const tc        = typeAccent(p.type);
              const isOpen    = expandedId === p.id;
              const activeTab = getTab(p.id);
              return (
                <motion.div key={p.id}
                  initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -8 }}
                  transition={{ delay: i * 0.05 }}>

                  {/* Desktop row */}
                  <div onClick={() => setExpandedId(isOpen ? null : p.id)}
                    className={`px-4 py-2.5 cursor-pointer border-b border-white/[0.04] transition-all group hidden md:grid items-center border-l-2
                      ${isOpen ? "bg-[#7aa2f7]/[0.07] border-l-[#7aa2f7]" : "hover:bg-white/[0.03] border-l-transparent"}`}
                    style={{ gridTemplateColumns: "28px 52px 1fr 96px 80px 56px 64px 144px" }}>
                    <span className={`text-[#4a5270] text-[10px] transition-transform duration-200 ${isOpen ? "rotate-90" : ""}`}>▶</span>
                    <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded w-fit"
                      style={{ background: mc.bg, color: mc.text, border: `1px solid ${mc.border}` }}>
                      {p.method}
                    </span>
                    <div className="min-w-0 pl-2">
                      <div className="text-[12px] font-mono text-[#c1c2d3] truncate group-hover:text-white transition-colors">{p.endpoint}</div>
                      <div className="text-[10px] text-[#4a5270] truncate mt-0.5 flex items-center gap-1.5">
                        {p.title}
                        {p.priority === "featured" && (
                          <span className="text-[8px] px-1 py-0.5 rounded bg-[#cbacf9]/10 text-[#cbacf9] border border-[#cbacf9]/20 font-mono">★ FEATURED</span>
                        )}
                      </div>
                    </div>
                    <div className="text-center">
                      <span className="text-[11px] font-mono font-bold" style={{ color: statusColor(p.status) }}>{p.status}</span>
                      <span className="text-[9px] text-[#4a5270] ml-1">{p.statusText}</span>
                    </div>
                    <div className="flex justify-center">
                      <span className="text-[9px] font-mono px-1.5 py-0.5 rounded border"
                        style={{ color: sb.color, background: sb.bg, borderColor: sb.border }}>
                        {sb.label}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-[9px] font-mono px-1.5 py-0.5 rounded" style={{ color: tc, background: `${tc}15` }}>
                        {p.type}
                      </span>
                    </div>
                    <span className="text-[11px] font-mono text-[#c1c2d3] text-right">{p.size}</span>
                    <div className="flex justify-end"><WaterfallBar durationMs={p.durationMs} index={i} /></div>
                  </div>

                  {/* Mobile row */}
                  <div onClick={() => setExpandedId(isOpen ? null : p.id)}
                    className={`md:hidden px-4 py-3 cursor-pointer border-b border-white/[0.04] border-l-2 transition-all
                      ${isOpen ? "bg-[#7aa2f7]/[0.07] border-l-[#7aa2f7]" : "border-l-transparent hover:bg-white/[0.03]"}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className={`text-[#4a5270] text-[10px] transition-transform ${isOpen ? "rotate-90" : ""}`}>▶</span>
                        <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded"
                          style={{ background: mc.bg, color: mc.text, border: `1px solid ${mc.border}` }}>{p.method}</span>
                        <span className="text-[12px] font-mono text-[#c1c2d3] truncate max-w-[180px]">{p.title}</span>
                      </div>
                      <span className="text-[11px] font-mono font-bold" style={{ color: statusColor(p.status) }}>{p.status}</span>
                    </div>
                    <div className="mt-1 pl-6 text-[10px] font-mono text-[#4a5270] truncate">{p.endpoint}</div>
                  </div>

                  {/* Expanded panel */}
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.22, ease: "easeInOut" }}
                        className="overflow-hidden border-b border-white/[0.06]">
                        <div style={{ background: "rgb(10,11,22)" }}>
                          <div className="flex border-b border-white/[0.06] overflow-x-auto" style={{ background: "rgb(14,16,28)" }}>
                            {(["metrics","architecture","headers","response","preview"] as DetailTab[]).map(t => (
                              <button key={t} onClick={e => { e.stopPropagation(); setTab(p.id, t); }}
                                className={`px-4 py-2 text-[11px] font-mono whitespace-nowrap border-b-2 transition-colors ${
                                  activeTab === t ? "border-[#cbacf9] text-[#cbacf9]" : "border-transparent text-[#4a5270] hover:text-[#c1c2d3]"
                                }`}>
                                {t === "metrics" ? "📊 Metrics" : t === "architecture" ? "🏗 Architecture" :
                                 t === "headers"  ? "⚙️ Headers"  : t === "response" ? "{ } Response" : "🔗 Preview"}
                              </button>
                            ))}
                            <div className="ml-auto flex items-center gap-3 pr-4 flex-shrink-0">
                              {p.github && <a href={p.github} target="_blank" rel="noreferrer" onClick={e => e.stopPropagation()} className="text-[10px] font-mono text-[#4a5270] hover:text-[#cbacf9] transition-colors flex items-center gap-1"><svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.2 11.38.6.1.82-.26.82-.58v-2.03c-3.34.72-4.04-1.61-4.04-1.61-.54-1.38-1.33-1.74-1.33-1.74-1.09-.74.08-.73.08-.73 1.2.08 1.84 1.24 1.84 1.24 1.07 1.83 2.8 1.3 3.48 1 .1-.78.42-1.3.76-1.6-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.52.12-3.17 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 3-.4c1.02 0 2.04.13 3 .4 2.28-1.55 3.3-1.23 3.3-1.23.66 1.65.24 2.87.12 3.17.77.84 1.24 1.91 1.24 3.22 0 4.61-2.8 5.63-5.48 5.92.43.37.81 1.1.81 2.22v3.29c0 .32.22.7.83.58A12 12 0 0 0 24 12C24 5.37 18.63 0 12 0z"/></svg>GitHub</a>}
                              {p.live  && <a href={p.live}   target="_blank" rel="noreferrer" onClick={e => e.stopPropagation()} className="text-[10px] font-mono text-[#4a5270] hover:text-[#34d399] transition-colors flex items-center gap-1"><svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M10 6H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>Live</a>}
                              {p.paper && <a href={p.paper}  target="_blank" rel="noreferrer" onClick={e => e.stopPropagation()} className="text-[10px] font-mono text-[#4a5270] hover:text-[#fb923c] transition-colors flex items-center gap-1"><svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M9 12h6m-6 4h6m2 5H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5.586a1 1 0 0 1 .707.293l5.414 5.414a1 1 0 0 1 .293.707V19a2 2 0 0 1-2 2z"/></svg>Paper</a>}
                            </div>
                          </div>
                          <div className="p-5">
                            {activeTab === "metrics" && (
                              <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                                <div className="grid grid-cols-3 gap-3 p-3 rounded-lg border border-white/[0.05]" style={{ background: "rgba(122,162,247,0.04)" }}>
                                  {[{ label: "Environment", value: p.environment },{ label: "Deployment", value: p.deployment },{ label: "Scale", value: p.usersOrDataset }].map(c => (
                                    <div key={c.label}>
                                      <div className="text-[9px] font-mono text-[#4a5270] uppercase tracking-wider mb-1">{c.label}</div>
                                      <div className="text-[11.5px] font-mono text-[#c1c2d3]">{c.value}</div>
                                    </div>
                                  ))}
                                </div>
                                <p className="text-[12.5px] text-[#c1c2d3] leading-relaxed">{p.summary}</p>
                                <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                                  {p.metrics.map(m => (
                                    <div key={m.label} className="flex flex-col gap-1 p-3 rounded-lg border border-white/[0.06] bg-white/[0.02]">
                                      <span className="text-[9px] font-mono text-[#4a5270] uppercase tracking-wider leading-tight">{m.label}</span>
                                      <span className="text-[13px] font-mono font-bold text-white leading-tight">{m.value}</span>
                                    </div>
                                  ))}
                                </div>
                                <div className="flex flex-wrap gap-2">
                                  {p.stack.map(s => <span key={s} className="px-2.5 py-1 text-[10.5px] font-mono rounded border border-white/[0.08] text-[#c1c2d3] bg-white/[0.03]">{s}</span>)}
                                </div>
                              </motion.div>
                            )}
                            {activeTab === "architecture" && (
                              <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                                <p className="text-[10px] font-mono text-[#4a5270] uppercase tracking-wider">System Architecture</p>
                                <ArchitectureDiagram steps={p.architecture} />
                              </motion.div>
                            )}
                            {activeTab === "headers" && (
                              <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} className="space-y-1">
                                <p className="text-[10px] font-mono text-[#4a5270] uppercase tracking-wider mb-3">Request Headers</p>
                                {p.requestHeaders.map(h => (
                                  <div key={h.key} className="flex gap-3 py-1.5 border-b border-white/[0.04] font-mono text-[11.5px]">
                                    <span className="text-[#cbacf9] min-w-[200px] flex-shrink-0">{h.key}:</span>
                                    <span className="text-[#9ece6a]">{h.value}</span>
                                  </div>
                                ))}
                              </motion.div>
                            )}
                            {activeTab === "response" && (
                              <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}>
                                <div className="flex items-center justify-between mb-3">
                                  <p className="text-[10px] font-mono text-[#4a5270] uppercase tracking-wider">Response Body</p>
                                  <span className="text-[10px] font-mono text-[#34d399]">{p.status} {p.statusText} · {fmt(p.durationMs)}</span>
                                </div>
                                <div className="rounded-lg p-4 border border-white/[0.06]" style={{ background: "rgb(4,7,29)" }}>
                                  <TypedResponse text={p.response} />
                                </div>
                              </motion.div>
                            )}
                            {activeTab === "preview" && (
                              <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                                <div className="rounded-lg border border-white/[0.06] overflow-hidden" style={{ background: "rgb(4,7,29)" }}>
                                  <div className="flex items-center gap-2 px-4 py-2 border-b border-white/[0.06]" style={{ background: "rgb(10,11,22)" }}>
                                    <div className="flex gap-1.5">
                                      <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" /><div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" /><div className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
                                    </div>
                                    <span className="text-[10px] font-mono text-[#4a5270]">bash - {p.id}</span>
                                  </div>
                                  <div className="p-4 font-mono text-[11.5px] space-y-1 text-[#c1c2d3]">
                                    <div><span className="text-[#34d399]">➜</span> <span className="text-[#7aa2f7]">~/{p.id}</span> <span>git log --oneline -3</span></div>
                                    <div className="text-[#4a5270]">a3f2c1d feat: {p.summary.split(".")[0].toLowerCase()}</div>
                                    <div className="text-[#4a5270]">b7e9a2f refactor: optimise core pipeline</div>
                                    <div className="text-[#4a5270]">c1d4f3e chore: update dependencies</div>
                                    <div className="mt-2"><span className="text-[#34d399]">➜</span> <span className="text-[#7aa2f7]">~/{p.id}</span> <span>npm run build</span></div>
                                    <div className="text-[#9ece6a]">✓ Build complete in {fmt(p.durationMs)}</div>
                                    <div className="text-[#9ece6a]">✓ {p.metrics[0]?.label}: {p.metrics[0]?.value}</div>
                                    <div className="text-[#9ece6a]">✓ Deployed to {p.deployment}</div>
                                  </div>
                                </div>
                                <div className="flex flex-wrap gap-3">
                                  {p.github && <a href={p.github} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-4 py-2 rounded-lg border border-white/[0.08] text-[11px] font-mono text-[#c1c2d3] hover:border-[#cbacf9]/30 hover:text-[#cbacf9] transition-all bg-white/[0.02]"><svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.2 11.38.6.1.82-.26.82-.58v-2.03c-3.34.72-4.04-1.61-4.04-1.61-.54-1.38-1.33-1.74-1.33-1.74-1.09-.74.08-.73.08-.73 1.2.08 1.84 1.24 1.84 1.24 1.07 1.83 2.8 1.3 3.48 1 .1-.78.42-1.3.76-1.6-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.52.12-3.17 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 3-.4c1.02 0 2.04.13 3 .4 2.28-1.55 3.3-1.23 3.3-1.23.66 1.65.24 2.87.12 3.17.77.84 1.24 1.91 1.24 3.22 0 4.61-2.8 5.63-5.48 5.92.43.37.81 1.1.81 2.22v3.29c0 .32.22.7.83.58A12 12 0 0 0 24 12C24 5.37 18.63 0 12 0z"/></svg>View on GitHub</a>}
                                  {p.live  && <a href={p.live}   target="_blank" rel="noreferrer" className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[#34d399]/20 text-[11px] font-mono text-[#34d399] hover:bg-[#34d399]/10 transition-all bg-[#34d399]/5"><svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M10 6H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>Open Live Site</a>}
                                  {p.paper && <a href={p.paper}  target="_blank" rel="noreferrer" className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[#fb923c]/20 text-[11px] font-mono text-[#fb923c] hover:bg-[#fb923c]/10 transition-all bg-[#fb923c]/5"><svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M9 12h6m-6 4h6m2 5H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5.586a1 1 0 0 1 .707.293l5.414 5.414a1 1 0 0 1 .293.707V19a2 2 0 0 1-2 2z"/></svg>View Research Paper</a>}
                                </div>
                              </motion.div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {filtered.length === 0 && (
            <div className="py-12 text-center font-mono text-[#4a5270] text-sm">
              No requests match <span className="text-[#cbacf9]">{searchVal || filter}</span>
            </div>
          )}
        </div>

        {/* Status bar */}
        <div className="flex items-center justify-between px-4 py-2 border-t border-white/[0.06] font-mono text-[10px] text-[#4a5270]"
          style={{ background: "rgb(14,16,28)" }}>
          <div className="flex items-center gap-4 flex-wrap">
            <span>{filtered.length} / {sorted.length} requests</span>
            <span className="text-[#60a5fa]">{totalMs}ms total</span>
            <span>{filtered.filter(p => p.source === "internship").length} internship</span>
            <span>{filtered.filter(p => p.source === "production").length} production</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-[#34d399] animate-pulse" />
            <span className="hidden md:inline">mahanthvamsi.dev - Network Inspector v2.0</span>
          </div>
        </div>
      </div>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ██  ROOT - toggle + render the right view
// ─────────────────────────────────────────────────────────────────────────────
export default function RecentProjects() {
  const [mode, setMode] = useState<ViewMode>("visual");
  const sorted = sortedProjects(projects);

  return (
    <section className="py-20 px-4 md:px-8 max-w-7xl mx-auto" id="projects">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10">
        <div>
          <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight mb-2">
            Recent <span className="text-[#9577c9]">Projects</span>
          </h2>
          <AnimatePresence mode="wait">
            <motion.p
              key={mode}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.2 }}
              className="text-[#4a5270] text-sm font-mono"
            >
              {mode === "visual"
                ? "// overview - metrics, data flow, stack"
                : "// network inspector - headers, response, architecture"}
            </motion.p>
          </AnimatePresence>
        </div>
        <ModeToggle mode={mode} onChange={setMode} />
      </div>

      {/* Views */}
      <AnimatePresence mode="wait">
        {mode === "visual" ? (
          <motion.div
            key="visual"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.28, ease: "easeOut" }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {sorted.map((p, i) => (
              <VisualCard key={p.id} project={p} index={i} />
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="engineer"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.28, ease: "easeOut" }}
          >
            <EngineerView sorted={sorted} />
          </motion.div>
        )}
      </AnimatePresence>

    </section>
  );
}