import type { ApiRequestFn, TokenProvider } from "@/infrastructure/api/httpClient";
import type { RawTaskDto } from "@/domain/api/RawTaskDto";
import type {
  CreateTaskInput,
  ITaskRepository,
  UpdateTaskInput,
} from "@/domain/repositories/ITaskRepository";
import type { Task } from "@/domain/entities/Task";
import {
  rawToTask,
  toRawComplete,
  toRawCreateTask,
  toRawUpdateTask,
} from "@/infrastructure/api/mappers/taskMapper";

export class HttpTaskRepository implements ITaskRepository {
  private readonly request: ApiRequestFn;
  private readonly getToken: TokenProvider;

  constructor(request: ApiRequestFn, getToken: TokenProvider) {
    this.request = request;
    this.getToken = getToken;
  }

  async list(): Promise<Task[]> {
    const raws = await this.request<RawTaskDto[]>({
      method: "GET",
      path: "/api/v1/tasks",
      token: this.getToken() ?? undefined,
    });
    return raws.map(rawToTask);
  }

  async listByProject(projectId: string): Promise<Task[]> {
    // Client-side filter until the API offers ?project_id=.
    const tasks = await this.list();
    return tasks.filter((task) => task.projectId === projectId);
  }

  async get(id: string): Promise<Task> {
    const raw = await this.request<RawTaskDto>({
      method: "GET",
      path: `/api/v1/tasks/${id}`,
      token: this.getToken() ?? undefined,
    });
    return rawToTask(raw);
  }

  async create(input: CreateTaskInput): Promise<Task> {
    const raw = await this.request<RawTaskDto>({
      method: "POST",
      path: "/api/v1/tasks",
      token: this.getToken() ?? undefined,
      body: toRawCreateTask(input),
    });
    return rawToTask(raw);
  }

  async update(id: string, input: UpdateTaskInput): Promise<Task> {
    const raw = await this.request<RawTaskDto>({
      method: "PATCH",
      path: `/api/v1/tasks/${id}`,
      token: this.getToken() ?? undefined,
      body: toRawUpdateTask(input),
    });
    return rawToTask(raw);
  }

  async complete(id: string, complete: boolean): Promise<Task> {
    const raw = await this.request<RawTaskDto>({
      method: "PATCH",
      path: `/api/v1/tasks/${id}/complete`,
      token: this.getToken() ?? undefined,
      body: toRawComplete(complete),
    });
    return rawToTask(raw);
  }

  async remove(id: string): Promise<void> {
    await this.request<unknown>({
      method: "DELETE",
      path: `/api/v1/tasks/${id}`,
      token: this.getToken() ?? undefined,
    });
  }
}
