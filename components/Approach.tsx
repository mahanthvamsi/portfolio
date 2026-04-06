"use client";

import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Tooltip } from "@/components/ui/tooltip-card";
import { philosophyPillars } from "@/data";

// ─── Types ────────────────────────────────────────────────────────────────────
interface TooltipRef {
  quote: string;
  person: string;
  role: string;
  initials: string;
  avatarBg: string;
  accentColor: string;
}

interface BodyPart {
  text: string;
  tooltip?: TooltipRef;
}

// ─── Quote card shown inside Tooltip ─────────────────────────────────────────
function QuoteCard({ tooltipRef }: { tooltipRef: TooltipRef }) {
  return (
    <div className="space-y-3 w-[220px]">
      {/* Quote */}
      <p
        className="text-[12px] leading-relaxed italic text-neutral-300"
        style={{ borderLeft: `2px solid ${tooltipRef.accentColor}40`, paddingLeft: "10px" }}
      >
        "{tooltipRef.quote}"
      </p>

      {/* Divider */}
      <div className="h-px bg-white/[0.06]" />

      {/* Person */}
      <div className="flex items-center gap-2.5">
        {/* Avatar circle */}
        <div
          className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-[10px] font-bold text-white"
          style={{
            background: tooltipRef.avatarBg,
            border: `1px solid ${tooltipRef.accentColor}30`,
            color: tooltipRef.accentColor,
          }}
        >
          {tooltipRef.initials}
        </div>
        <div>
          <p className="text-[11px] font-semibold text-neutral-200 leading-tight">
            {tooltipRef.person}
          </p>
          <p className="text-[9px] text-neutral-600 leading-tight mt-0.5">
            {tooltipRef.role}
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Renders the body text with inline Tooltip triggers ───────────────────────
function BodyWithTooltips({
  parts,
  accentRgb,
}: {
  parts: BodyPart[];
  accentRgb: string;
}) {
  return (
    <div className="text-slate-400 text-[14px] leading-[1.85]">
      {parts.map((part, i) =>
        part.tooltip ? (
          <Tooltip
            key={i}
            content={<QuoteCard tooltipRef={part.tooltip} />}
            containerClassName="inline"
          >
            <span
              className="cursor-default underline underline-offset-[3px] decoration-dotted transition-colors duration-200"
              style={{
                color: `rgba(${accentRgb}, 0.9)`,
                textDecorationColor: `rgba(${accentRgb}, 0.4)`,
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLSpanElement).style.color = `rgba(${accentRgb}, 1)`;
                (e.currentTarget as HTMLSpanElement).style.textDecorationColor = `rgba(${accentRgb}, 0.8)`;
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLSpanElement).style.color = `rgba(${accentRgb}, 0.9)`;
                (e.currentTarget as HTMLSpanElement).style.textDecorationColor = `rgba(${accentRgb}, 0.4)`;
              }}
            >
              {part.text}
            </span>
          </Tooltip>
        ) : (
          <span key={i}>{part.text}</span>
        )
      )}
    </div>
  );
}

// ─── Individual pillar card ───────────────────────────────────────────────────
function PillarCard({
  pillar,
  index,
  isExpanded,
  onToggle,
}: {
  pillar: (typeof philosophyPillars)[number];
  index: number;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  // Track whether a touch moved (scroll) so we don't fire toggle on scroll
  const touchMovedRef = useRef(false);
  const touchStartYRef = useRef(0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55, delay: index * 0.12, ease: [0.22, 1, 0.36, 1] }}
      className="group relative rounded-2xl overflow-visible"
      style={{
        background: "rgba(255,255,255,0.02)",
        border: `1px solid rgba(${pillar.accentRgb}, ${isExpanded ? "0.22" : "0.1"})`,
        transition: "border-color 0.3s ease",
      }}
    >
      {/* Hover / active glow */}
      <div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: `radial-gradient(320px circle at 0% 0%, rgba(${pillar.accentRgb}, 0.07) 0%, transparent 70%)`,
        }}
      />

      {/* Top accent bar */}
      <div
        className="absolute top-0 left-6 right-6 h-[1.5px] rounded-full"
        style={{
          background: `linear-gradient(90deg, ${pillar.accent}, transparent)`,
          opacity: isExpanded ? 0.9 : 0.5,
          transition: "opacity 0.3s ease",
        }}
      />

      <div className="relative z-10 p-6 md:p-7">

        {/* Tag + icon row */}
        <div className="flex items-center justify-between mb-5">
          <span
            className="font-mono text-[10px] tracking-[0.2em] uppercase"
            style={{ color: pillar.accent }}
          >
            {pillar.tag}
          </span>
          <span
            className="text-lg select-none"
            style={{ color: `rgba(${pillar.accentRgb}, 0.4)` }}
          >
            {pillar.icon}
          </span>
        </div>

        {/* Headline */}
        <h3 className="text-[18px] md:text-xl font-bold text-white tracking-tight leading-snug mb-1">
          {pillar.headline}
        </h3>
        <p
          className="font-mono text-[11px] mb-5"
          style={{ color: `rgba(${pillar.accentRgb}, 0.5)` }}
        >
          - {pillar.subtext}
        </p>

        {/* Body with inline tooltips */}
        <BodyWithTooltips
          parts={pillar.bodyParts as BodyPart[]}
          accentRgb={pillar.accentRgb}
        />

        {/* ── Expand toggle ── */}
        <div className="mt-6">
          <button
            className="flex items-center gap-2 font-mono text-[10px] tracking-widest uppercase transition-colors duration-200 group/btn"
            style={{ color: `rgba(${pillar.accentRgb}, 0.45)` }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.color = pillar.accent)
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.color = `rgba(${pillar.accentRgb}, 0.45)`)
            }
            onClick={(e) => {
              e.stopPropagation();
              onToggle();
            }}
            onTouchStart={(e) => {
              touchMovedRef.current = false;
              touchStartYRef.current = e.touches[0].clientY;
            }}
            onTouchMove={(e) => {
              if (Math.abs(e.touches[0].clientY - touchStartYRef.current) > 8) {
                touchMovedRef.current = true;
              }
            }}
            onTouchEnd={(e) => {
              if (touchMovedRef.current) return; // was a scroll, ignore
              e.stopPropagation();
              e.preventDefault();
              onToggle();
            }}
          >
            <motion.span
              animate={{ rotate: isExpanded ? 45 : 0 }}
              transition={{ duration: 0.2 }}
              className="inline-block text-base leading-none"
            >
              +
            </motion.span>
            {isExpanded ? "hide proof" : "real example"}
          </button>

          {/* ── Proof panel - only this card's expands ── */}
          <AnimatePresence initial={false}>
            {isExpanded && (
              <motion.div
                key="proof"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                className="overflow-hidden"
              >
                <div
                  className="mt-4 rounded-xl p-4"
                  style={{
                    background: `rgba(${pillar.accentRgb}, 0.04)`,
                    border: `1px solid rgba(${pillar.accentRgb}, 0.1)`,
                  }}
                >
                  {/* Their own quote */}
                  <p
                    className="text-[12px] font-mono italic mb-3 leading-relaxed"
                    style={{ color: `rgba(${pillar.accentRgb}, 0.75)` }}
                  >
                    "{pillar.quote}"
                  </p>

                  <div
                    className="h-px mb-3"
                    style={{ background: `rgba(${pillar.accentRgb}, 0.08)` }}
                  />

                  {/* Story */}
                  <p className="text-slate-500 text-[12px] leading-relaxed">
                    {pillar.proof}
                  </p>

                  {/* Label */}
                  <div className="mt-3 flex items-center gap-1.5">
                    <span
                      className="inline-block w-1.5 h-1.5 rounded-full"
                      style={{ background: pillar.accent }}
                    />
                    <span
                      className="font-mono text-[9px] tracking-wide"
                      style={{ color: `rgba(${pillar.accentRgb}, 0.4)` }}
                    >
                      {pillar.proofLabel}
                    </span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Section ──────────────────────────────────────────────────────────────────
export default function Philosophy() {
  // Only one card can be expanded at a time
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const handleToggle = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <section
      id="approach"
      className="w-full py-24 md:py-32 relative overflow-hidden"
    >
      {/* Faint grid */}
      <div
        className="absolute inset-0 opacity-[0.022] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(149,119,201,0.5) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(149,119,201,0.5) 1px, transparent 1px)`,
          backgroundSize: "72px 72px",
        }}
      />

      {/* Ambient glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 50% 30%, rgba(149,119,201,0.05) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-6 md:px-8">

        {/* Label */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="flex items-center gap-3 mb-12"
        >
          <span className="font-mono text-[10px] text-slate-500 tracking-[0.2em] uppercase">
            /approach
          </span>
          <div className="flex-1 h-px bg-white/[0.05]" />
        </motion.div>

        {/* Title */}
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
          className="text-3xl md:text-5xl font-bold tracking-tight leading-tight mb-4"
        >
          <span className="text-white">How I actually</span>
          <br />
          <span className="text-[#9577c9]">show up to work.</span>
        </motion.h2>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.18 }}
          className="text-slate-500 text-[14px] leading-relaxed max-w-2xl mb-16 font-light"
        >
          Not buzzwords. Three things I genuinely believe in, backed by real
          moments from real projects.{" "}
          <span className="text-slate-600 font-mono text-[11px]">
            hover the highlighted phrases · click a card to expand
          </span>
        </motion.p>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
          {philosophyPillars.map((pillar, i) => (
            <PillarCard
              key={pillar.id}
              pillar={pillar}
              index={i}
              isExpanded={expandedId === pillar.id}
              onToggle={() => handleToggle(pillar.id)}
            />
          ))}
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.5 }}
          className="mt-16 flex items-center gap-4"
        >
          <div className="flex-1 h-px bg-white/[0.04]" />
          <span className="font-mono text-[9px] text-slate-700 tracking-widest uppercase">
            soft skills, hard evidence
          </span>
          <div className="flex-1 h-px bg-white/[0.04]" />
        </motion.div>
      </div>
    </section>
  );
}