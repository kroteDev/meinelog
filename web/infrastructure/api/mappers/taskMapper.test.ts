import { describe, expect, it } from "vitest";
import type { RawTaskDto } from "../../../domain/api/RawTaskDto";
import { rawToTask, toRawComplete, toRawCreateTask, toRawUpdateTask } from "./taskMapper";

const raw: RawTaskDto = {
  id: "bb2a1057-1c2c-45f8-bc9d-95e632aa91c7",
  title: "checkbox task",
  description: null,
  complete: false,
  priority: "trivial",
  due_date: null,
  user_id: 3,
  project_id: null,
  created_at: "2026-10-10T19:29:46.253Z",
  updated_at: "2026-10-10T19:29:46.253Z",
};

describe("rawToTask", () => {
  it("keeps priority as a string union and nullables as null", () => {
    const task = rawToTask(raw);
    expect(task.priority).toBe("trivial");
    expect(typeof task.priority).toBe("string");
    expect(task.description).toBeNull();
    expect(task.dueDate).toBeNull();
    expect(task.projectId).toBeNull();
    expect(task.userId).toBe(3);
  });

  it("parses dates into Date instances", () => {
    const task = rawToTask({ ...raw, due_date: "2026-10-11" });
    expect(task.dueDate).toEqual(new Date("2026-10-11"));
    expect(task.createdAt).toBeInstanceOf(Date);
  });
});

describe("toRawCreateTask", () => {
  it("formats dueDate as YYYY-MM-DD", () => {
    expect(
      toRawCreateTask({ title: "t", dueDate: new Date("2026-10-11T00:00:00.000Z") }),
    ).toEqual({ task: { title: "t", due_date: "2026-10-11" } });
  });

  it("passes project_id through and omits absent keys", () => {
    expect(toRawCreateTask({ title: "t", projectId: "pid-1" })).toEqual({
      task: { title: "t", project_id: "pid-1" },
    });
    expect(toRawCreateTask({ title: "t" })).toEqual({ task: { title: "t" } });
  });

  it("sends explicit null to clear fields", () => {
    expect(toRawCreateTask({ title: "t", dueDate: null, projectId: null })).toEqual({
      task: { title: "t", due_date: null, project_id: null },
    });
  });
});

describe("toRawUpdateTask", () => {
  it("sends only the provided fields", () => {
    expect(toRawUpdateTask({ title: "renamed" })).toEqual({ task: { title: "renamed" } });
  });
});

describe("toRawComplete", () => {
  it("sends complete alone, never other attributes", () => {
    expect(toRawComplete(true)).toEqual({ task: { complete: true } });
    expect(toRawComplete(false)).toEqual({ task: { complete: false } });
  });
});
