import React from "react";

// ─── Navigation ───────────────────────────────────────────────────────────────
export const navItems = [
  { name: "About",      link: "#about"      },
  { name: "Timeline",   link: "#timeline"   },
  { name: "Projects",   link: "#projects"   },
  { name: "Experience", link: "#experience" },
  { name: "Approach",    link: "#approach"    },
  // { name: "Contact",    link: "#contact"    },
];

// ─── Grid Items ───────────────────────────────────────────────────────────────
export const gridItems = [
  {
    id: 1,
    title: "I prioritize client collaboration, fostering open communication ",
    description: "",
    className: "lg:col-span-3 md:col-span-6 md:row-span-4 lg:min-h-[60vh]",
    imgClassName: "w-full h-full",
    titleClassName: "justify-end",
    img: "/b1.svg",
    spareImg: "",
  },
  {
    id: 2,
    title: "I'm very flexible with time zone communications",
    description: "",
    className: "lg:col-span-2 md:col-span-3 md:row-span-2",
    imgClassName: "",
    titleClassName: "justify-start",
    img: "",
    spareImg: "",
  },
  {
    id: 3,
    title: "My tech stack",
    description: "I constantly try to improve",
    className: "lg:col-span-2 md:col-span-3 md:row-span-2",
    imgClassName: "",
    titleClassName: "justify-center",
    img: "",
    spareImg: "",
  },
  {
    id: 4,
    title: "Tech enthusiast with a passion for development.",
    description: "",
    className: "lg:col-span-2 md:col-span-3 md:row-span-1",
    imgClassName: "",
    titleClassName: "justify-start",
    img: "/grid.svg",
    spareImg: "/b4.svg",
  },
  {
    id: 5,
    title: "Currently building a JS Animation library",
    description: "The Inside Scoop",
    className: "md:col-span-3 md:row-span-2",
    imgClassName: "absolute right-0 bottom-0 md:w-96 w-60",
    titleClassName: "justify-center md:justify-start lg:justify-center",
    img: "/b5.svg",
    spareImg: "/grid.svg",
  },
  {
    id: 6,
    title: "Do you want to start a project together?",
    description: "",
    className: "lg:col-span-2 md:col-span-3 md:row-span-1",
    imgClassName: "",
    titleClassName: "justify-center md:max-w-full max-w-60 text-center",
    img: "",
    spareImg: "",
  },
];

// ─── Testimonials ─────────────────────────────────────────────────────────────
export const testimonials = [
  {
    quote:
      "Collaborating with Adrian was an absolute pleasure. His professionalism, promptness, and dedication to delivering exceptional results were evident throughout our project. Adrian's enthusiasm for every facet of development truly stands out. If you're seeking to elevate your website and elevate your brand, Adrian is the ideal partner.",
    name: "Michael Johnson",
    title: "Director of AlphaStream Technologies",
  },
  {
    quote:
      "Collaborating with Adrian was an absolute pleasure. His professionalism, promptness, and dedication to delivering exceptional results were evident throughout our project. Adrian's enthusiasm for every facet of development truly stands out. If you're seeking to elevate your website and elevate your brand, Adrian is the ideal partner.",
    name: "Michael Johnson",
    title: "Director of AlphaStream Technologies",
  },
  {
    quote:
      "Collaborating with Adrian was an absolute pleasure. His professionalism, promptness, and dedication to delivering exceptional results were evident throughout our project. Adrian's enthusiasm for every facet of development truly stands out. If you're seeking to elevate your website and elevate your brand, Adrian is the ideal partner.",
    name: "Michael Johnson",
    title: "Director of AlphaStream Technologies",
  },
  {
    quote:
      "Collaborating with Adrian was an absolute pleasure. His professionalism, promptness, and dedication to delivering exceptional results were evident throughout our project. Adrian's enthusiasm for every facet of development truly stands out. If you're seeking to elevate your website and elevate your brand, Adrian is the ideal partner.",
    name: "Michael Johnson",
    title: "Director of AlphaStream Technologies",
  },
  {
    quote:
      "Collaborating with Adrian was an absolute pleasure. His professionalism, promptness, and dedication to delivering exceptional results were evident throughout our project. Adrian's enthusiasm for every facet of development truly stands out. If you're seeking to elevate your website and elevate your brand, Adrian is the ideal partner.",
    name: "Michael Johnson",
    title: "Director of AlphaStream Technologies",
  },
];

// ─── Companies ────────────────────────────────────────────────────────────────
export const companies = [
  { id: 1, name: "cloudinary", img: "/cloud.svg",  nameImg: "/cloudName.svg"  },
  { id: 2, name: "appwrite",   img: "/app.svg",    nameImg: "/appName.svg"    },
  { id: 3, name: "HOSTINGER",  img: "/host.svg",   nameImg: "/hostName.svg"   },
  { id: 4, name: "stream",     img: "/s.svg",      nameImg: "/streamName.svg" },
  { id: 5, name: "docker.",    img: "/dock.svg",   nameImg: "/dockerName.svg" },
];
export const workExperience = [
  {
    id: 1,
    roleType: "SOFTWARE DEVELOPER INTERN",
    company: "BHEL",
    duration: "Dec 2023 – Jan 2024",
    location: "Chennai, India",
    desc: "Built production systems for one of India's largest public sector enterprises, focused on HR automation and facility operations.",
    thumbnail: "/bhel.png",
    iconBg: "#243b55",
    tech: ["Java", "MySQL", "JSP", "OOP", "SQL"],
    points: [
      "Architected a full-stack Employee Management System that eliminated 60% of manual HR processing time across a 200+ employee organization",
      "Restructured SQL schemas and rewrote 12 critical queries, cutting average data retrieval time by 40% and improving system reliability",
      "Built a Building Management dashboard visualizing 6 operational KPIs, enabling faster data-driven decisions for facility teams",
    ],
  },
  {
    id: 2,
    roleType: "WEB DEVELOPER INTERN",
    company: "CFT Ventures",
    duration: "Jan 2025 – Apr 2025",
    location: "Chennai, India",
    desc: "Contributed to frontend architecture and performance across core product modules in a cross-functional team.",
    thumbnail: "/cft.png",
    iconBg: "#171f2a",
    tech: ["React", "Tailwind CSS", "JavaScript"],
    points: [
      "Engineered 15+ reusable React components across 5 internal modules, reducing duplicated frontend code by 30% and accelerating development velocity",
      "Diagnosed and resolved 8 frontend performance bottlenecks through systematic profiling, improving page load responsiveness by 25%",
      "Collaborated with a 6-member cross-functional team across design, backend, and QA to ship features aligned with product and reliability standards",
    ],
  },
];

// ─── Social Media ─────────────────────────────────────────────────────────────
export const socialMedia = [
  {
    id: 1,
    img: "/git.svg",
    label: "GitHub",
    href: "https://github.com/mahanthvamsi",
  },
  {
    id: 2,
    img: "/link.svg",
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/mahanthvamsi/",
  },
];

// ─── Timeline Types ───────────────────────────────────────────────────────────
export type TagColor = "purple" | "blue" | "green" | "orange" | "pink";

export interface TimelineTag {
  label: string;
  color: TagColor;
}

export interface TimelineMeta {
  emoji: string;
  accent: string;
  tags: TimelineTag[];
  skills: string[];
}

export interface TimelineEntry {
  title: string;
  content: React.ReactNode;
  link?: string;
}

// ─── Timeline META ────────────────────────────────────────────────────────────
export const META: Record<string, TimelineMeta> = {
  "2021": {
    emoji: "🚀",
    accent: "#7c3aed",
    tags: [
      { label: "SRM IST",  color: "purple" },
      { label: "B.Tech IT", color: "blue"  },
    ],
    skills: ["C", "HTML", "VS Code"],
  },
  "2022": {
    emoji: "🐛",
    accent: "#2563eb",
    tags: [
      { label: "Web Dev", color: "blue"  },
      { label: "Python",  color: "green" },
    ],
    skills: ["HTML", "CSS", "JS", "Python", "Java", "Git"],
  },
  "2023 - Touching": {
    emoji: "🛠️",
    accent: "#0891b2",
    tags: [
      { label: "ML / CV",       color: "blue"  },
      { label: "First Project", color: "green" },
    ],
    skills: ["Python", "OpenCV", "NumPy", "GitHub"],
  },
  "2023 - Intern": {
    emoji: "🏭",
    accent: "#d97706",
    tags: [
      { label: "BHEL",        color: "orange" },
      { label: "Internship",  color: "blue"   },
    ],
    skills: ["Java", "MySQL", "JSP", "SQL"],
  },
  "2024": {
    emoji: "⚛️",
    accent: "#059669",
    tags: [
      { label: "Full Stack", color: "green" },
      { label: "React",      color: "blue"  },
    ],
    skills: ["React", "Next.js", "TypeScript", "Tailwind", "Node.js"],
  },
  "2025 - Web": {
    emoji: "💼",
    accent: "#7c3aed",
    tags: [
      { label: "CFT Ventures", color: "purple" },
      { label: "Intern",       color: "blue"   },
    ],
    skills: ["React", "Next.js", "TypeScript", "Figma"],
  },
  "2025 - Building": {
    emoji: "🤖",
    accent: "#db2777",
    tags: [
      { label: "AI Apps",  color: "pink"   },
      { label: "Personal", color: "purple" },
    ],
    skills: ["Next.js", "OpenAI", "WebSockets", "PostgreSQL"],
  },
  "2026": {
    emoji: "🎓",
    accent: "#0891b2",
    tags: [
      { label: "M.Sc CS",     color: "blue"  },
      { label: "UCD Ireland", color: "green" },
    ],
    skills: ["Cloud", "Distributed Systems", "AI/ML"],
  },
  "Future": {
    emoji: "⏳",
    accent: "#6d28d9",
    tags: [
      { label: "SDE",       color: "purple" },
      { label: "Loading…",  color: "pink"   },
    ],
    skills: ["Scalable Architecture", "Advanced AI", "Cloud Infrastructure"],
  },
};

// ─── getMeta helper ───────────────────────────────────────────────────────────
export function getMeta(title: string): TimelineMeta {
  for (const key of Object.keys(META)) {
    if (title.startsWith(key)) return META[key];
  }
  return { emoji: "📌", accent: "#7c3aed", tags: [], skills: [] };
}

// ─── Timeline Data ────────────────────────────────────────────────────────────
export const timelineData: TimelineEntry[] = [
  {
    title: "2021 - Started the Tech Grind",
    content:
      "Joined SRM IST with big dreams, zero clue, and a laptop that sounded like it was preparing for takeoff. Wrote my first 'Hello World' and felt like a hacker. Little did I know missing semicolons would haunt me for years.",
  },
  {
    title: "2022 - The Skill Issue Era",
    content:
      "Spent an unhealthy amount of time debugging code that didn't work because I 'forgot to save the file.' Explored web development, Python, Java, and became a regular citizen of StackOverflow.",
  },
  {
    title: "2023 - Touching Real Code",
    content:
      "Built my first fully working projects - a traffic sign detection system, and some experiments that should not have worked but did. Learned that `npm install` can either make your day or ruin it.",
    link: "https://github.com/mahanthvamsi/Traffic-Sign-Board-Detection",
  },
  {
    title: "2023 - Intern at BHEL",
    content:
      "Worked as a Software Developer Intern at BHEL. Built an Employee Management System. Realized two things: SQL errors are silent judgment, and corporates love Excel sheets more than anything else.",
  },
  {
    title: "2024 - The 'I Know What I'm Doing' Phase",
    content:
      "Refined my full-stack skills. Started loving React, Next.js, and Tailwind (except when it breaks). Began solving real-world problems with cleaner architecture and fewer emotional breakdowns.",
  },
  {
    title: "2025 - Web Developer @ CFT Ventures",
    content:
      "Interned as a Web Developer - built components, fixed bugs, optimized UI. Mastered the art of saying 'It works on my machine.' Started writing production-quality features.",
  },
  {
    title: "2025 - Building My Personal Projects",
    content:
      "Created AI-powered finance apps, real-time systems, and more. Writing cleaner code, better UIs, and significantly fewer console.logs() - progress.",
    link: "https://github.com/mahanthvamsi/welth",
  },
  {
    title: "2026 - The Big Leap",
    content:
      "Pursuing my Masters in Computer Science at UCD - leveling up in Software Engineering, AI, and Cloud. Preparing to build scalable systems (and occasionally break them accidentally).",
  },
  {
    title: "Future - SDE Loading…",
    content:
      "Writing code, building cool stuff, and chasing opportunities. One day I'll be the SDE who helps junior devs instead of Googling answers myself. Until then more coffee, more commits, fewer bugs.",
  },
];
// ─────────────────────────────────────────────────────────────────────────────
// Projects - DevTools Network Inspector
// Paste this block into your data/index.ts, replacing the existing projects
// section from "export type ProjectType" down to the closing "];" of projects.
//
// CHANGES vs previous version:
//   - CFT Ventures removed
//   - Console Chess added (major)
//   - Grey Origin: Chennai (not Dublin), live + github corrected
// ─────────────────────────────────────────────────────────────────────────────

export type ProjectType     = "ml" | "fullstack" | "backend" | "research";
export type ProjectSource   = "internship" | "production" | "personal";
export type ProjectPriority = "featured" | "major" | "minor";
export type HttpMethod      = "GET" | "POST" | "PUT" | "DELETE";

export interface ProjectMetric {
  label: string;
  value: string;
}

export interface ProjectHeader {
  key: string;
  value: string;
}

export interface Project {
  id:       string;
  title:    string;
  summary:  string;
  type:     ProjectType;
  source:   ProjectSource;
  priority: ProjectPriority;

  method:     HttpMethod;
  endpoint:   string;
  status:     200 | 201 | 301 | 404;
  statusText: string;
  durationMs: number;
  size:       string;

  stack:          string[];
  metrics:        ProjectMetric[];
  requestHeaders: ProjectHeader[];
  response:       string;
  architecture:   string[];

  environment:    string;
  deployment:     string;
  usersOrDataset: string;

  github?: string;
  live?:   string;
  paper?:  string;
  image?:  string;
}

const PRIORITY_ORDER: Record<ProjectPriority, number> = {
  featured: 0,
  major:    1,
  minor:    2,
};

export function sortedProjects(list: Project[]): Project[] {
  return [...list].sort(
    (a, b) => PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]
  );
}

export const projects: Project[] = [

  // ── 1. Traffic Sign Detection - ML (featured) ─────────────────────────────
  {
    id:         "traffic-sign-detection",
    title:      "Traffic Sign Detection System",
    summary:
      "Real-time traffic sign recognition using a custom-trained YOLOv5 model on the GTSRB dataset. Achieves >93% mAP across 43 sign classes with live webcam inference, priority sign highlighting, and WandB experiment tracking.",
    type:       "ml",
    source:     "personal",
    priority:   "featured",
    method:     "POST",
    endpoint:   "/api/ml/detect",
    status:     200,
    statusText: "OK",
    durationMs: 34,
    size:       ">93% mAP",
    stack:      ["Python", "YOLOv5", "PyTorch", "OpenCV", "WandB", "GTSRB"],
    metrics: [
      { label: "mAP@0.5",         value: ">93%"     },
      { label: "Classes",         value: "43"        },
      { label: "Training Images", value: "39,209"    },
      { label: "Input Size",      value: "640×640"   },
      { label: "Backbone",        value: "YOLOv5"    },
      { label: "Tracking",        value: "WandB"     },
    ],
    requestHeaders: [
      { key: "Content-Type",      value: "image/jpeg"                          },
      { key: "X-Model",           value: "YOLOv5 (custom-trained, best_93.pt)" },
      { key: "X-Framework",       value: "PyTorch"                             },
      { key: "X-Dataset",         value: "GTSRB (43 classes, 39k images)"      },
      { key: "X-Training-Device", value: "GPU (CUDA) - CPU fallback"           },
      { key: "X-Experiment",      value: "WandB sweep tracking"                },
    ],
    response: `{
  "detections": [
    {
      "class_id": 14,
      "class_name": "Stop",
      "confidence": 0.941,
      "bbox": [112, 88, 224, 200],
      "priority": true
    },
    {
      "class_id": 1,
      "class_name": "Speed Limit 30",
      "confidence": 0.887,
      "bbox": [340, 60, 420, 140],
      "priority": false
    }
  ],
  "inference_ms": 34,
  "fps": 29.4,
  "model": "YOLOv5 best_93.pt",
  "map_50": 0.931
}`,
    architecture: [
      "Webcam / Video File (OpenCV capture)",
      "→ Frame resize to 640×640",
      "→ YOLOv5 inference (best_93.pt weights)",
      "→ NMS + confidence threshold filter",
      "→ Priority sign highlight (Stop / No Entry / Yield)",
      "→ Annotated frame output + FPS overlay",
    ],
    environment:    "Local (CUDA GPU / CPU fallback)",
    deployment:     "Python CLI - webcam, video file, or single image",
    usersOrDataset: "GTSRB - 39,209 training / 12,630 test images",
    github: "https://github.com/mahanthvamsi/Traffic-Sign-Board-Detection",
    image:  "/traffic.png", // TODO: add a detection screenshot to /public
  },

  // ── 2. Floww - Finance SaaS (featured) ────────────────────────────────────
  {
    id:         "finance-platform",
    title:      "Floww - AI Finance Management Platform",
    summary:
      "Full-stack financial SaaS with Gemini AI integration for spending insights, budget forecasting, and anomaly detection. JWT auth via Clerk, ORM via Prisma on Neon serverless Postgres, deployed on Vercel.",
    type:       "fullstack",
    source:     "production",
    priority:   "featured",
    method:     "GET",
    endpoint:   "/api/finance/dashboard",
    status:     200,
    statusText: "OK",
    durationMs: 124,
    size:       "3.2 MB",
    stack:      ["Next.js", "TypeScript", "Prisma", "PostgreSQL", "Gemini AI", "Clerk", "Tailwind CSS"],
    metrics: [
      { label: "API p95",    value: "124ms"       },
      { label: "AI Model",   value: "Grok 1.5"  },
      { label: "DB Queries", value: "< 40ms avg"  },
      { label: "Lighthouse", value: "96 / 100"    },
      { label: "Auth",       value: "Clerk (JWT)" },
      { label: "Uptime",     value: "99.9%"       },
    ],
    requestHeaders: [
      { key: "Authorization", value: "Bearer <clerk_jwt>"       },
      { key: "Content-Type",  value: "application/json"         },
      { key: "X-AI-Model",    value: "gemini-1.5-pro"           },
      { key: "Cache-Control", value: "private, max-age=60"      },
      { key: "X-ORM",         value: "Prisma + Neon PostgreSQL" },
    ],
    response: `{
  "balance": 4821.50,
  "monthly_spend": 1240.00,
  "ai_insight": "Dining expenses up 23% vs last month.",
  "anomalies": [
    { "date": "2025-03-14", "amount": 320, "flag": "unusual_merchant" }
  ],
  "forecast_next_30d": 1180.00,
  "query_ms": 124
}`,
    architecture: [
      "Next.js Frontend (App Router)",
      "→ Clerk Auth Middleware",
      "→ Next.js API Routes",
      "→ Prisma ORM",
      "→ Neon Serverless PostgreSQL",
      "→ Gemini 1.5 Pro (spending analysis)",
    ],
    environment:    "Vercel Edge + Neon Serverless",
    deployment:     "Vercel",
    usersOrDataset: "Personal finance SaaS - live deployment",
    github: "https://github.com/mahanthvamsi/floww",
    live:   "https://floww-nu.vercel.app/",
    image:  "/Floww.png",
  },

  // ── 3. Grey Origin - Video Production Portfolio (featured) ────────────────
  {
    id:         "grey-origin",
    title:      "Grey Origin - Video Production Portfolio",
    summary:
      "Creative portfolio site for a Chennai-based video production company. SVG-mask hero with GSAP timeline, custom RAF cursor with lerp ring follower, cursor-tracking thumbnails on the work listing page, and ScrollTrigger reveals throughout.",
    type:       "fullstack",
    source:     "personal",
    priority:   "featured",
    method:     "GET",
    endpoint:   "/",
    status:     200,
    statusText: "OK",
    durationMs: 41,
    size:       "~2.1 MB",
    stack:      ["React", "Vite", "GSAP", "Tailwind CSS", "React Router DOM"],
    metrics: [
      { label: "Animations",  value: "GSAP + ScrollTrigger"  },
      { label: "Routes",      value: "3 (/, /work, 404)"     },
      { label: "Projects",    value: "4 showcased"           },
      { label: "Cursor",      value: "Custom RAF lerp"       },
      { label: "Fonts",       value: "Bebas Neue + DM Sans"  },
      { label: "Build",       value: "Vite (< 2s HMR)"      },
    ],
    requestHeaders: [
      { key: "X-Framework", value: "React 18 + Vite 5"               },
      { key: "X-Animation", value: "GSAP 3 + ScrollTrigger"          },
      { key: "X-Routing",   value: "React Router DOM v6"             },
      { key: "X-Styling",   value: "Inline CSS vars + Tailwind grid" },
      { key: "X-Fonts",     value: "Bebas Neue (h) / DM Sans (body)" },
      { key: "X-Accent",    value: "#c8a96e (gold)"                  },
    ],
    response: `{
  "site": "Grey Origin",
  "location": "Chennai, India",
  "stack": ["React", "Vite", "GSAP", "Tailwind CSS"],
  "routes": ["/", "/work", "/404"],
  "hero": {
    "type": "svg_mask_reveal",
    "video": "local_mp4",
    "animation": "scale_6x_outward"
  },
  "projects_showcased": 4,
  "cursor": "custom_raf_lerp",
  "accent_color": "#c8a96e"
}`,
    architecture: [
      "React Router DOM (BrowserRouter)",
      "→ Navbar (GSAP fade-in, mix-blend-mode: difference)",
      "→ Hero (SVG mask + fullscreen video + GSAP timeline)",
      "→ Work grid (16:9 featured + 4:3 cards, GIF hover overlay)",
      "→ About (two-col layout, brand logo tags)",
      "→ Contact (underline input form)",
      "→ /work route (numbered rows, cursor-tracking thumbnails)",
    ],
    environment:    "Vite dev server / static build",
    deployment:     "Vercel",
    usersOrDataset: "Client site - Grey Origin, Chennai",
    github: "https://github.com/mahanthvamsi/grey-origin",
    live:   "https://grey-origin.vercel.app/",
    image:  "/grey-origin.png", // TODO: add hero screenshot to /public
  },

  // ── 4. Cirrhosis Survival Prediction - Research (major) ───────────────────
  {
    id:         "cirrhosis-prediction",
    title:      "Cirrhosis Survival Prediction",
    summary:
      "Published ML research (IITCEE 2025 - IEEE) comparing five ensemble and deep learning models for predicting cirrhosis patient survival. XGBoost achieved 88.7% accuracy and 0.923 ROC-AUC across 418 clinical records with 5-fold cross-validation.",
    type:       "research",
    source:     "personal",
    priority:   "major",
    method:     "POST",
    endpoint:   "/api/research/cirrhosis-predict",
    status:     200,
    statusText: "OK",
    durationMs: 210,
    size:       "88.7%",
    stack:      ["Python", "XGBoost", "Scikit-learn", "Pandas", "Matplotlib", "Seaborn"],
    metrics: [
      { label: "Best Accuracy", value: "88.7%"              },
      { label: "ROC-AUC",       value: "0.923"              },
      { label: "F1 Score",      value: "0.881"              },
      { label: "Dataset",       value: "418 records"        },
      { label: "Models Tested", value: "5 algorithms"       },
      { label: "Published",     value: "IITCEE 2025 (IEEE)" },
    ],
    requestHeaders: [
      { key: "X-Model",      value: "XGBoost (best performer)"      },
      { key: "X-Dataset",    value: "UCI Cirrhosis Patient Dataset"  },
      { key: "X-Validation", value: "5-fold cross-validation"       },
      { key: "X-Published",  value: "IITCEE 2025 - IEEE Xplore"     },
      { key: "Content-Type", value: "application/json"               },
    ],
    response: `{
  "patient_id": "P-0042",
  "prediction": "Survived",
  "confidence": 0.887,
  "risk_score": 0.113,
  "model": "XGBoost",
  "top_features": ["bilirubin", "prothrombin", "albumin"],
  "roc_auc": 0.923,
  "inference_ms": 210
}`,
    architecture: [
      "UCI Clinical Dataset (418 patient records)",
      "→ Pandas preprocessing (imputation + encoding)",
      "→ Feature engineering (12 clinical variables)",
      "→ Model comparison (XGBoost / RF / SVM / MLP / LR)",
      "→ 5-fold cross-validation",
      "→ Survival prediction + risk score output",
    ],
    environment:    "Local (Jupyter Notebook)",
    deployment:     "Research paper - not deployed",
    usersOrDataset: "UCI ML Repository - 418 patient records",
    github: "https://github.com/mahanthvamsi/Evaluation-of-Machine-Learning-Approaches-for-Cirrhosis-Survival-Prediction",
    paper:  "https://ieeexplore.ieee.org/document/10915362",
    image:  "/paper2.png", // TODO: replace with paper/notebook screenshot
  },

  // ── 5. Console Chess - Java (major) ───────────────────────────────────────
  {
    id:         "console-chess",
    title:      "Console Chess - Java OOP",
    summary:
      "Fully functional two-player console chess game in Java following MVC architecture. Implements all standard rules including castling, en passant, pawn promotion, check, checkmate, and stalemate detection. Includes move logging, captured piece tracking, and random move hints.",
    type:       "backend",
    source:     "personal",
    priority:   "major",
    method:     "POST",
    endpoint:   "/api/chess/move",
    status:     200,
    statusText: "OK",
    durationMs: 4,              // in-memory, essentially instant
    size:       "~180 KB",
    stack:      ["Java", "OOP", "MVC", "JUnit"],
    metrics: [
      { label: "Architecture", value: "MVC"                   },
      { label: "Rules",        value: "Full FIDE ruleset"     },
      { label: "Special Moves", value: "Castle / EP / Promo" },
      { label: "OOP Pillars",  value: "All 4 applied"        },
      { label: "Move Log",     value: "Full game history"    },
      { label: "Hints",        value: "Random move suggest"  },
    ],
    requestHeaders: [
      { key: "X-Language",     value: "Java 17"                              },
      { key: "X-Architecture", value: "MVC (Model / View / Controller)"      },
      { key: "X-OOP",          value: "Abstraction, Inheritance, Poly, Encap"},
      { key: "X-Interface",    value: "Console (text-based)"                 },
      { key: "Content-Type",   value: "application/json"                     },
    ],
    response: `{
  "move": "e2e4",
  "piece": "Pawn",
  "player": "WHITE",
  "status": "valid",
  "check": false,
  "checkmate": false,
  "stalemate": false,
  "captured": null,
  "move_number": 1,
  "log": ["e2e4"]
}`,
    architecture: [
      "Main entry point (game loop)",
      "→ Controller (move parsing + validation)",
      "→ Model (Board, Piece hierarchy, GameState)",
      "→ Piece classes (King / Queen / Rook / Bishop / Knight / Pawn)",
      "→ Rules engine (check, checkmate, stalemate, special moves)",
      "→ View (console renderer + move log)",
    ],
    environment:    "Local (JVM - any OS)",
    deployment:     "Console application - run via javac / java",
    usersOrDataset: "Two-player local game",
    github: "https://github.com/mahanthvamsi/Chess", // UPDATE to actual repo if separate
    image:  "/chess.png", // TODO: add a console screenshot to /public
  },

  // 6. Flutter Quiz App - minor 
  {
    id:         "flutter-quiz-app",
    title:      "Quiz App - Flutter",
    summary:
      "A mobile quiz application built while learning Flutter fundamentals. Supports multiple-choice questions, Next / Back / Skip navigation, progress tracking, a final results screen, and quiz restart. Built to understand Flutter UI layout, PageView navigation, state management, and reusable widget patterns.",
    type:       "backend",   // closest fit - mobile/dart, no separate mobile type
    source:     "personal",
    priority:   "minor",
    method:     "GET",
    endpoint:   "/quiz/start",
    status:     200,
    statusText: "OK",
    durationMs: 12,           // local device, essentially instant
    size:       "~4 MB",
    stack:      ["Flutter", "Dart", "Material Design"],
    metrics: [
      { label: "Platform",    value: "Android / iOS"   },
      { label: "Navigation",  value: "Next / Back / Skip" },
      { label: "Purpose",     value: "Learning project" },
      { label: "UI Pattern",  value: "PageView"        },
      { label: "State",       value: "setState"        },
      { label: "Design",      value: "Material 3"      },
    ],
    requestHeaders: [
      { key: "X-Framework",  value: "Flutter SDK"                        },
      { key: "X-Language",   value: "Dart"                               },
      { key: "X-Target",     value: "Android / iOS (mobile-first)"       },
      { key: "X-UI",         value: "Material Design 3"                  },
      { key: "X-Purpose",    value: "Flutter fundamentals practice"      },
    ],
    response: `{
  "quiz_started": true,
  "total_questions": 10,
  "current_question": 1,
  "navigation": ["next", "back", "skip"],
  "features": [
    "multiple_choice",
    "progress_tracking",
    "skip_and_return",
    "final_score",
    "restart"
  ],
  "platform": "Flutter (Android / iOS)"
}`,
    architecture: [
      "main.dart (MaterialApp entry)",
      "→ QuizScreen (PageView controller)",
      "→ QuestionCard widget (MCQ UI)",
      "→ NavigationBar (Next / Back / Skip)",
      "→ ProgressIndicator widget",
      "→ ResultsScreen (score + restart)",
    ],
    environment:    "Android emulator / physical device",
    deployment:     "Local - flutter run",
    usersOrDataset: "Learning project - personal use",
    github: "https://github.com/mahanthvamsi/Quiz_app",
    image:  "/quiz.png", // TODO: add a mobile screenshot to /public
  },

];
export const philosophyPillars = [
  {
    id: "listening",
    tag: "01 / Empathy",
    accent: "#9577c9",
    accentRgb: "149,119,201",
    icon: "◎",
    headline: "I listen more than I talk.",
    subtext: "especially at the start",
    // body split into segments - tooltip segments have a `tooltip` key
    bodyParts: [
      { text: "Before writing a single line of code, I spend real time understanding why something needs to exist. Not just what the ticket says - " },
      {
        text: "the frustration behind it",
        tooltip: {
          quote: "The customer rarely knows what they want until you show them what they don't want.",
          person: "Steve Jobs",
          role: "Co-founder, Apple",
          initials: "SJ",
          avatarBg: "#1d1d1f",
          accentColor: "#9577c9",
        },
      },
      { text: ". The conversation that happened three meetings before it got written down. That context is " },
      {
        text: "where the actual work lives",
        tooltip: {
          quote: "Make something people want. Everything else is details.",
          person: "Paul Graham",
          role: "Co-founder, Y Combinator",
          initials: "PG",
          avatarBg: "#1a1a2e",
          accentColor: "#9577c9",
        },
      },
      { text: "." },
    ],
    proof: "At BHEL, the original brief was 'build an attendance module.' After talking to the HR team for a day, I realised the real problem was manual payroll reconciliation causing end-of-month chaos. The module I built automated that reconciliation entirely - which wasn't in the spec, but was the thing that actually mattered.",
    proofLabel: "Real example · BHEL internship",
    quote: "The best requirements come from the silence after someone stops talking.",
  },
  {
    id: "resilience",
    tag: "02 / Problem Solving",
    accent: "#60a5fa",
    accentRgb: "96,165,250",
    icon: "⬡",
    headline: "I don't panic. I get methodical.",
    subtext: "bugs are just gaps in understanding",
    bodyParts: [
      { text: "When something breaks in a way I've never seen, my first instinct isn't to Google the error. It's to slow down and ask " },
      {
        text: "what I believed to be true",
        tooltip: {
          quote: "The first principle is that you must not fool yourself - and you are the easiest person to fool.",
          person: "Richard Feynman",
          role: "Physicist, Nobel Laureate",
          initials: "RF",
          avatarBg: "#0f1729",
          accentColor: "#60a5fa",
        },
      },
      { text: " about this system that is clearly wrong. That reframe turns a frustrating blocker into something more useful - " },
      {
        text: "a precise question with a precise answer",
        tooltip: {
          quote: "Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.",
          person: "Brian W. Kernighan",
          role: "Co-author, The C Programming Language",
          initials: "BK",
          avatarBg: "#0a1628",
          accentColor: "#60a5fa",
        },
      },
      { text: "." },
    ],
    proof: "During a production deployment at CFT, a race condition in a data-fetch hook was causing silent state corruption on slow connections. Three hours of rubber-ducking and reading the React scheduler source led me to the fix - and more importantly, I actually understood why it broke, so I could prevent the whole class of bug going forward.",
    proofLabel: "Real example · CFT Ventures internship",
    quote: "A bug is never just a bug. It's a gap between your mental model and reality.",
  },
  {
    id: "clarity",
    tag: "03 / Communication",
    accent: "#34d399",
    accentRgb: "52,211,153",
    icon: "◈",
    headline: "I write for the person who comes next.",
    subtext: "clarity is a form of respect",
    bodyParts: [
      { text: "Code gets read ten times more than it gets written. I name things as if the next developer has no context and no time - because that's usually true. " },
      {
        text: "Commit messages that tell a story",
        tooltip: {
          quote: "Always code as if the guy who ends up maintaining your code will be a violent psychopath who knows where you live.",
          person: "John Woods",
          role: "Software Engineer",
          initials: "JW",
          avatarBg: "#0d1f16",
          accentColor: "#34d399",
        },
      },
      { text: ", not a list of files changed. Documentation isn't something I do when a project ends - " },
      {
        text: "it's how I think through what I'm building",
        tooltip: {
          quote: "If you can't explain it simply, you don't understand it well enough.",
          person: "Albert Einstein",
          role: "Theoretical Physicist",
          initials: "AE",
          avatarBg: "#0d1a0e",
          accentColor: "#34d399",
        },
      },
      { text: "." },
    ],
    proof: "On my ML research project (published at IITCEE 2025), I wrote the experiment notebooks so thoroughly that my supervisor could re-run any model variant without me present. That discipline meant every result was reproducible and every decision had a paper trail which directly helped the review process.",
    proofLabel: "Real example · IITCEE 2025 research",
    quote: "If the next engineer can't understand it without you, you're not done yet.",
  },
];
