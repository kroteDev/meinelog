export type RawTaskPriority = "trivial" | "low" | "medium" | "high" | "critical";

export interface RawTaskDto {
  id: string;
  title: string;
  description: string | null;
  complete: boolean;
  priority: RawTaskPriority;
  due_date: string | null;
  user_id: number;
  project_id: string | null;
  created_at: string;
  updated_at: string;
}
