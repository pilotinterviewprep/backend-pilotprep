import { z } from "zod";
import { userStatus } from "./User.constants";

const updateProfileValidationSchema = z.object({
  body: z
    .object({
      name: z
        .string({
          invalid_type_error: "Name must be a text",
        })
        .optional(),
      email: z.string().email({ message: "Invalid email" }).optional(),
    })
    .strict(),
});

const updateUserRoleAndStatusValidationSchema = z.object({
  body: z
    .object({
      role: z
        .enum(["USER", "RETAILER", "ADMIN"], {
          message: "Invalid role",
        })
        .optional(),
      status: z
        .enum([...userStatus] as [string], {
          message: "Invalid status",
        })
        .optional(),
      is_deleted: z.boolean().optional(),
    })
    .strict()
    .refine((data) => data.role || data.status || data.is_deleted, {
      path: ["role", "status", "is_deleted"],
      message: "Either role, status or is_deleted must be provided",
    }),
});

export const UserValidations = {
  updateProfileValidationSchema,
  updateUserRoleAndStatusValidationSchema,
};
