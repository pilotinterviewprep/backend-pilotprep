"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImageValidations = void 0;
const zod_1 = require("zod");
const deleteImagesValidationSchema = zod_1.z.object({
    body: zod_1.z
        .object({
        images_path: zod_1.z.array(zod_1.z
            .string({ invalid_type_error: "Image path must be a text" })
            .min(1, "Image path should not be empty string")),
    })
        .strict(),
});
const updateImageValidationSchema = zod_1.z.object({
    body: zod_1.z
        .object({
        name: zod_1.z
            .string({
            invalid_type_error: "Updated name must be a text",
        })
            .min(1, "Cann't save empty name")
            .optional(),
        alt_text: zod_1.z
            .string({
            invalid_type_error: "Updated name must be a text",
        })
            .optional(),
    })
        .strict(),
});
exports.ImageValidations = {
    deleteImagesValidationSchema,
    updateImageValidationSchema,
};
