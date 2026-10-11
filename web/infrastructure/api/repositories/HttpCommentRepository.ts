import type { ApiRequestFn, TokenProvider } from "../httpClient";
import type { RawCommentDto } from "../../../domain/api/RawCommentDto";
import type {
  CreateCommentInput,
  ICommentRepository,
  UpdateCommentInput,
} from "../../../domain/repositories/ICommentRepository";
import type { Comment } from "../../../domain/entities/Comment";
import { rawToComment, toRawCreateComment, toRawUpdateComment } from "../mappers/commentMapper";

export class HttpCommentRepository implements ICommentRepository {
  private readonly request: ApiRequestFn;
  private readonly getToken: TokenProvider;

  constructor(request: ApiRequestFn, getToken: TokenProvider) {
    this.request = request;
    this.getToken = getToken;
  }

  async listByTask(taskId: string): Promise<Comment[]> {
    const raws = await this.request<RawCommentDto[]>({
      method: "GET",
      path: `/api/v1/tasks/${taskId}/comments`,
      token: this.getToken() ?? undefined,
    });
    return raws.map(rawToComment);
  }

  async get(taskId: string, id: string): Promise<Comment> {
    const raw = await this.request<RawCommentDto>({
      method: "GET",
      path: `/api/v1/tasks/${taskId}/comments/${id}`,
      token: this.getToken() ?? undefined,
    });
    return rawToComment(raw);
  }

  async create(input: CreateCommentInput): Promise<Comment> {
    const raw = await this.request<RawCommentDto>({
      method: "POST",
      path: `/api/v1/tasks/${input.taskId}/comments`,
      token: this.getToken() ?? undefined,
      body: toRawCreateComment(input),
    });
    return rawToComment(raw);
  }

  async update(taskId: string, id: string, input: UpdateCommentInput): Promise<Comment> {
    const raw = await this.request<RawCommentDto>({
      method: "PATCH",
      path: `/api/v1/tasks/${taskId}/comments/${id}`,
      token: this.getToken() ?? undefined,
      body: toRawUpdateComment(input),
    });
    return rawToComment(raw);
  }

  async remove(taskId: string, id: string): Promise<void> {
    await this.request<unknown>({
      method: "DELETE",
      path: `/api/v1/tasks/${taskId}/comments/${id}`,
      token: this.getToken() ?? undefined,
    });
  }
}
