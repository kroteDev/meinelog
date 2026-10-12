import { describe, expect, it } from "vitest";
import { formatDate, formatDateTime, timeAgo } from "@/lib/dates";

describe("formatDate", () => {
  it("renders the UTC calendar day", () => {
    expect(formatDate(new Date("2026-10-11T00:00:00.000Z"))).toBe("11 Oct 2026");
  });
});

describe("formatDateTime", () => {
  it("appends the UTC time", () => {
    expect(formatDateTime(new Date("2026-10-11T14:30:00.000Z"))).toBe("11 Oct 2026, 14:30");
  });
});

describe("timeAgo", () => {
  const now = new Date("2026-10-12T12:00:00.000Z");

  it("labels recent moments", () => {
    expect(timeAgo(new Date("2026-10-12T11:59:50.000Z"), now)).toBe("just now");
    expect(timeAgo(new Date("2026-10-12T11:55:00.000Z"), now)).toBe("5m ago");
    expect(timeAgo(new Date("2026-10-12T09:00:00.000Z"), now)).toBe("3h ago");
    expect(timeAgo(new Date("2026-10-10T12:00:00.000Z"), now)).toBe("2d ago");
  });

  it("falls back to the date after a week", () => {
    expect(timeAgo(new Date("2026-10-01T12:00:00.000Z"), now)).toBe("1 Oct 2026");
  });

  it("clamps future dates to just now", () => {
    expect(timeAgo(new Date("2026-10-13T12:00:00.000Z"), now)).toBe("just now");
  });
});
