import type {
  CreateProjectRequestDto,
  UpdateProjectRequestDto,
} from "../../../domain/api/ProjectRequests";
import type { RawProjectDto } from "../../../domain/api/RawProjectDto";
import type { CreateProjectInput, UpdateProjectInput } from "../../../domain/repositories/IProjectRepository";
import type { Project } from "../../../domain/entities/Project";

export function rawToProject(raw: RawProjectDto): Project {
  return {
    id: raw.id,
    name: raw.name,
    description: raw.description,
    userId: raw.user_id,
    createdAt: new Date(raw.created_at),
    updatedAt: new Date(raw.updated_at),
  };
}

export function toRawCreateProject(input: CreateProjectInput): CreateProjectRequestDto {
  return {
    project: {
      name: input.name,
      description: input.description,
    },
  };
}

export function toRawUpdateProject(input: UpdateProjectInput): UpdateProjectRequestDto {
  return {
    project: {
      ...(input.name !== undefined ? { name: input.name } : {}),
      ...(input.description !== undefined ? { description: input.description } : {}),
    },
  };
}
