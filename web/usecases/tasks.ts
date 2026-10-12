import type { Task } from "@/domain/entities/Task";
import type {
  CreateTaskInput,
  ITaskRepository,
  UpdateTaskInput,
} from "@/domain/repositories/ITaskRepository";

export function listTasks(repo: ITaskRepository): Promise<Task[]> {
  return repo.list();
}

export function listProjectTasks(repo: ITaskRepository, projectId: string): Promise<Task[]> {
  return repo.listByProject(projectId);
}

export function getTask(repo: ITaskRepository, id: string): Promise<Task> {
  return repo.get(id);
}

export function createTask(repo: ITaskRepository, input: CreateTaskInput): Promise<Task> {
  return repo.create(input);
}

export function updateTask(
  repo: ITaskRepository,
  id: string,
  input: UpdateTaskInput,
): Promise<Task> {
  return repo.update(id, input);
}

export function toggleTaskComplete(
  repo: ITaskRepository,
  id: string,
  complete: boolean,
): Promise<Task> {
  return repo.complete(id, complete);
}

export function deleteTask(repo: ITaskRepository, id: string): Promise<void> {
  return repo.remove(id);
}
