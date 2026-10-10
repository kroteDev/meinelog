import type { RawTaskPriority } from "./RawTaskDto";

export interface CreateTaskRequestDto {
  task: {
    title: string;
    description?: string | null;
    priority?: RawTaskPriority;
    due_date?: string | null;
    project_id?: string | null;
  };
}

export interface UpdateTaskRequestDto {
  task: {
    title?: string;
    description?: string | null;
    complete?: boolean;
    priority?: RawTaskPriority;
    due_date?: string | null;
    project_id?: string | null;
  };
}

export interface CompleteTaskRequestDto {
  task: {
    complete: boolean;
  };
}
