import { describe, expect, it } from "vitest";
import type { RawProjectDto } from "../../../domain/api/RawProjectDto";
import { rawToProject, toRawCreateProject, toRawUpdateProject } from "./projectMapper";

const raw: RawProjectDto = {
  id: "02003f8e-5690-47b6-847b-741cc344415c",
  name: "Meu primeiro projeto",
  description: "Criado via API com token JWT",
  user_id: 1,
  created_at: "2026-10-08T23:06:12.292Z",
  updated_at: "2026-10-08T23:06:12.292Z",
};

describe("rawToProject", () => {
  it("maps snake_case to camelCase and parses dates", () => {
    expect(rawToProject(raw)).toEqual({
      id: "02003f8e-5690-47b6-847b-741cc344415c",
      name: "Meu primeiro projeto",
      description: "Criado via API com token JWT",
      userId: 1,
      createdAt: new Date("2026-10-08T23:06:12.292Z"),
      updatedAt: new Date("2026-10-08T23:06:12.292Z"),
    });
  });

  it("produces real Date instances", () => {
    const project = rawToProject(raw);
    expect(project.createdAt).toBeInstanceOf(Date);
    expect(project.updatedAt).toBeInstanceOf(Date);
  });
});

describe("toRawCreateProject", () => {
  it("builds the exact wire payload", () => {
    expect(toRawCreateProject({ name: "N", description: "D" })).toEqual({
      project: { name: "N", description: "D" },
    });
  });
});

describe("toRawUpdateProject", () => {
  it("sends only the provided fields", () => {
    expect(toRawUpdateProject({ name: "Novo" })).toEqual({ project: { name: "Novo" } });
    expect(toRawUpdateProject({})).toEqual({ project: {} });
  });
});
