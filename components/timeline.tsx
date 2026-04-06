"use client";
import { useScroll, useTransform, motion, useInView } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";
import { getMeta, type TagColor, type TimelineEntry } from "@/data";

// ─── Inject styles client-side only to avoid SSR hydration mismatch ──────────
const COMMIT_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=Geist:wght@300;400;500;600;700&display=swap');

  .commit-mono { font-family: 'JetBrains Mono', 'Fira Code', monospace; }
  .commit-sans { font-family: 'Geist', 'Inter', sans-serif; }

  .commit-hash {
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px;
    letter-spacing: 0.04em;
    color: #58a6ff;
    opacity: 0.85;
  }

  .branch-pill {
    font-family: 'JetBrains Mono', monospace;
    font-size: 10px;
    padding: 1px 8px;
    border-radius: 9999px;
    border: 1px solid rgba(88,166,255,0.25);
    background: rgba(88,166,255,0.07);
    color: #79c0ff;
    white-space: nowrap;
  }

  .commit-card {
    background: linear-gradient(135deg, rgba(5,8,30,0.97) 0%, rgba(13,17,40,0.99) 100%);
    border: 1px solid rgba(48,54,80,0.9);
    border-radius: 10px;
    transition: border-color 0.25s ease, box-shadow 0.25s ease;
    position: relative;
    overflow: hidden;
  }

  .commit-card:hover {
    border-color: rgba(88,166,255,0.3);
    box-shadow: 0 0 0 1px rgba(88,166,255,0.1), 0 8px 32px rgba(0,0,0,0.4);
  }

  .commit-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent 0%, rgba(88,166,255,0.35) 50%, transparent 100%);
    opacity: 0;
    transition: opacity 0.25s;
  }
  .commit-card:hover::before { opacity: 1; }

  .diff-stat-add { color: #3fb950; font-family: 'JetBrains Mono', monospace; font-size: 11px; }
  .diff-stat-del { color: #f85149; font-family: 'JetBrains Mono', monospace; font-size: 11px; }

  .skill-chip {
    font-family: 'JetBrains Mono', monospace;
    font-size: 10px;
    padding: 2px 7px;
    border-radius: 4px;
    background: rgba(88,166,255,0.06);
    border: 1px solid rgba(88,166,255,0.12);
    color: rgba(139,148,158,0.9);
  }

  .timeline-line-glow {
    box-shadow: 0 0 8px rgba(88,166,255,0.4), 0 0 20px rgba(88,166,255,0.15);
  }

  .author-avatar {
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: linear-gradient(135deg, #7c3aed, #2563eb);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 9px;
    font-family: 'JetBrains Mono', monospace;
    color: white;
    flex-shrink: 0;
  }

  .commit-node {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    border: 2px solid #30363d;
    background: #0d1117;
    transition: border-color 0.25s, box-shadow 0.25s;
    flex-shrink: 0;
  }
  .commit-node.active {
    border-color: #58a6ff;
    box-shadow: 0 0 0 3px rgba(88,166,255,0.15);
  }

  @keyframes blink {
    0%, 100% { opacity: 1; }
    50% { opacity: 0; }
  }
  .cursor-blink { animation: blink 1.1s step-end infinite; }
`;

function useCommitStyles() {
  useEffect(() => {
    const id = "commit-timeline-styles";
    if (document.getElementById(id)) return;
    const tag = document.createElement("style");
    tag.id = id;
    tag.textContent = COMMIT_STYLES;
    document.head.appendChild(tag);
    return () => { document.getElementById(id)?.remove(); };
  }, []);
}

// ─── TAG COLOR MAP ────────────────────────────────────────────────────────────
const TAG_COLORS: Record<TagColor, string> = {
  purple: "bg-purple-500/10 text-purple-300 border-purple-500/25",
  blue:   "bg-blue-500/10 text-blue-300 border-blue-500/25",
  green:  "bg-emerald-500/10 text-emerald-300 border-emerald-500/25",
  orange: "bg-orange-500/10 text-orange-300 border-orange-500/25",
  pink:   "bg-pink-500/10 text-pink-300 border-pink-500/25",
};

// ─── Fake deterministic hash from title ──────────────────────────────────────
function fakeHash(title: string): string {
  let h = 0;
  for (let i = 0; i < title.length; i++) h = (Math.imul(31, h) + title.charCodeAt(i)) | 0;
  return Math.abs(h).toString(16).padStart(7, "0").slice(0, 7);
}

// ─── Fake diff stats ──────────────────────────────────────────────────────────
function fakeDiff(title: string): { add: number; del: number } {
  const seed = title.charCodeAt(0) + title.length;
  return { add: (seed * 13) % 800 + 100, del: (seed * 7) % 200 + 20 };
}

// ─── Fake short date from index ───────────────────────────────────────────────
const DATES = [
  "Sep 2021","Mar 2022","Jan 2023","Nov 2023",
  "Feb 2024","Jan 2025","Jun 2025","Sep 2026","Dec 2026",
];

// ─── Commit Card ──────────────────────────────────────────────────────────────
const CommitCard = ({
  item,
  index,
}: {
  item: TimelineEntry;
  index: number;
}) => {
  const meta = getMeta(item.title);
  const hash = fakeHash(item.title);
  const diff = fakeDiff(item.title);
  const date = DATES[index] ?? "2025";
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  // Extract a clean year/label for the commit subject line
  const titleParts = item.title.split(" - ");
  const year = titleParts[0];
  const subject = titleParts.slice(1).join(" - ") || item.title;

  // Branch name from first tag
  const branchName = meta.tags[0]
    ? meta.tags[0].label.toLowerCase().replace(/[^a-z0-9]/g, "-")
    : "main";

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -12 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1], delay: 0.05 }}
    >
      <div className="commit-card p-4 md:p-5">
        {/* ── Row 1: hash · branch · date ── */}
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="commit-hash">{hash}</span>
          <span className="text-[#30363d] commit-mono text-xs">·</span>
          <span className="branch-pill">⎇ {branchName}</span>
          <span className="text-[#30363d] commit-mono text-xs hidden sm:inline">·</span>
          <span className="commit-mono text-[10px] text-[#8b949e] hidden sm:inline">{date}</span>
          <span className="ml-auto text-xl select-none">{meta.emoji}</span>
        </div>

        {/* ── Row 2: commit subject ── */}
        <div className="flex items-start gap-2 mb-3">
          <span className="commit-mono text-[11px] text-[#6e7681] mt-0.5 shrink-0 select-none">
            feat({year}):
          </span>
          <h3
            className="commit-sans text-[15px] font-semibold text-[#e6edf3] leading-snug"
            style={{ letterSpacing: "-0.01em" }}
          >
            {subject}
          </h3>
        </div>

        {/* ── Row 3: body ── */}
        <p className="commit-sans text-[13px] text-[#8b949e] leading-relaxed font-light mb-4 border-l-2 border-[#21262d] pl-3">
          {item.content}
        </p>

        {/* ── Row 4: tags ── */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {meta.tags.map((t) => (
            <span
              key={t.label}
              className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium border tracking-wide commit-mono ${TAG_COLORS[t.color]}`}
            >
              {t.label}
            </span>
          ))}
        </div>

        {/* ── Row 5: skills + diff stats + link ── */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-[#21262d]">
          <div className="flex flex-wrap gap-1.5">
            {meta.skills.map((s) => (
              <span key={s} className="skill-chip">{s}</span>
            ))}
          </div>
          <div className="flex items-center gap-3 ml-auto">
            <span className="diff-stat-add">+{diff.add}</span>
            <span className="diff-stat-del">−{diff.del}</span>
            {item.link && (
              <a
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="commit-mono text-[10px] text-[#58a6ff] hover:text-[#79c0ff] transition-colors flex items-center gap-1"
              >
                View ↗
              </a>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// ─── Header bar (like GitHub's "X commits" header) ───────────────────────────
const RepoHeader = ({ count }: { count: number }) => (
  <div
    className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 mb-6 rounded-lg"
    style={{
      background: "rgba(5,8,30,0.8)",
      border: "1px solid rgba(48,54,80,0.9)",
    }}
  >
    <div className="flex items-center gap-3">
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M1.5 2.75C1.5 2.06 2.06 1.5 2.75 1.5h10.5c.69 0 1.25.56 1.25 1.25v10.5c0 .69-.56 1.25-1.25 1.25H2.75c-.69 0-1.25-.56-1.25-1.25V2.75z" stroke="#58a6ff" strokeWidth="1.2"/>
        <path d="M5 4.5v7M5 4.5l3 2 3-2" stroke="#58a6ff" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      <span className="commit-mono text-[12px] text-[#8b949e]">
        <span className="text-[#e6edf3] font-semibold">{count} commits</span>
        {" · "}
        <span className="text-[#58a6ff]">main</span>
        {" · "}
        <span>mahanthvamsi/journey</span>
      </span>
    </div>
    <div className="flex items-center gap-2">
      <div className="author-avatar">mv</div>
      <span className="commit-mono text-[11px] text-[#8b949e]">mahanthvamsi</span>
    </div>
  </div>
);

// ─── Single timeline item with scroll-driven scale + fade ────────────────────
const TimelineItem = ({
  item,
  index,
  total,
  progress,
}: {
  item: TimelineEntry;
  index: number;
  total: number;
  progress: any;
}) => {
  const targetScale = 1 - (total - index) * 0.04;
  const cardScale = useTransform(
    progress,
    [index / total, (index + 1) / total],
    [1, targetScale]
  );
  const opacity = useTransform(
    progress,
    [index / total, index / total + 0.04, (index + 1) / total - 0.08, (index + 1) / total],
    [1, 1, 0.8, 0]
  );

  return (
    <motion.div
      style={{ scale: cardScale, opacity, top: `${6 + index * 0.4}vh` }}
      className="sticky mb-3"
    >
      <div className="flex items-start gap-3">
        <div className="flex flex-col items-center shrink-0 mt-2">
          <div className={`commit-node ${index === 0 ? "active" : ""}`} />
        </div>
        <div className="flex-1 min-w-0">
          <CommitCard item={item} index={index} />
        </div>
      </div>
    </motion.div>
  );
};

// ─── Main export ──────────────────────────────────────────────────────────────
export const Timeline = ({ data }: { data: TimelineEntry[] }) => {
  const ref = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);
  useCommitStyles();

  useEffect(() => {
    if (ref.current) setHeight(ref.current.getBoundingClientRect().height);
  }, [ref]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 10%", "end 50%"],
  });

  const heightTransform = useTransform(scrollYProgress, [0, 1], [0, height]);
  const opacityTransform = useTransform(scrollYProgress, [0, 0.1], [0, 1]);

  // (no column split needed - single column layout)

  return (
    <>
      <div
        className="pb-2 md:pb-20 w-full bg-black-100 font-sans md:px-10"
        ref={containerRef}
        id="timeline"
      >
        {/* ── Page header ── */}
        <div className="max-w-6xl mx-auto px-4 md:px-8 lg:px-16 mb-8 pt-10">
          <div className="mb-2 flex items-center gap-2">
            <span className="commit-mono text-[11px] text-[#6e7681]">~/portfolio</span>
            <span className="commit-mono text-[11px] text-[#3fb950]">on</span>
            <span className="commit-mono text-[11px] text-[#58a6ff]">⎇ main</span>
          </div>

          <h1
            className="commit-sans text-4xl md:text-6xl font-bold text-[#e6edf3] mb-2 leading-tight"
            style={{ letterSpacing: "-0.03em" }}
          >
            git log{" "}
            <span className="commit-mono text-3xl md:text-5xl font-normal" style={{ color: "#58a6ff" }}>
              --my-journey
            </span>
          </h1>

          <p className="commit-sans text-[14px] text-[#8b949e] mb-6 flex items-center gap-1.5">
            <span className="commit-mono text-[#3fb950] text-xs">$</span>
            From{" "}
            <code className="commit-mono text-[12px] text-[#f0883e] bg-[#0a0d28] px-1.5 py-0.5 rounded">
              Hello World
            </code>{" "}
            to shipping production code
            <span className="cursor-blink commit-mono text-[#58a6ff] ml-0.5">█</span>
          </p>

          <RepoHeader count={data.length} />
        </div>

        {/* ── Commit list ── */}
        <div ref={ref} className="relative max-w-6xl mx-auto px-4 md:px-8 lg:px-16 pb-20 overflow-hidden">

          {/* Single column - all screen sizes */}
          <div className="flex flex-col">
            {data.map((item, index) => (
              <TimelineItem
                key={index}
                item={item}
                index={index}
                total={data.length}
                progress={scrollYProgress}
              />
            ))}
          </div>

          {/* Animated branch line */}
          <div
            className="absolute left-[20px] md:left-[28px] top-0 w-[2px] overflow-hidden"
            style={{
              height: height + "px",
              background: "linear-gradient(to bottom, transparent, #21262d 8%, #21262d 80%, transparent 100%)",
            }}
          >
            <motion.div
              style={{
                height: heightTransform,
                opacity: opacityTransform,
                background: "linear-gradient(to bottom, #58a6ff, #7c3aed 70%, transparent 95%)",
              }}
              className="absolute inset-x-0 top-0 w-[2px] timeline-line-glow rounded-full"
            />
          </div>
        </div>
      </div>
    </>
  );
};