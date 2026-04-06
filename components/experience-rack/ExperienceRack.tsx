// components/experience-rack/ExperienceRack.tsx
"use client";

import React, { Suspense, useState, useCallback } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import { workExperience } from "@/data";
import type { WorkExperience } from "./types";
import ExperiencePanel from "./ExperiencePanel";

// ─── ONE dynamic import - one Canvas, always ─────────────────────────────────
const RackScene = dynamic(() => import("./RackScene"), {
  ssr: false,
  loading: () => <RackSkeleton />,
});

function RackSkeleton() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-slate-700"
              animate={{ opacity: [0.2, 0.8, 0.2] }}
              transition={{ duration: 1.4, repeat: Infinity, delay: i * 0.2 }}
            />
          ))}
        </div>
        <span className="font-mono text-[10px] text-slate-600 tracking-widest uppercase">
          initialising rack...
        </span>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="h-full flex flex-col items-center justify-center gap-4 select-none">
      <div className="flex items-center gap-2">
        <span className="font-mono text-[11px] text-slate-600 tracking-widest uppercase">
          awaiting selection
        </span>
        <motion.span
          className="inline-block w-[7px] h-[13px] bg-slate-700"
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.9, repeat: Infinity, repeatType: "reverse" }}
        />
      </div>
      <p className="font-mono text-[10px] text-slate-700 text-center max-w-[180px] leading-relaxed">
        tap a drive on the rack to load its record
      </p>
    </div>
  );
}

// ─── Main section ─────────────────────────────────────────────────────────────
export default function ExperienceRack() {
  const [ejectedId, setEjectedId] = useState<number | null>(null);

  const handleToggle = useCallback((id: number) => {
    setEjectedId((prev) => (prev === id ? null : id));
  }, []);

  const activeExp =
    ejectedId !== null
      ? (workExperience as unknown as WorkExperience[]).find(
          (e) => e.id === ejectedId
        ) ?? null
      : null;

  return (
    <section
      id="experience"
      className="w-full relative overflow-hidden"
      style={{ height: "100svh", minHeight: "620px", maxHeight: "920px" }}
    >
      {/* ── Top label strip ── */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.35 }}
        className="absolute top-0 left-0 right-0 z-20 px-8 pt-7 flex items-center gap-3 pointer-events-none"
      >
        <span className="font-mono text-[10px] text-slate-500 tracking-widest uppercase">
          /experience
        </span>
        <div className="flex-1 h-px bg-white/[0.05]" />
        <span className="font-mono text-[10px] text-slate-600">rack.view</span>
      </motion.div>

      {/*
        ════════════════════════════════════════════════════════════════
        SINGLE layout container - one DOM tree, CSS does the switching.

        Mobile  (<md): flex-col
          • canvas wrapper  → w-full h-[50%]
          • panel wrapper   → w-full flex-1 overflow-y-auto

        Tablet+ (≥md): flex-row
          • canvas wrapper  → w-[45%] h-full
          • panel wrapper   → flex-1 h-full

        Only ONE <RackScene /> ever mounts → no double-Canvas → no R3F hook error.
        ════════════════════════════════════════════════════════════════
      */}
      <div className="absolute inset-0 flex flex-col md:flex-row">

        {/* ── CANVAS COLUMN ── */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          // mobile: full width, half height   tablet+: 45% wide, full height
          className="relative flex-none w-full h-1/2 md:w-[45%] md:h-full"
        >
          {/* Desktop vertical divider */}
          <div className="hidden md:block absolute right-0 top-[8%] bottom-[8%] w-px bg-white/[0.05] z-10" />
          {/* Mobile horizontal divider */}
          <div className="md:hidden absolute bottom-0 left-[6%] right-[6%] h-px bg-white/[0.05] z-10" />

          <Suspense fallback={<RackSkeleton />}>
            <RackScene ejectedId={ejectedId} onToggle={handleToggle} />
          </Suspense>

          <div className="absolute bottom-2 md:bottom-5 left-0 right-0 flex justify-center pointer-events-none">
            <span className="font-mono text-[9px] text-slate-700 tracking-wide">
              tap drive · drag to orbit · pinch zoom
            </span>
          </div>
        </motion.div>

        {/* ── PANEL COLUMN ── */}
        <div
          // mobile: scrollable remaining height   tablet+: centred column
          className="flex-1 flex flex-col overflow-y-auto md:overflow-visible md:justify-center px-6 md:px-10 lg:px-14 pt-5 pb-6 md:pt-0 md:pb-0"
          style={{ minWidth: 0 }}
        >
          {/*
            On desktop the title + panel must be ONE flex child so they
            centre as a unit. On mobile they stack naturally in scroll flow.
          */}
          <div className="md:flex md:flex-col md:justify-center md:h-full" style={{ maxHeight: "100%" }}>

            {/* Title */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="mb-5 md:mb-8 shrink-0"
            >
              <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight mb-2">
                Work <span className="text-[#9577c9]">Experience</span>
              </h2>
              <p className="font-mono text-[11px] text-slate-500 mt-1">
                {(workExperience as unknown as WorkExperience[]).length} records loaded
              </p>
            </motion.div>

            {/* Panel / empty state */}
            <div className="flex-1 md:max-h-[60%]" style={{ minHeight: 0 }}>
              <AnimatePresence mode="wait">
                {activeExp ? (
                  <ExperiencePanel
                    key={activeExp.id}
                    exp={activeExp}
                    onClose={() => setEjectedId(null)}
                  />
                ) : (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex items-center justify-center"
                    style={{ minHeight: "100px" }}
                  >
                    <EmptyState />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}