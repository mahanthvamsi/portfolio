// ─── Shared types for ExperienceRack ─────────────────────────────────────────

export interface WorkExperience {
  id:        number;
  roleType:  string;
  company:   string;
  duration:  string;
  location?: string;
  thumbnail: string;
  status:    "current" | "completed" | "upcoming";
  metrics?:  { label: string; value: string }[];
  stack?:    string[];
  points:    string[];
}

export interface DiskDriveProps {
  exp:          WorkExperience;
  index:        number;
  totalSlots:   number;
  isEjected:    boolean;
  isAnyEjected: boolean;
  onToggle:     (id: number) => void;
}

export interface ExperiencePanelProps {
  exp:      WorkExperience;
  onClose:  () => void;
}
