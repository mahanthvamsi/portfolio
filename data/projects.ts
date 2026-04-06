// data/projects.ts
// ─────────────────────────────────────────────────────────────────────────────
// Replace sample content with your real project data when ready.
// Import in data/index.ts:  export { projects } from "./projects";
// ─────────────────────────────────────────────────────────────────────────────

// ── Types ─────────────────────────────────────────────────────────────────────

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
  // ── Identity ────────────────────────────────────────────────────────────────
  id:          string;
  title:       string;
  summary:     string;
  type:        ProjectType;
  source:      ProjectSource;
  priority:    ProjectPriority;

  // ── Network row fields ──────────────────────────────────────────────────────
  method:      HttpMethod;
  endpoint:    string;
  status:      200 | 201 | 301 | 404;
  statusText:  string;
  durationMs:  number;           // replaces the old string "38ms"
  size:        string;           // file size or accuracy - visible in row

  // ── Stack + Engineering detail ──────────────────────────────────────────────
  stack:          string[];
  metrics:        ProjectMetric[];
  requestHeaders: ProjectHeader[];
  response:       string;        // JSON string shown in Response tab
  architecture:   string[];      // ordered flow, rendered as vertical diagram

  // ── Real-world context ──────────────────────────────────────────────────────
  environment:    string;        // e.g. "Docker", "AWS EC2", "Local"
  deployment:     string;        // e.g. "Vercel", "Render", "AWS Lambda"
  usersOrDataset: string;        // e.g. "500+ employees", "50k images"

  // ── Links (all optional) ────────────────────────────────────────────────────
  github?: string;
  live?:   string;
  paper?:  string;
}

// ── Priority sort helper ──────────────────────────────────────────────────────
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

// ── Sample data (replace with your real projects) ────────────────────────────
export const projects: Project[] = [

  // ── 1. BHEL - Internship (featured) ─────────────────────────────────────────
  {
    id:          "bhel-hr-system",
    title:       "Employee Management System",
    summary:
      "Role-based HR management system built during SDE internship at BHEL. Handles employee CRUD, department workflows, leave management, and admin reporting across 500+ internal records.",
    type:        "backend",
    source:      "internship",
    priority:    "featured",
    method:      "GET",
    endpoint:    "/api/hr/employees",
    status:      200,
    statusText:  "OK",
    durationMs:  67,
    size:        "1.8 MB",
    stack:       ["Java", "JSP", "MySQL", "Apache Tomcat", "Bootstrap"],
    metrics: [
      { label: "Efficiency Gain", value: "~60% reduction"  },
      { label: "Query Time",      value: "< 67ms"          },
      { label: "Employee Records",value: "500+"            },
      { label: "DB Tables",       value: "14 normalised"   },
      { label: "Roles",           value: "Admin / HR / Emp"},
      { label: "Reports",         value: "8 export formats"},
    ],
    requestHeaders: [
      { key: "X-Role",         value: "ADMIN | HR | EMPLOYEE"     },
      { key: "X-Auth",         value: "Session-based (JSP)"       },
      { key: "Content-Type",   value: "application/json"          },
      { key: "DB",             value: "MySQL 8.0 (normalised)"    },
      { key: "Server",         value: "Apache Tomcat 9"           },
    ],
    response: `{
  "total_employees": 512,
  "departments": ["Engineering", "Finance", "HR", "Admin"],
  "pending_leaves": 7,
  "this_month_joined": 3,
  "alerts": [
    { "type": "leave_approval", "count": 7 }
  ],
  "query_ms": 67
}`,
    architecture: [
      "Browser (Bootstrap UI)",
      "→ JSP Servlet Layer",
      "→ Java Business Logic",
      "→ DAO Layer (JDBC)",
      "→ MySQL 8.0 (14 tables)",
    ],
    environment:    "Apache Tomcat (on-premise)",
    deployment:     "On-premise (BHEL Internal)",
    usersOrDataset: "Internal HR system - 500+ employees",
    github:         "https://github.com/mahanthvamsi",
  },

  // ── 2. Traffic Sign Detection - ML (featured) ────────────────────────────────
  {
    id:          "traffic-sign-detection",
    title:       "Traffic Sign Detection System",
    summary:
      "CNN-based real-time traffic sign classification system. Trained on 50,000+ images across 43 categories using transfer learning on a ResNet backbone with OpenCV preprocessing pipeline.",
    type:        "ml",
    source:      "personal",
    priority:    "featured",
    method:      "POST",
    endpoint:    "/api/ml/traffic-sign-detector",
    status:      200,
    statusText:  "OK",
    durationMs:  38,
    size:        "94.2%",
    stack:       ["Python", "TensorFlow", "OpenCV", "NumPy", "Scikit-learn"],
    metrics: [
      { label: "Accuracy",     value: "94.2%"         },
      { label: "Inference",    value: "38ms avg"       },
      { label: "Dataset",      value: "50,000+ images" },
      { label: "Categories",   value: "43 classes"     },
      { label: "Model Size",   value: "12.4 MB"        },
      { label: "Precision",    value: "93.8%"          },
    ],
    requestHeaders: [
      { key: "Content-Type",      value: "image/jpeg"                    },
      { key: "X-Model",           value: "ResNet-50 (transfer learning)" },
      { key: "X-Framework",       value: "TensorFlow 2.x"               },
      { key: "X-Preprocessing",   value: "OpenCV normalisation + aug."   },
      { key: "X-Training-Device", value: "GPU (CUDA enabled)"            },
    ],
    response: `{
  "prediction": "Speed Limit 50",
  "confidence": 0.942,
  "inference_ms": 38,
  "top_3": [
    { "class": "Speed Limit 50", "prob": 0.942 },
    { "class": "Speed Limit 30", "prob": 0.041 },
    { "class": "Speed Limit 70", "prob": 0.017 }
  ]
}`,
    architecture: [
      "Image Input (JPEG/PNG)",
      "→ OpenCV Preprocessing (resize, normalise, augment)",
      "→ ResNet-50 Feature Extractor",
      "→ Custom Classification Head (43 classes)",
      "→ Softmax Output + Confidence Score",
    ],
    environment:    "Local (CUDA GPU)",
    deployment:     "Python script / FastAPI endpoint",
    usersOrDataset: "50,000+ labelled traffic sign images (GTSRB)",
    github:         "https://github.com/mahanthvamsi",
  },

  // ── 3. Finance SaaS - Fullstack (featured) ───────────────────────────────────
  {
    id:          "finance-platform",
    title:       "AI Finance Management Platform",
    summary:
      "Full-stack financial SaaS with Gemini AI integration for spending insights, budget forecasting, and anomaly detection. JWT auth via Clerk, ORM via Prisma, deployed on Vercel.",
    type:        "fullstack",
    source:      "production",
    priority:    "featured",
    method:      "GET",
    endpoint:    "/api/finance/dashboard",
    status:      200,
    statusText:  "OK",
    durationMs:  124,
    size:        "3.2 MB",
    stack:       ["Next.js", "TypeScript", "Prisma", "PostgreSQL", "Gemini AI", "Clerk", "Tailwind"],
    metrics: [
      { label: "API p95",     value: "124ms"       },
      { label: "AI Model",    value: "Gemini 1.5"  },
      { label: "DB Queries",  value: "< 40ms avg"  },
      { label: "Lighthouse",  value: "96 / 100"    },
      { label: "Auth",        value: "Clerk (JWT)" },
      { label: "Uptime",      value: "99.9%"       },
    ],
    requestHeaders: [
      { key: "Authorization",  value: "Bearer <clerk_jwt>"    },
      { key: "Content-Type",   value: "application/json"      },
      { key: "X-AI-Model",     value: "gemini-1.5-pro"        },
      { key: "Cache-Control",  value: "private, max-age=60"   },
      { key: "X-ORM",          value: "Prisma + PostgreSQL"   },
    ],
    response: `{
  "balance": 4821.50,
  "monthly_spend": 1240.00,
  "ai_insight": "Dining expenses up 23% vs last month.",
  "anomalies": [
    { "date": "2025-03-14", "amount": 320, "flag": "unusual_merchant" }
  ],
  "forecast_next_30d": 1180.00
}`,
    architecture: [
      "Next.js Frontend (App Router)",
      "→ Clerk Auth Middleware",
      "→ Next.js API Routes",
      "→ Prisma ORM",
      "→ PostgreSQL (Neon serverless)",
      "→ Gemini AI (spending analysis)",
    ],
    environment:    "Vercel Edge + Neon Serverless",
    deployment:     "Vercel",
    usersOrDataset: "Personal finance SaaS - live deployment",
    github:         "https://github.com/mahanthvamsi",
    live:           "https://your-finance-app.vercel.app",
  },

  // ── 4. Cirrhosis Prediction - Research (major) ──────────────────────────────
  {
    id:          "cirrhosis-prediction",
    title:       "Cirrhosis Survival Prediction",
    summary:
      "Published ML research (IITCEE 2025) comparing ensemble and deep learning models for predicting cirrhosis patient survival. XGBoost achieved 88.7% accuracy across 418 clinical records.",
    type:        "research",
    source:      "personal",
    priority:    "major",
    method:      "POST",
    endpoint:    "/api/research/cirrhosis-predict",
    status:      200,
    statusText:  "OK",
    durationMs:  210,
    size:        "88.7%",
    stack:       ["Python", "Scikit-learn", "XGBoost", "Pandas", "Matplotlib", "Seaborn"],
    metrics: [
      { label: "Best Accuracy", value: "88.7% (XGBoost)" },
      { label: "Dataset",       value: "418 clinical records" },
      { label: "Models Tested", value: "5 algorithms"     },
      { label: "F1 Score",      value: "0.881"            },
      { label: "ROC-AUC",       value: "0.923"            },
      { label: "Published",     value: "IITCEE 2025"      },
    ],
    requestHeaders: [
      { key: "X-Model",      value: "XGBoost (best performer)"      },
      { key: "X-Dataset",    value: "UCI Cirrhosis Patient Dataset" },
      { key: "X-Validation", value: "5-fold cross-validation"       },
      { key: "X-Published",  value: "IITCEE 2025 Conference"        },
      { key: "Content-Type", value: "application/json"              },
    ],
    response: `{
  "patient_id": "P-0042",
  "prediction": "Survived",
  "confidence": 0.887,
  "risk_score": 0.113,
  "model": "XGBoost",
  "top_features": ["bilirubin", "prothrombin", "albumin"],
  "inference_ms": 210
}`,
    architecture: [
      "UCI Clinical Dataset (418 records)",
      "→ Pandas Preprocessing (imputation, encoding)",
      "→ Feature Engineering (12 clinical vars)",
      "→ Model Comparison (XGBoost / RF / SVM / MLP / LR)",
      "→ 5-Fold Cross Validation",
      "→ Survival Prediction Output",
    ],
    environment:    "Local (Jupyter Notebook)",
    deployment:     "Research paper - not deployed",
    usersOrDataset: "UCI ML Repository - 418 patient records",
    github:         "https://github.com/mahanthvamsi",
    paper:          "https://ieeexplore.ieee.org",
  },

  // ── 5. CFT Ventures - Internship (major) ────────────────────────────────────
  {
    id:          "cft-react-components",
    title:       "React Component Library - CFT Ventures",
    summary:
      "Production UI component library built during web development internship at CFT Ventures. Reusable React components integrated across internal product modules with optimised rendering.",
    type:        "fullstack",
    source:      "internship",
    priority:    "major",
    method:      "GET",
    endpoint:    "/api/ui/components",
    status:      200,
    statusText:  "OK",
    durationMs:  89,
    size:        "840 KB",
    stack:       ["React", "TypeScript", "Tailwind CSS", "Storybook", "Vite"],
    metrics: [
      { label: "Components Built", value: "24 reusable"     },
      { label: "Bundle Size",      value: "840 KB (gzip)"   },
      { label: "Render Time",      value: "< 89ms"          },
      { label: "Coverage",         value: "3 product modules"},
      { label: "Storybook",        value: "Fully documented" },
      { label: "Duration",         value: "Jan–Apr 2025"     },
    ],
    requestHeaders: [
      { key: "X-Framework",   value: "React 18 + TypeScript"    },
      { key: "X-Bundler",     value: "Vite 5"                   },
      { key: "X-Styling",     value: "Tailwind CSS"             },
      { key: "X-Docs",        value: "Storybook 7"              },
      { key: "Content-Type",  value: "application/json"         },
    ],
    response: `{
  "components": 24,
  "modules_integrated": ["Dashboard", "Reports", "Settings"],
  "bundle_kb": 840,
  "render_ms": 89,
  "storybook": true,
  "typescript_strict": true
}`,
    architecture: [
      "Figma Designs",
      "→ React 18 Component Layer (TypeScript strict)",
      "→ Tailwind CSS Styling System",
      "→ Storybook Documentation",
      "→ Vite Build + Tree Shaking",
      "→ Integrated into CFT Product Modules",
    ],
    environment:    "Local → CI/CD pipeline",
    deployment:     "Internal (CFT Ventures)",
    usersOrDataset: "Internal product - 3 modules",
    github:         "https://github.com/mahanthvamsi",
  },
];