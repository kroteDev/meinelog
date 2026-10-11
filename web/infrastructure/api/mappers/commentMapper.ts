import type {
  CreateCommentRequestDto,
  UpdateCommentRequestDto,
} from "@/domain/api/CommentRequests";
import type { RawCommentDto } from "@/domain/api/RawCommentDto";
import type {
  CreateCommentInput,
  UpdateCommentInput,
} from "@/domain/repositories/ICommentRepository";
import type { Comment, CommentableType } from "@/domain/entities/Comment";

const KNOWN_COMMENTABLE_TYPES: readonly string[] = ["Task"] as const;

function toCommentableType(raw: string): CommentableType {
  if (!(KNOWN_COMMENTABLE_TYPES as readonly string[]).includes(raw)) {
    throw new Error(`Unknown commentable_type: ${raw}`);
  }
  return raw as CommentableType;
}

export function rawToComment(raw: RawCommentDto): Comment {
  return {
    id: raw.id,
    description: raw.description,
    userId: raw.user_id,
    commentableType: toCommentableType(raw.commentable_type),
    commentableId: raw.commentable_id,
    createdAt: new Date(raw.created_at),
    updatedAt: new Date(raw.updated_at),
  };
}

export function toRawCreateComment(input: CreateCommentInput): CreateCommentRequestDto {
  return { comment: { description: input.description } };
}

export function toRawUpdateComment(input: UpdateCommentInput): UpdateCommentRequestDto {
  return { comment: { description: input.description } };
}
