import { Provider } from "@prisma/client";
import { z } from "zod";

const createOTPValidationSchema = z.object({
  body: z.object({
    name: z
      .string({
        required_error: "Name is required",
        invalid_type_error: "Name must be a text",
      })
      .min(1, "Name is required"),
    email: z.string().email({ message: "Invalid email" }).optional(),
    contact_number: z.string({ required_error: "Contact number is required" }),
  }),
});

const registerValidationSchema = z.object({
  body: z.object({
    otp: z
      .number({ required_error: "OTP is required" })
      .min(6, { message: "OTP is invalid" }),
    password: z
      .string({ required_error: "Password is required" })
      .min(6, { message: "Password must be at least 6 characters long" })
      .regex(/^(?=.*[a-zA-Z])(?=.*\d)/, {
        message: "Password must contain at least one letter and one number",
      }),
  }),
});

const loginValidationSchema = z.object({
  body: z.object({
    email_or_contact_number: z
      .string()
      .min(1, { message: "Email or contact number is required" }),
    password: z.string({ required_error: "Password is required" }),
  }),
});

const resetPasswordValidationSchema = z.object({
  body: z.object({
    old_password: z.string().min(6, "Old valid password is required"),
    new_password: z
      .string({ required_error: "New password is required" })
      .min(6, { message: "password must be at least 6 characters long" })
      .regex(/^(?=.*[a-zA-Z])(?=.*\d)/, {
        message: "Password must contain at least one letter and one number",
      }),
  }),
});

const forgotPasswordValidationSchema = z.object({
  body: z
    .object({
      email: z
        .string({ required_error: "Email is required" })
        .email({ message: "Invalid email address" }),
      otp: z
        .number({
          invalid_type_error: "OTP should be a number",
          required_error: "OTP is required",
        })
        .optional(),
      new_password: z
        .string({
          invalid_type_error: "Password should be a text",
          required_error: "Password is required",
        })
        .min(6, { message: "Password must be at least 6 characters long" })
        .regex(/^(?=.*[a-zA-Z])(?=.*\d)/, {
          message: "Password must contain at least one letter and one number",
        })
        .optional(),
    })
    .strict(),
});

export const socialLoginValidationSchema = z.object({
  body: z.object({
    name: z.string({
      required_error: "Name is required",
      invalid_type_error: "Name must be a text",
    }),
    email: z
      .string({ required_error: "Email is required" })
      .email({ message: "Invalid email" }),
    contact_number: z.string().optional().nullable(),
    provider: z.enum(Object.values(Provider) as [string]),
    profile_pic: z.string().optional(),
  }),
});

export const AuthValidations = {
  resetPasswordValidationSchema,
  registerValidationSchema,
  createOTPValidationSchema,
  loginValidationSchema,
  forgotPasswordValidationSchema,
  socialLoginValidationSchema,
};
