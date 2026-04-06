"use client";
import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ── Skills with categories ───────────────────────────────────────────────────
const skills = [
  { name: "Python",     bg: "#3572A5", fg: "#fff", abbr: "Py",  cat: "Languages" },
  { name: "Java",       bg: "#b07219", fg: "#fff", abbr: "Ja",  cat: "Languages" },
  { name: "TypeScript", bg: "#3178c6", fg: "#fff", abbr: "TS",  cat: "Languages" },
  { name: "JavaScript", bg: "#f7df1e", fg: "#000", abbr: "JS",  cat: "Languages" },
  { name: "React",      bg: "#149eca", fg: "#fff", abbr: "Re",  cat: "Frontend"  },
  { name: "Next.js",    bg: "#ffffff", fg: "#000", abbr: "Nx",  cat: "Frontend"  },
  { name: "Tailwind",   bg: "#38bdf8", fg: "#000", abbr: "TW",  cat: "Frontend"  },
  { name: "Node.js",    bg: "#3c873a", fg: "#fff", abbr: "No",  cat: "Backend"   },
  { name: "FastAPI",    bg: "#009688", fg: "#fff", abbr: "FA",  cat: "Backend"   },
  { name: "Flask",      bg: "#555",    fg: "#fff", abbr: "Fl",  cat: "Backend"   },
  { name: "MySQL",      bg: "#4479a1", fg: "#fff", abbr: "My",  cat: "Backend"   },
  { name: "MongoDB",    bg: "#47a248", fg: "#fff", abbr: "Mo",  cat: "Backend"   },
  { name: "Prisma",     bg: "#0c3249", fg: "#fff", abbr: "Pr",  cat: "Backend"   },
  { name: "AWS",        bg: "#ff9900", fg: "#000", abbr: "AWS", cat: "Cloud"     },
  { name: "Docker",     bg: "#2496ed", fg: "#fff", abbr: "Dk",  cat: "Cloud"     },
  { name: "Git",        bg: "#f05032", fg: "#fff", abbr: "Git", cat: "Cloud"     },
];

const SKILL_CATS = ["All", "Languages", "Frontend", "Backend", "Cloud"] as const;

// ── App definitions ──────────────────────────────────────────────────────────
const APPS = {
  bio:    { id: "bio",    title: "About_Me.txt",  icon: "📝", defaultPos: { x: 24,  y: 48  } },
  skills: { id: "skills", title: "Tech_Stack",    icon: "💻", defaultPos: { x: 390, y: 48  } },
  edu:    { id: "edu",    title: "Education.md",  icon: "🎓", defaultPos: { x: 140, y: 230 } },
};

type AppId = keyof typeof APPS;
type WinState = "normal" | "minimized" | "maximized";

// ── Live clock ───────────────────────────────────────────────────────────────
function Clock() {
  const [time, setTime] = useState("");
  useEffect(() => {
    const fmt = () =>
      new Date().toLocaleTimeString("en-IE", { hour: "2-digit", minute: "2-digit", hour12: false });
    setTime(fmt());
    const id = setInterval(() => setTime(fmt()), 10000);
    return () => clearInterval(id);
  }, []);
  return <span>{time}</span>;
}

// ── Main ─────────────────────────────────────────────────────────────────────
export default function Grid() {
  const desktopRef = useRef<HTMLDivElement>(null);

  const [openApps, setOpenApps] = useState<Record<string, boolean>>(
    { bio: true, skills: true, edu: false }
  );
  const [winState, setWinState] = useState<Record<string, WinState>>(
    { bio: "normal", skills: "normal", edu: "normal" }
  );
  const [zTop, setZTop] = useState(10);
  const [zMap, setZMap] = useState<Record<string, number>>({ bio: 2, skills: 3, edu: 1 });

  const focusWindow = (id: string) => {
    const next = zTop + 1;
    setZTop(next);
    setZMap(prev => ({ ...prev, [id]: next }));
  };

  const openApp = (id: string) => {
    setOpenApps(prev => ({ ...prev, [id]: true }));
    setWinState(prev => ({ ...prev, [id]: "normal" }));
    focusWindow(id);
  };

  const closeApp  = (id: string) => setOpenApps(prev => ({ ...prev, [id]: false }));

  const toggleWinState = (id: string, state: WinState) => {
    setWinState(prev => ({ ...prev, [id]: prev[id] === state ? "normal" : state }));
    if (state !== "minimized") focusWindow(id);
  };

  const toggleDock = (id: string) => {
    // Closed → open fresh
    if (!openApps[id]) { openApp(id); return; }
    // Minimized → restore and focus
    if (winState[id] === "minimized") {
      setWinState(prev => ({ ...prev, [id]: "normal" }));
      focusWindow(id);
      return;
    }
    // Open & already on top → minimize (exactly like macOS)
    if (zMap[id] === zTop) {
      setWinState(prev => ({ ...prev, [id]: "minimized" }));
      return;
    }
    // Open but behind another window → bring to front
    focusWindow(id);
  };

  const isVisible = (id: string) => openApps[id] && winState[id] !== "minimized";

  return (
    <section id="about" className="w-full py-20 px-4 md:px-8 max-w-6xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight">
          My <span className="text-[#9577c9]">Workspace</span>
        </h2>
        <p className="text-sm text-[#8b949e] hidden md:block select-none">Drag the windows ↓</p>
      </div>

      {/* Desktop */}
      <div
        ref={desktopRef}
        className="relative w-full rounded-2xl overflow-hidden border border-white/10 shadow-2xl select-none"
        style={{
          height: "clamp(560px, 70vh, 720px)",
          background: "radial-gradient(ellipse at 60% -10%, rgba(203,172,249,0.12) 0%, rgb(4,7,29) 55%), rgb(4,7,29)",
        }}
      >
        {/* Grid texture */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.5) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.5) 1px,transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        {/* Menu bar */}
        <div className="absolute top-0 inset-x-0 h-7 bg-black/40 backdrop-blur-md border-b border-white/[0.06] flex items-center px-4 gap-5 z-50">
          <span className="text-white/90 font-bold text-xs">⬡ mahanthvamsi</span>
          <span className="text-white/40 text-xs">File</span>
          <span className="text-white/40 text-xs">Edit</span>
          <span className="text-white/40 text-xs">View</span>
          <div className="ml-auto flex items-center gap-3 text-white/50 text-xs">
            <span>🔋 54%</span>
            <span>🛜</span>
            <Clock />
          </div>
        </div>

        {/* Windows */}
        <AnimatePresence>
          {isVisible("bio") && (
            <AppWindow
              app={APPS.bio} z={zMap.bio} desktopRef={desktopRef}
              winState={winState.bio as WinState}
              onFocus={() => focusWindow("bio")}
              onClose={() => closeApp("bio")}
              onMinimize={() => toggleWinState("bio", "minimized")}
              onMaximize={() => toggleWinState("bio", "maximized")}
            >
              <BioContent />
            </AppWindow>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {isVisible("skills") && (
            <AppWindow
              app={APPS.skills} z={zMap.skills} desktopRef={desktopRef}
              winState={winState.skills as WinState}
              onFocus={() => focusWindow("skills")}
              onClose={() => closeApp("skills")}
              onMinimize={() => toggleWinState("skills", "minimized")}
              onMaximize={() => toggleWinState("skills", "maximized")}
            >
              <SkillsContent />
            </AppWindow>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {isVisible("edu") && (
            <AppWindow
              app={APPS.edu} z={zMap.edu} desktopRef={desktopRef}
              winState={winState.edu as WinState}
              onFocus={() => focusWindow("edu")}
              onClose={() => closeApp("edu")}
              onMinimize={() => toggleWinState("edu", "minimized")}
              onMaximize={() => toggleWinState("edu", "maximized")}
            >
              <EduContent />
            </AppWindow>
          )}
        </AnimatePresence>

        {/* Dock */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-5 py-2.5 rounded-2xl bg-white/[0.08] backdrop-blur-xl border border-white/[0.12] flex gap-5 shadow-2xl z-50">
          {(Object.values(APPS) as typeof APPS[AppId][]).map((app) => (
            <button
              key={app.id}
              onClick={() => toggleDock(app.id)}
              className="relative group flex flex-col items-center w-12 transition-all duration-200 hover:-translate-y-2"
              title={app.title}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shadow-lg transition-all duration-200 group-hover:scale-110"
                style={{
                  background: "linear-gradient(135deg,rgba(255,255,255,0.12),rgba(255,255,255,0.04))",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
              >
                {app.icon}
              </div>
              {openApps[app.id] && (
                <div className={`absolute -bottom-1.5 w-1 h-1 rounded-full ${winState[app.id] === "minimized" ? "bg-yellow-400" : "bg-white/70"}`} />
              )}
              <span className="absolute -top-9 px-2.5 py-1 bg-black/80 text-white/90 text-[10px] rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none border border-white/10">
                {winState[app.id] === "minimized" ? `↑ ${app.title}` : app.title}
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Window Shell ─────────────────────────────────────────────────────────────
function AppWindow({
  app, z, desktopRef, winState, onFocus, onClose, onMinimize, onMaximize, children,
}: {
  app: typeof APPS[AppId];
  z: number;
  desktopRef: React.RefObject<HTMLDivElement>;
  winState: WinState;
  onFocus: () => void;
  onClose: () => void;
  onMinimize: () => void;
  onMaximize: () => void;
  children: React.ReactNode;
}) {
  const isMax = winState === "maximized";

  // Maximized: fill desktop minus menu bar
  const maxStyle: React.CSSProperties = isMax
    ? { position: "absolute", left: 0, top: 28, width: "100%", height: "calc(100% - 68px)", borderRadius: 0 }
    : {};

  return (
    <motion.div
      drag={!isMax}
      dragConstraints={desktopRef}
      dragMomentum={false}
      dragElastic={0}
      initial={{ opacity: 0, scale: 0.88, y: 16 }}
      animate={
        isMax
          ? { opacity: 1, scale: 1, y: 0 }
          : { opacity: 1, scale: 1, y: 0 }
      }
      exit={{ opacity: 0, scale: 0.88, y: 16, transition: { duration: 0.15 } }}
      transition={{ type: "spring", stiffness: 320, damping: 28 }}
      onPointerDown={onFocus}
      style={{
        zIndex: z,
        position: "absolute",
        left: isMax ? 0 : app.defaultPos.x,
        top:  isMax ? 28 : app.defaultPos.y + 28,
        width: isMax ? "100%" : undefined,
        height: isMax ? "calc(100% - 68px)" : undefined,
        borderRadius: isMax ? 0 : undefined,
        ...maxStyle,
      }}
      className={`flex flex-col overflow-hidden shadow-2xl ${isMax ? "" : "w-[300px] md:w-[420px] rounded-xl"}`}
      whileTap={!isMax ? { cursor: "grabbing" } : {}}
    >
      {/* Chrome */}
      <div
        className={`h-9 flex items-center justify-between px-3 flex-shrink-0 ${!isMax ? "cursor-grab active:cursor-grabbing" : ""}`}
        style={{ background: "rgba(40,40,50,0.97)", borderBottom: "1px solid rgba(255,255,255,0.08)" }}
        onDoubleClick={onMaximize}
      >
        {/* Traffic lights */}
        <div className="flex gap-1.5 items-center">
          {/* Red – close */}
          <button
            onPointerDown={e => e.stopPropagation()}
            onClick={e => { e.stopPropagation(); onClose(); }}
            className="w-3 h-3 rounded-full bg-[#ff5f56] hover:brightness-110 transition-all flex items-center justify-center group"
          >
            <svg className="opacity-0 group-hover:opacity-100 w-1.5 h-1.5" viewBox="0 0 8 8" fill="none" stroke="#000" strokeWidth="1.5">
              <path d="M1 1l6 6M7 1L1 7"/>
            </svg>
          </button>
          {/* Yellow – minimize */}
          <button
            onPointerDown={e => e.stopPropagation()}
            onClick={e => { e.stopPropagation(); onMinimize(); }}
            className="w-3 h-3 rounded-full bg-[#ffbd2e] hover:brightness-110 transition-all flex items-center justify-center group"
          >
            <svg className="opacity-0 group-hover:opacity-100 w-2 h-0.5" viewBox="0 0 8 2" fill="none" stroke="#000" strokeWidth="1.5">
              <path d="M1 1h6"/>
            </svg>
          </button>
          {/* Green – maximize */}
          <button
            onPointerDown={e => e.stopPropagation()}
            onClick={e => { e.stopPropagation(); onMaximize(); }}
            className="w-3 h-3 rounded-full bg-[#27c93f] hover:brightness-110 transition-all flex items-center justify-center group"
          >
            <svg className="opacity-0 group-hover:opacity-100 w-2 h-2" viewBox="0 0 8 8" fill="none" stroke="#000" strokeWidth="1.2">
              <path d="M1 4h6M4 1v6"/>
            </svg>
          </button>
        </div>

        <span className="text-[11px] text-white/40 font-medium select-none">
          {app.icon} {app.title}{isMax ? " - maximized" : ""}
        </span>
        <div className="w-14" />
      </div>

      {/* Content */}
      <div
        className="flex-1 overflow-hidden"
        style={{
          maxHeight: isMax ? "100%" : 380,
          background: "rgba(12,14,35,0.98)",
          height: isMax ? "100%" : undefined,
        }}
      >
        {children}
      </div>
    </motion.div>
  );
}

// ── Bio Content - prose text file ────────────────────────────────────────────
function BioContent() {
  return (
    <div
      className="h-full overflow-y-auto"
      style={{ maxHeight: "inherit" }}
    >
      {/* Text editor toolbar */}
      <div className="flex items-center gap-3 px-4 py-1.5 border-b border-white/[0.05] bg-black/20">
        <span className="text-[10px] text-white/25 font-mono">About_Me.txt</span>
        <span className="ml-auto text-[10px] text-white/20 font-mono">Plain Text · UTF-8</span>
      </div>

      {/* Line-numbered prose */}
      <div className="flex font-mono text-[12.5px] leading-[1.75rem]">
        {/* Line numbers */}
        <div className="select-none text-right text-[11px] text-[#4a5270] border-r border-white/[0.05] bg-black/20 flex-shrink-0 px-3 pt-4 pb-4 min-w-[36px]">
          {Array.from({ length: 22 }, (_, i) => (
            <div key={i}>{i + 1}</div>
          ))}
        </div>

        {/* Content */}
        <div className="px-5 pt-4 pb-4 flex-1 overflow-x-hidden">
          <p className="text-[#565f89] mb-1">{`================================================================`}</p>
          <p className="text-[#cbacf9] font-semibold">  MAHANTH VAMSI KATRAGUNTA</p>
          <p className="text-[#565f89]">{`================================================================`}</p>
          <p className="text-transparent select-none">{"."}</p>

          <p className="text-[#c1c2d3]">
            Hi! I&apos;m a <span className="text-[#9ece6a]">full-stack developer</span> and
            Computer Science graduate student at the{" "}
            <span className="text-[#7dcfff]">University College Dublin</span>.
          </p>
          <p className="text-transparent select-none">{"."}</p>

          <p className="text-[#c1c2d3]">
            My focus is building <span className="text-[#9ece6a]">production-ready</span>{" "}
            web applications - from scalable backend APIs to polished, responsive
            frontends. I care deeply about clean code and good UX.
          </p>
          <p className="text-transparent select-none">{"."}</p>

          <p className="text-[#c1c2d3]">
            I&apos;ve interned at <span className="text-[#ff9e64]">CFT Ventures</span>{" "}
            (React, production UI) and <span className="text-[#ff9e64]">BHEL</span>{" "}
            (full-stack HR system, ~60% efficiency gain). I also published ML
            research at <span className="text-[#cbacf9]">IITCEE &apos;25</span>.
          </p>
          <p className="text-transparent select-none">{"."}</p>

          <p className="text-[#565f89]">{`----------------------------------------------------------------`}</p>
          <p className="text-[#c1c2d3]">
            <span className="text-[#cbacf9]">Location :</span>{" "}
            Dublin, Ireland 🇮🇪
          </p>
          <p className="text-[#c1c2d3]">
            <span className="text-[#cbacf9]">Status   :</span>{" "}
            <span className="text-[#34d399]">Open to opportunities</span>
          </p>
          {/* <p className="text-[#c1c2d3]">
            <span className="text-[#cbacf9]">Remote   :</span>{" "}
            <span className="text-[#ff9e64]">true</span>
          </p> */}
          <p className="text-[#c1c2d3]">
            <span className="text-[#cbacf9]">Email    :</span>{" "}
            <a href="mailto:mahanthvamsis1@gmail.com" className="text-[#9ece6a]">mahanthvamsis1@gmail.com</a>
          </p>
          <p className="text-[#565f89]">{`----------------------------------------------------------------`}</p>
          <p className="text-transparent select-none">{"."}</p>
          <p className="text-[#565f89] italic">{`# Football captain · 300+ members event organiser · Fast learner`}</p>
        </div>
      </div>
    </div>
  );
}

// ── Skills Content - filtered Finder view ────────────────────────────────────
function SkillsContent() {
  const [activecat, setActiveCat] = useState<string>("All");
  const [hovered, setHovered] = useState<string | null>(null);

  const filtered = activecat === "All"
    ? skills
    : skills.filter(s => s.cat === activecat);

  return (
    <div className="h-full flex overflow-hidden" style={{ maxHeight: "inherit" }}>
      {/* Sidebar */}
      <div className="w-28 flex-shrink-0 border-r border-white/[0.06] bg-black/20 flex flex-col gap-0.5 p-2 pt-3">
        <p className="text-[9px] text-white/20 uppercase tracking-widest px-2 mb-1 font-mono">Filter</p>
        {SKILL_CATS.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCat(cat)}
            className={`text-left px-2.5 py-1.5 rounded-md text-[11px] transition-all font-mono ${
              activecat === cat
                ? "bg-[#cbacf9]/15 text-[#cbacf9] border border-[#cbacf9]/25"
                : "text-white/45 hover:bg-white/[0.05] hover:text-white/75 border border-transparent"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="flex-1 p-3 overflow-y-auto">
        <p className="text-[9.5px] text-white/20 font-mono mb-2 px-1">
          {filtered.length} item{filtered.length !== 1 ? "s" : ""}
        </p>
        <motion.div
          key={activecat}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.18 }}
          className="grid grid-cols-4 gap-2"
        >
          {filtered.map((s) => (
            <motion.div
              key={s.name}
              onHoverStart={() => setHovered(s.name)}
              onHoverEnd={() => setHovered(null)}
              whileHover={{ scale: 1.1, y: -3 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
              className="flex flex-col items-center gap-1.5 p-2 rounded-lg cursor-default hover:bg-white/[0.05] transition-colors"
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-[11px] font-bold shadow-md transition-all duration-200"
                style={{
                  background: s.bg,
                  color: s.fg,
                  boxShadow: hovered === s.name ? `0 0 16px ${s.bg}70` : `0 2px 8px rgba(0,0,0,0.4)`,
                }}
              >
                {s.abbr}
              </div>
              <span className="text-[9.5px] text-white/55 text-center leading-tight">{s.name}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

// ── Education Content ────────────────────────────────────────────────────────
function EduContent() {
  return (
    <div className="p-5 flex flex-col gap-4 overflow-y-auto h-full">
      <div className="rounded-xl overflow-hidden border border-white/[0.08]">
        <div
          className="px-4 py-3 flex items-center gap-3"
          style={{ background: "linear-gradient(90deg,rgba(203,172,249,0.15),rgba(122,162,247,0.08))" }}
        >
          <span className="text-2xl">🇮🇪</span>
          <div>
            <div className="font-semibold text-white text-sm leading-tight">M.Sc. Computer Science</div>
            <div className="text-[11px] text-[#cbacf9]">University College Dublin</div>
          </div>
          <div className="ml-auto text-[10px] text-white/40 whitespace-nowrap">2025–2026</div>
        </div>
        <div className="px-4 py-3 bg-black/20">
          <div className="flex flex-wrap gap-1.5">
            {["Software Engineering", "AI / ML", "Cloud Computing", "Distributed Systems"].map(t => (
              <span key={t} className="px-2 py-0.5 bg-[#cbacf9]/10 border border-[#cbacf9]/20 rounded text-[10px] text-[#cbacf9]">{t}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-xl overflow-hidden border border-white/[0.08]">
        <div
          className="px-4 py-3 flex items-center gap-3"
          style={{ background: "linear-gradient(90deg,rgba(255,158,100,0.12),rgba(247,118,142,0.06))" }}
        >
          <span className="text-2xl">🇮🇳</span>
          <div>
            <div className="font-semibold text-white text-sm leading-tight">B.Tech Information Technology</div>
            <div className="text-[11px] text-[#ff9e64]">SRM Institute of Science & Technology</div>
          </div>
          <div className="ml-auto text-[10px] text-white/40 whitespace-nowrap">2021–2025</div>
        </div>
        <div className="px-4 py-3 bg-black/20">
          <div className="flex flex-wrap gap-1.5">
            {["DSA", "OOP", "Networks", "Operating Systems", "Software Engineering"].map(t => (
              <span key={t} className="px-2 py-0.5 bg-[#ff9e64]/10 border border-[#ff9e64]/20 rounded text-[10px] text-[#ff9e64]">{t}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-start gap-3 p-3 rounded-lg bg-white/[0.03] border border-white/[0.06]">
        <span className="text-lg flex-shrink-0">📄</span>
        <div>
          <div className="text-[11px] text-white/70 font-medium">Published Research</div>
          <div className="text-[10.5px] text-white/40 mt-0.5 leading-relaxed">
            Evaluation of ML Approaches for Cirrhosis Survival Prediction -{" "}
            <span className="text-[#cbacf9]">IITCEE &apos;25</span>
          </div>
        </div>
      </div>
    </div>
  );
}