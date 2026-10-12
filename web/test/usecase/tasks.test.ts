import { describe, expect, it, vi } from "vitest";
import type { Task } from "@/domain/entities/Task";
import type { ITaskRepository } from "@/domain/repositories/ITaskRepository";
import { listProjectTasks, toggleTaskComplete } from "@/usecases/tasks";

const task: Task = {
  id: "t1",
  title: "t",
  description: null,
  complete: false,
  priority: "trivial",
  dueDate: null,
  userId: 1,
  projectId: "p1",
  createdAt: new Date("2026-10-10T19:29:46.253Z"),
  updatedAt: new Date("2026-10-10T19:29:46.253Z"),
};

function fakeRepo(overrides: Partial<ITaskRepository> = {}): ITaskRepository {
  return {
    list: async () => [task],
    listByProject: async (projectId: string) =>
      [task].filter((t) => t.projectId === projectId),
    get: async () => task,
    create: async () => task,
    update: async () => task,
    complete: async (_id: string, complete: boolean) => ({ ...task, complete }),
    remove: async () => {},
    ...overrides,
  };
}

describe("toggleTaskComplete", () => {
  it("passes the explicit boolean through to the dedicated endpoint", async () => {
    const complete = vi.fn(fakeRepo().complete);
    const repo = fakeRepo({ complete });
    await expect(toggleTaskComplete(repo, "t1", true)).resolves.toMatchObject({
      id: "t1",
      complete: true,
    });
    expect(complete).toHaveBeenCalledWith("t1", true);
  });
});

describe("listProjectTasks", () => {
  it("scopes tasks to the given project", async () => {
    const repo = fakeRepo();
    await expect(listProjectTasks(repo, "p1")).resolves.toHaveLength(1);
    await expect(listProjectTasks(repo, "other")).resolves.toHaveLength(0);
  });
});
