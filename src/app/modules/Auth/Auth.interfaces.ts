export interface IOTPCreatePayload {
  name: string;
  email?: string;
  password: string;
  contact_number: string;
  profile_pic_id: string;
}
export interface IRegisterPayload {
  otp: number;
  password: string;
}

export interface ILoginCredential {
  email_or_contact_number: string;
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
