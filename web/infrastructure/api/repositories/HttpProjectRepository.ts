import type { ApiRequestFn, TokenProvider } from "@/infrastructure/api/httpClient";
import type { RawProjectDto } from "@/domain/api/RawProjectDto";
import type {
  CreateProjectInput,
  IProjectRepository,
  UpdateProjectInput,
} from "@/domain/repositories/IProjectRepository";
import type { Project } from "@/domain/entities/Project";
import { rawToProject, toRawCreateProject, toRawUpdateProject } from "@/infrastructure/api/mappers/projectMapper";

export class HttpProjectRepository implements IProjectRepository {
  private readonly request: ApiRequestFn;
  private readonly getToken: TokenProvider;

  constructor(request: ApiRequestFn, getToken: TokenProvider) {
    this.request = request;
    this.getToken = getToken;
  }

  async list(): Promise<Project[]> {
    const raws = await this.request<RawProjectDto[]>({
      method: "GET",
      path: "/api/v1/projects",
      token: this.getToken() ?? undefined,
    });
    return raws.map(rawToProject);
  }

  async get(id: string): Promise<Project> {
    const raw = await this.request<RawProjectDto>({
      method: "GET",
      path: `/api/v1/projects/${id}`,
      token: this.getToken() ?? undefined,
    });
    return rawToProject(raw);
  }

  async create(input: CreateProjectInput): Promise<Project> {
    const raw = await this.request<RawProjectDto>({
      method: "POST",
      path: "/api/v1/projects",
      token: this.getToken() ?? undefined,
      body: toRawCreateProject(input),
    });
    return rawToProject(raw);
  }

  async update(id: string, input: UpdateProjectInput): Promise<Project> {
    const raw = await this.request<RawProjectDto>({
      method: "PATCH",
      path: `/api/v1/projects/${id}`,
      token: this.getToken() ?? undefined,
      body: toRawUpdateProject(input),
    });
    return rawToProject(raw);
  }

  async remove(id: string): Promise<void> {
    await this.request<unknown>({
      method: "DELETE",
      path: `/api/v1/projects/${id}`,
      token: this.getToken() ?? undefined,
    });
  }
}
