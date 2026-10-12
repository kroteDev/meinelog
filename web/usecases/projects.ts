import type { Project } from "@/domain/entities/Project";
import type { Task } from "@/domain/entities/Task";
import type {
  CreateProjectInput,
  IProjectRepository,
  UpdateProjectInput,
} from "@/domain/repositories/IProjectRepository";
import type { ITaskRepository } from "@/domain/repositories/ITaskRepository";

export function listProjects(repo: IProjectRepository): Promise<Project[]> {
  return repo.list();
}

export function getProject(repo: IProjectRepository, id: string): Promise<Project> {
  return repo.get(id);
}

export function createProject(
  repo: IProjectRepository,
  input: CreateProjectInput,
): Promise<Project> {
  return repo.create(input);
}

export function updateProject(
  repo: IProjectRepository,
  id: string,
  input: UpdateProjectInput,
): Promise<Project> {
  return repo.update(id, input);
}

export function deleteProject(repo: IProjectRepository, id: string): Promise<void> {
  return repo.remove(id);
}

export interface ProjectWithTasks {
  project: Project;
  tasks: Task[];
}

export async function getProjectWithTasks(
  projects: IProjectRepository,
  tasks: ITaskRepository,
  id: string,
): Promise<ProjectWithTasks> {
  const [project, projectTasks] = await Promise.all([
    projects.get(id),
    tasks.listByProject(id),
  ]);
  return { project, tasks: projectTasks };
}
