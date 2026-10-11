import { describe, expect, it } from "vitest";
import type { RawUserDto } from "../../../domain/api/RawUserDto";
import { rawToUser, toRawSignIn, toRawSignUp } from "./userMapper";

const raw: RawUserDto = {
  id: 15,
  email: "g@example.com",
  first_name: "T",
  last_name: "U",
  sex: "male",
  active: false,
};

describe("rawToUser", () => {
  it("keeps id as a number and maps names to camelCase", () => {
    const user = rawToUser(raw);
    expect(user.id).toBe(15);
    expect(typeof user.id).toBe("number");
    expect(user.firstName).toBe("T");
    expect(user.lastName).toBe("U");
    expect(user.sex).toBe("male");
    expect(user.active).toBe(false);
  });

  it("keeps sex nullable", () => {
    expect(rawToUser({ ...raw, sex: null }).sex).toBeNull();
  });
});

describe("toRawSignUp", () => {
  it("builds the exact wire payload with password_confirmation", () => {
    expect(
      toRawSignUp({
        email: "maria@example.com",
        password: "SenhaSegura123",
        passwordConfirmation: "SenhaSegura123",
        firstName: "Maria",
        lastName: "Silva",
        sex: "female",
      }),
    ).toEqual({
      user: {
        email: "maria@example.com",
        password: "SenhaSegura123",
        password_confirmation: "SenhaSegura123",
        first_name: "Maria",
        last_name: "Silva",
        sex: "female",
      },
    });
  });

  it("omits sex when absent", () => {
    const payload = toRawSignUp({
      email: "a@b.c",
      password: "x",
      passwordConfirmation: "x",
      firstName: "T",
      lastName: "U",
    });
    expect(payload.user).not.toHaveProperty("sex");
  });
});

describe("toRawSignIn", () => {
  it("sends email and password only", () => {
    expect(toRawSignIn({ email: "a@b.c", password: "x" })).toEqual({
      user: { email: "a@b.c", password: "x" },
    });
  });
});
