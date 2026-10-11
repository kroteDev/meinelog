import type { User, UserSex } from "../entities/User";

export interface SignUpInput {
  email: string;
  password: string;
  passwordConfirmation: string;
  firstName: string;
  lastName: string;
  sex?: UserSex;
}

export interface SignInInput {
  email: string;
  password: string;
}

export interface AuthSession {
  user: User;
  token: string;
}

export interface IAuthRepository {
  signUp(input: SignUpInput): Promise<AuthSession>;
  signIn(input: SignInInput): Promise<AuthSession>;
  signOut(token: string): Promise<void>;
}
