import { describe, expect, it, vi } from "vitest";
import type { Project } from "@/domain/entities/Project";
import type { Task } from "@/domain/entities/Task";
import type { IProjectRepository } from "@/domain/repositories/IProjectRepository";
import type { ITaskRepository } from "@/domain/repositories/ITaskRepository";
import { getProjectWithTasks, listProjects } from "@/usecases/projects";

const project: Project = {
  id: "p1",
  name: "P",
  description: "d",
  userId: 1,
  createdAt: new Date("2026-10-08T23:06:12.292Z"),
  updatedAt: new Date("2026-10-08T23:06:12.292Z"),
};

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

describe("listProjects", () => {
  it("delegates to the repository", async () => {
    const repo: IProjectRepository = {
      list: async () => [project],
      get: async () => project,
      create: async () => project,
      update: async () => project,
      remove: async () => {},
    };
    await expect(listProjects(repo)).resolves.toEqual([project]);
  });
});

describe("getProjectWithTasks", () => {
  it("loads project and tasks concurrently and combines them", async () => {
    const projects: IProjectRepository = {
      list: async () => [],
      get: vi.fn(async () => project),
      create: async () => project,
      update: async () => project,
      remove: async () => {},
    };
    const tasks: ITaskRepository = {
      list: async () => [],
      listByProject: vi.fn(async () => [task]),
      get: async () => task,
      create: async () => task,
      update: async () => task,
      complete: async () => task,
      remove: async () => {},
    };
    await expect(getProjectWithTasks(projects, tasks, "p1")).resolves.toEqual({
      project,
      tasks: [task],
    });
    expect(projects.get).toHaveBeenCalledWith("p1");
    expect(tasks.listByProject).toHaveBeenCalledWith("p1");
  });
});
