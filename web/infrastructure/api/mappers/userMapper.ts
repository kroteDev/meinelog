import type { SignInRequestDto, SignUpRequestDto } from "@/domain/api/AuthRequests";
import type { RawUserDto } from "@/domain/api/RawUserDto";
import type { SignInInput, SignUpInput } from "@/domain/repositories/IAuthRepository";
import type { User } from "@/domain/entities/User";

export function rawToUser(raw: RawUserDto): User {
  return {
    id: raw.id,
    email: raw.email,
    firstName: raw.first_name,
    lastName: raw.last_name,
    sex: raw.sex,
    active: raw.active,
  };
}

export function toRawSignUp(input: SignUpInput): SignUpRequestDto {
  return {
    user: {
      email: input.email,
      password: input.password,
      password_confirmation: input.passwordConfirmation,
      first_name: input.firstName,
      last_name: input.lastName,
      ...(input.sex !== undefined ? { sex: input.sex } : {}),
    },
  };
}

export function toRawSignIn(input: SignInInput): SignInRequestDto {
  return {
    user: {
      email: input.email,
      password: input.password,
    },
  };
}
