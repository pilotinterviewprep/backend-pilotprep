"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthValidations = void 0;
const zod_1 = require("zod");
const createOTPValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z
            .string({
            required_error: "Name is required",
            invalid_type_error: "Name must be a text",
        })
            .min(1, "Name is required"),
        email: zod_1.z.string().email({ message: "Invalid email" }).optional(),
        contact_number: zod_1.z.string({ required_error: "Contact number is required" }),
    }),
});
const registerValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        otp: zod_1.z
            .number({ required_error: "OTP is required" })
            .min(6, { message: "OTP is invalid" }),
        password: zod_1.z
            .string({ required_error: "Password is required" })
            .min(6, { message: "Password must be at least 6 characters long" })
            .regex(/^(?=.*[a-zA-Z])(?=.*\d)/, {
            message: "Password must contain at least one letter and one number",
        }),
    }),
});
const loginValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        email_or_contact_number: zod_1.z
            .string()
            .min(1, { message: "Email or contact number is required" }),
        password: zod_1.z.string({ required_error: "Password is required" }),
    }),
});
const resetPasswordValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        old_password: zod_1.z.string().min(6, "Old valid password is required"),
        new_password: zod_1.z
            .string({ required_error: "New password is required" })
            .min(6, { message: "password must be at least 6 characters long" })
            .regex(/^(?=.*[a-zA-Z])(?=.*\d)/, {
            message: "Password must contain at least one letter and one number",
        }),
    }),
});
const forgotPasswordValidationSchema = zod_1.z.object({
    body: zod_1.z
        .object({
        email: zod_1.z
            .string({ required_error: "Email is required" })
            .email({ message: "Invalid email address" }),
        otp: zod_1.z
            .number({
            invalid_type_error: "OTP should be a number",
            required_error: "OTP is required",
        })
            .optional(),
        new_password: zod_1.z
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
exports.AuthValidations = {
    resetPasswordValidationSchema,
    registerValidationSchema,
    createOTPValidationSchema,
    loginValidationSchema,
    forgotPasswordValidationSchema,
};
