import type { TaskPriority } from "@/domain/entities/Task";

export type PriorityTone = "neutral" | "info" | "caution" | "danger" | "critical";

export const PRIORITY_ORDER: readonly TaskPriority[] = [
  "trivial",
  "low",
  "medium",
  "high",
  "critical",
] as const;

export const PRIORITY_LABELS: Record<TaskPriority, string> = {
  trivial: "Trivial",
  low: "Low",
  medium: "Medium",
  high: "High",
  critical: "Critical",
};

export const PRIORITY_TONES: Record<TaskPriority, PriorityTone> = {
  trivial: "neutral",
  low: "info",
  medium: "caution",
  high: "danger",
  critical: "critical",
};

export interface PriorityMeta {
  label: string;
  tone: PriorityTone;
  level: number;
}

export function getPriorityMeta(priority: TaskPriority): PriorityMeta {
  return {
    label: PRIORITY_LABELS[priority],
    tone: PRIORITY_TONES[priority],
    level: PRIORITY_ORDER.indexOf(priority),
  };
}
