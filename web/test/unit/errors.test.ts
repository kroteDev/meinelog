import { describe, expect, it } from "vitest";
import { ApiError } from "@/infrastructure/api/httpClient";
import { toUserMessage } from "@/lib/errors";

describe("toUserMessage", () => {
  it("maps auth and missing-resource statuses", () => {
    expect(toUserMessage(new ApiError(401, ["x"]))).toBe(
      "Your session expired. Please sign in again.",
    );
    expect(toUserMessage(new ApiError(404, []))).toBe("Not found. It may have been deleted.");
  });

  it("surfaces validation messages", () => {
    expect(toUserMessage(new ApiError(422, ["Title can't be blank"]))).toBe(
      "Title can't be blank",
    );
    expect(toUserMessage(new ApiError(422, []))).toBe("Couldn't save. Please check the fields.");
  });

  it("falls back for other API statuses", () => {
    expect(toUserMessage(new ApiError(500, []))).toBe("Request failed (500). Please try again.");
  });

  it("maps network failures", () => {
    expect(toUserMessage(new TypeError("fetch failed"))).toBe(
      "Couldn't reach the server. Check your connection.",
    );
  });

  it("maps anything else generically", () => {
    expect(toUserMessage(new Error("boom"))).toBe("Something went wrong. Please try again.");
    expect(toUserMessage("boom")).toBe("Something went wrong. Please try again.");
  });
});
