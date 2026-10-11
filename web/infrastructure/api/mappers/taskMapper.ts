import type {
  CompleteTaskRequestDto,
  CreateTaskRequestDto,
  UpdateTaskRequestDto,
} from "@/domain/api/TaskRequests";
import type { RawTaskDto } from "@/domain/api/RawTaskDto";
import type { CreateTaskInput, UpdateTaskInput } from "@/domain/repositories/ITaskRepository";
import type { Task } from "@/domain/entities/Task";

function toWireDate(date: Date | null | undefined): string | null | undefined {
  if (date === undefined) return undefined;
  if (date === null) return null;
  return date.toISOString().slice(0, 10);
}

export function rawToTask(raw: RawTaskDto): Task {
  return {
    id: raw.id,
    title: raw.title,
    description: raw.description,
    complete: raw.complete,
    priority: raw.priority,
    dueDate: raw.due_date === null ? null : new Date(raw.due_date),
    userId: raw.user_id,
    projectId: raw.project_id,
    createdAt: new Date(raw.created_at),
    updatedAt: new Date(raw.updated_at),
  };
}

export function toRawCreateTask(input: CreateTaskInput): CreateTaskRequestDto {
  return {
    task: {
      title: input.title,
      ...(input.description !== undefined ? { description: input.description } : {}),
      ...(input.priority !== undefined ? { priority: input.priority } : {}),
      ...(input.dueDate !== undefined ? { due_date: toWireDate(input.dueDate) } : {}),
      ...(input.projectId !== undefined ? { project_id: input.projectId } : {}),
    },
  };
}

export function toRawUpdateTask(input: UpdateTaskInput): UpdateTaskRequestDto {
  return {
    task: {
      ...(input.title !== undefined ? { title: input.title } : {}),
      ...(input.description !== undefined ? { description: input.description } : {}),
      ...(input.complete !== undefined ? { complete: input.complete } : {}),
      ...(input.priority !== undefined ? { priority: input.priority } : {}),
      ...(input.dueDate !== undefined ? { due_date: toWireDate(input.dueDate) } : {}),
      ...(input.projectId !== undefined ? { project_id: input.projectId } : {}),
    },
  };
}

export function toRawComplete(complete: boolean): CompleteTaskRequestDto {
  return { task: { complete } };
}
