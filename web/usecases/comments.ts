import type { Comment } from "@/domain/entities/Comment";
import type {
  CreateCommentInput,
  ICommentRepository,
  UpdateCommentInput,
} from "@/domain/repositories/ICommentRepository";

export function listTaskComments(
  repo: ICommentRepository,
  taskId: string,
): Promise<Comment[]> {
  return repo.listByTask(taskId);
}

export function getComment(
  repo: ICommentRepository,
  taskId: string,
  id: string,
): Promise<Comment> {
  return repo.get(taskId, id);
}

export function createComment(
  repo: ICommentRepository,
  input: CreateCommentInput,
): Promise<Comment> {
  return repo.create(input);
}

export function updateComment(
  repo: ICommentRepository,
  taskId: string,
  id: string,
  input: UpdateCommentInput,
): Promise<Comment> {
  return repo.update(taskId, id, input);
}

export function deleteComment(
  repo: ICommentRepository,
  taskId: string,
  id: string,
): Promise<void> {
  return repo.remove(taskId, id);
}
