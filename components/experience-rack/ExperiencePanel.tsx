// components/experience-rack/ExperiencePanel.tsx
"use client";

import React from "react";
import { motion } from "framer-motion";
import type { ExperiencePanelProps } from "./types";

export default function ExperiencePanel({ exp, onClose }: ExperiencePanelProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0  }}
      exit={{    opacity: 0, y: 8  }}
      transition={{ duration: 0.22, ease: "easeOut" }}
      style={{ fontFamily: "'JetBrains Mono', 'Fira Code', monospace" }}
      className="w-full"
    >
      {/* Status bar */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          {/* Status dot */}
          <motion.span
            className="inline-block w-1.5 h-1.5 rounded-full"
            style={{ background: exp.status === "current" ? "#4ade80" : "#60a5fa" }}
            animate={exp.status === "current" ? { opacity: [1, 0.3, 1] } : {}}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <span
            className="text-[9px] tracking-widest uppercase"
            style={{ color: exp.status === "current" ? "#4ade80" : "#60a5fa" }}
          >
            {exp.status === "current" ? "active" : "completed"}
          </span>
        </div>

        {/* Close */}
        <button
          onClick={onClose}
          className="text-slate-600 hover:text-slate-400 transition-colors duration-150 text-[13px] leading-none px-1"
          style={{ background: "none", border: "none", cursor: "pointer" }}
        >
          ✕
        </button>
      </div>

      {/* Role + Company */}
      <div className="mb-5">
        <h3 className="text-white text-xl md:text-2xl font-bold leading-tight tracking-tight mb-1">
          {exp.roleType}
        </h3>
        <div className="flex items-center gap-1.5">
          <span className="text-slate-500 text-[12px]">@</span>
          <span className="text-blue-400 text-[13px] font-medium">{exp.company}</span>
          <span className="text-slate-700 mx-1">·</span>
          <span className="text-slate-500 text-[11px]">{exp.duration}</span>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-white/[0.05] mb-4" />

      {/* Label */}
      <div className="text-[8px] text-slate-700 tracking-[0.18em] uppercase mb-3">
        system.summary
      </div>

      {/* Points */}
      <div className="flex flex-col gap-3 mb-5">
        {exp.points.map((point, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.08 + idx * 0.07, duration: 0.2 }}
            className="flex gap-3 group/pt"
          >
            <span className="text-slate-700 text-[9px] mt-[3px] shrink-0 tabular-nums">
              {String(idx + 1).padStart(2, "0")}
            </span>
            <p className="text-slate-400 text-[12px] leading-relaxed group-hover/pt:text-slate-200 transition-colors duration-200">
              {point}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Stack tags */}
      {exp.stack && exp.stack.length > 0 && (
        <>
          <div className="h-px bg-white/[0.05] mb-3" />
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap gap-1.5"
          >
            {exp.stack.map((tech) => (
              <span
                key={tech}
                className="text-[9px] px-2 py-0.5 rounded text-slate-500 border border-white/[0.06]"
                style={{ background: "rgba(255,255,255,0.03)" }}
              >
                {tech}
              </span>
            ))}
          </motion.div>
        </>
      )}

      {/* Metrics row */}
      {exp.metrics && exp.metrics.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
          className="mt-4 pt-4 border-t border-white/[0.05] grid grid-cols-2 gap-2"
        >
          {exp.metrics.map((m) => (
            <div key={m.label} className="flex flex-col gap-0.5">
              <span className="text-[8px] text-slate-700 tracking-wide">{m.label}</span>
              <span className="text-[11px] text-slate-300 font-medium">{m.value}</span>
            </div>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
}
