import type { Task, TaskPriority } from "@/domain/entities/Task";

export interface CreateTaskInput {
  title: string;
  description?: string | null;
  priority?: TaskPriority;
  dueDate?: Date | null;
  projectId?: string | null;
}

export interface UpdateTaskInput {
  title?: string;
  description?: string | null;
  complete?: boolean;
  priority?: TaskPriority;
  dueDate?: Date | null;
  projectId?: string | null;
}

export interface ITaskRepository {
  list(): Promise<Task[]>;
  listByProject(projectId: string): Promise<Task[]>;
  get(id: string): Promise<Task>;
  create(input: CreateTaskInput): Promise<Task>;
  update(id: string, input: UpdateTaskInput): Promise<Task>;
  complete(id: string, complete: boolean): Promise<Task>;
  remove(id: string): Promise<void>;
}
