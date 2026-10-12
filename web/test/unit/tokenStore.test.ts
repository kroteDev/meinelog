import { describe, expect, it, vi } from "vitest";
import { localStorageTokenStore } from "@/infrastructure/auth/tokenStore";

function stubStorage() {
  const data = new Map<string, string>();
  vi.stubGlobal("window", {
    localStorage: {
      getItem: (key: string) => (data.has(key) ? data.get(key)! : null),
      setItem: (key: string, value: string) => void data.set(key, value),
      removeItem: (key: string) => void data.delete(key),
    },
  });
  return () => vi.unstubAllGlobals();
}

describe("localStorageTokenStore", () => {
  it("roundtrips set/get/clear", () => {
    const unstub = stubStorage();
    try {
      expect(localStorageTokenStore.getToken()).toBeNull();
      localStorageTokenStore.setToken("jwt-123");
      expect(localStorageTokenStore.getToken()).toBe("jwt-123");
      localStorageTokenStore.clearToken();
      expect(localStorageTokenStore.getToken()).toBeNull();
    } finally {
      unstub();
    }
  });

  it("is a no-op without a browser (SSR guard)", () => {
    expect(localStorageTokenStore.getToken()).toBeNull();
    expect(() => localStorageTokenStore.setToken("x")).not.toThrow();
    expect(() => localStorageTokenStore.clearToken()).not.toThrow();
  });
});
