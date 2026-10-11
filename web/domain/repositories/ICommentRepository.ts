import type { Comment } from "@/domain/entities/Comment";

export interface CreateCommentInput {
  taskId: string;
  description: string;
}

export interface UpdateCommentInput {
  description: string;
}

export interface ICommentRepository {
  listByTask(taskId: string): Promise<Comment[]>;
  get(taskId: string, id: string): Promise<Comment>;
  create(input: CreateCommentInput): Promise<Comment>;
  update(taskId: string, id: string, input: UpdateCommentInput): Promise<Comment>;
  remove(taskId: string, id: string): Promise<void>;
}
