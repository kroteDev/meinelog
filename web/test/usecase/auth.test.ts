import { describe, expect, it, vi } from "vitest";
import type { User } from "@/domain/entities/User";
import type { IAuthRepository } from "@/domain/repositories/IAuthRepository";
import type { TokenStore } from "@/infrastructure/auth/tokenStore";
import { signInAndStore, signOutAndClear, signUpAndStore } from "@/usecases/auth";

const user: User = {
  id: 1,
  email: "maria@example.com",
  firstName: "Maria",
  lastName: "Silva",
  sex: "female",
  active: false,
};

function fakeStore(): TokenStore & { token: string | null } {
  return {
    token: null as string | null,
    getToken(this: { token: string | null }) {
      return this.token;
    },
    setToken(this: { token: string | null }, token: string) {
      this.token = token;
    },
    clearToken(this: { token: string | null }) {
      this.token = null;
    },
  };
}

const repo: IAuthRepository = {
  signUp: async () => ({ user, token: "jwt-signup" }),
  signIn: async () => ({ user, token: "jwt-signin" }),
  signOut: async () => {},
};

describe("signUpAndStore / signInAndStore", () => {
  it("stores the session token and returns the user", async () => {
    const store = fakeStore();
    const result = await signInAndStore(repo, store, {
      email: "maria@example.com",
      password: "x",
    });
    expect(result).toEqual(user);
    expect(store.token).toBe("jwt-signin");
  });

  it("stores the signup token", async () => {
    const store = fakeStore();
    await signUpAndStore(repo, store, {
      email: "maria@example.com",
      password: "x",
      passwordConfirmation: "x",
      firstName: "Maria",
      lastName: "Silva",
    });
    expect(store.token).toBe("jwt-signup");
  });
});

describe("signOutAndClear", () => {
  it("signs out with the stored token, then clears it", async () => {
    const store = fakeStore();
    store.token = "jwt-signin";
    const signOut = vi.fn(repo.signOut);
    await signOutAndClear({ ...repo, signOut }, store);
    expect(signOut).toHaveBeenCalledWith("jwt-signin");
    expect(store.token).toBeNull();
  });

  it("clears the token even when signout fails", async () => {
    const store = fakeStore();
    store.token = "jwt-signin";
    const failing: IAuthRepository = {
      ...repo,
      signOut: async () => {
        throw new Error("network");
      },
    };
    await expect(signOutAndClear(failing, store)).rejects.toThrow("network");
    expect(store.token).toBeNull();
  });

  it("clears without calling the API when no token is stored", async () => {
    const store = fakeStore();
    const signOut = vi.fn(repo.signOut);
    await signOutAndClear({ ...repo, signOut }, store);
    expect(signOut).not.toHaveBeenCalled();
    expect(store.token).toBeNull();
  });
});
