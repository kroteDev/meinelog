export type RawUserSex = "male" | "female" | "other";

export interface RawUserDto {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  sex: RawUserSex | null;
  active: boolean;
}
