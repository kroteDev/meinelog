import { describe, expect, it, vi } from "vitest";
import type { Comment } from "@/domain/entities/Comment";
import type { ICommentRepository } from "@/domain/repositories/ICommentRepository";
import { createComment, listTaskComments } from "@/usecases/comments";

function commentFor(taskId: string, id: string): Comment {
  return {
    id,
    description: `c-${id}`,
    userId: 1,
    commentableType: "Task",
    commentableId: taskId,
    createdAt: new Date("2026-10-10T19:29:46.266Z"),
    updatedAt: new Date("2026-10-10T19:29:46.266Z"),
  };
}

const store: Record<string, Comment[]> = {
  "task-a": [commentFor("task-a", "c1")],
  "task-b": [commentFor("task-b", "c2"), commentFor("task-b", "c3")],
};

const repo: ICommentRepository = {
  listByTask: async (taskId: string) => store[taskId] ?? [],
  get: async (taskId: string, id: string) => {
    const found = (store[taskId] ?? []).find((c) => c.id === id);
    if (!found) throw new Error("not found");
    return found;
  },
  create: async (input) => commentFor(input.taskId, "c-new"),
  update: async (taskId: string, id: string) => commentFor(taskId, id),
  remove: async () => {},
};

describe("listTaskComments", () => {
  it("keeps each task's comments isolated", async () => {
    await expect(listTaskComments(repo, "task-a")).resolves.toHaveLength(1);
    await expect(listTaskComments(repo, "task-b")).resolves.toHaveLength(2);
    await expect(listTaskComments(repo, "unknown")).resolves.toHaveLength(0);
  });
});

describe("createComment", () => {
  it("creates through the parent task scope", async () => {
    const create = vi.fn(repo.create);
    const result = await createComment({ ...repo, create }, { taskId: "task-a", description: "hi" });
    expect(create).toHaveBeenCalledWith({ taskId: "task-a", description: "hi" });
    expect(result.commentableId).toBe("task-a");
  });
});
