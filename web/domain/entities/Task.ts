export type TaskPriority = "trivial" | "low" | "medium" | "high" | "critical";

export interface Task {
  id: string;
  title: string;
  description: string | null;
  complete: boolean;
  priority: TaskPriority;
  dueDate: Date | null;
  userId: number;
  projectId: string | null;
  createdAt: Date;
  updatedAt: Date;
}
