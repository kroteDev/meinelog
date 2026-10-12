import { describe, expect, it } from "vitest";
import type { RawCommentDto } from "@/domain/api/RawCommentDto";
import { rawToComment, toRawCreateComment, toRawUpdateComment } from "@/infrastructure/api/mappers/commentMapper";

const raw: RawCommentDto = {
  id: "c1d2e3f4-0000-4000-8000-aaaaaaaaaaaa",
  description: "primeiro comentário",
  user_id: 3,
  commentable_type: "Task",
  commentable_id: "bb2a1057-1c2c-45f8-bc9d-95e632aa91c7",
  created_at: "2026-10-10T19:29:46.266Z",
  updated_at: "2026-10-10T19:29:46.266Z",
};

describe("rawToComment", () => {
  it("maps the polymorphic reference without any task_id", () => {
    const comment = rawToComment(raw);
    expect(comment.commentableType).toBe("Task");
    expect(comment.commentableId).toBe("bb2a1057-1c2c-45f8-bc9d-95e632aa91c7");
    expect(comment).not.toHaveProperty("task_id");
    expect(comment).not.toHaveProperty("taskId");
    expect(comment.createdAt).toBeInstanceOf(Date);
  });

  it("rejects unknown commentable types instead of miscasting", () => {
    expect(() => rawToComment({ ...raw, commentable_type: "Project" })).toThrow(
      "Unknown commentable_type: Project",
    );
  });
});

describe("toRawCreateComment / toRawUpdateComment", () => {
  it("sends description alone", () => {
    expect(toRawCreateComment({ taskId: "tid", description: "c" })).toEqual({
      comment: { description: "c" },
    });
    expect(toRawUpdateComment({ description: "editado" })).toEqual({
      comment: { description: "editado" },
    });
  });
});
