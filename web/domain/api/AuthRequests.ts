import type { RawUserSex } from "./RawUserDto";

export interface SignUpRequestDto {
  user: {
    email: string;
    password: string;
    password_confirmation: string;
    first_name: string;
    last_name: string;
    sex?: RawUserSex;
  };
}

export interface SignInRequestDto {
  user: {
    email: string;
    password: string;
  };
}
