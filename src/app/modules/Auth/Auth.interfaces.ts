import { Provider } from "@prisma/client";

export interface IOTPCreatePayload {
  first_name: string;
  last_name?: string;
  username: string;
  country?: string;
  email: string;
  profile_pic?: string;
}
export interface IRegisterPayload {
  otp: number;
  password: string;
}

export interface ILoginCredential {
  email: string;
  password: string;
}

export interface IChangePasswordPayload {
  old_password: string;
  new_password: string;
}

export type TForgotPasswordPayload = {
  email: string;
  new_password: string;
  otp?: number;
};

export type TAccessBySocialMediaPayload = {
  first_name: string;
  last_name?: string;
  username: string;
  email: string;
  profile_pic?: string;
  provider: Provider;
};
