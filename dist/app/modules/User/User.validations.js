"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserValidations = void 0;
const zod_1 = require("zod");
const User_constants_1 = require("./User.constants");
const updateProfileValidationSchema = zod_1.z.object({
    body: zod_1.z
        .object({
        name: zod_1.z
            .string({
            invalid_type_error: "Name must be a text",
        })
            .optional(),
        email: zod_1.z.string().email({ message: "Invalid email" }).optional(),
    })
        .strict(),
});
const updateUserRoleAndStatusValidationSchema = zod_1.z.object({
    body: zod_1.z
        .object({
        role: zod_1.z
            .enum(["USER", "RETAILER", "ADMIN"], {
            message: "Invalid role",
        })
            .optional(),
        status: zod_1.z
            .enum([...User_constants_1.userStatus], {
            message: "Invalid status",
        })
            .optional(),
        is_deleted: zod_1.z.boolean().optional(),
    })
        .strict()
        .refine((data) => data.role || data.status || data.is_deleted, {
        path: ["role", "status", "is_deleted"],
        message: "Either role, status or is_deleted must be provided",
    }),
});
exports.UserValidations = {
    updateProfileValidationSchema,
    updateUserRoleAndStatusValidationSchema,
};
