import { describe, expect, it } from "vitest";
import type { TaskPriority } from "@/domain/entities/Task";
import { getPriorityMeta, PRIORITY_LABELS, PRIORITY_ORDER, PRIORITY_TONES } from "@/lib/priority";

const ALL: TaskPriority[] = ["trivial", "low", "medium", "high", "critical"];

describe("priority metadata", () => {
  it("covers every priority level", () => {
    expect([...PRIORITY_ORDER].sort()).toEqual([...ALL].sort());
    for (const priority of ALL) {
      expect(typeof PRIORITY_LABELS[priority]).toBe("string");
      expect(typeof PRIORITY_TONES[priority]).toBe("string");
    }
  });

  it("orders critical last and trivial first", () => {
    expect(getPriorityMeta("trivial")).toEqual({ label: "Trivial", tone: "neutral", level: 0 });
    expect(getPriorityMeta("critical")).toEqual({ label: "Critical", tone: "critical", level: 4 });
  });
});
