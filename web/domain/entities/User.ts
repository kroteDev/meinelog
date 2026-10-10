export type UserSex = "male" | "female" | "other";

export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  sex: UserSex | null;
  active: boolean;
}
