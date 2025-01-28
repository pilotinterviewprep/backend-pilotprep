import { z } from "zod";

const deleteImagesValidationSchema = z.object({
  body: z
    .object({
      images_path: z.array(
        z
          .string({ invalid_type_error: "Image path must be a text" })
          .min(1, "Image path should not be empty string")
      ),
    })
    .strict(),
});

const updateImageValidationSchema = z.object({
  body: z
    .object({
      name: z
        .string({
          invalid_type_error: "Updated name must be a text",
        })
        .min(1, "Cann't save empty name")
        .optional(),
      alt_text: z
        .string({
          invalid_type_error: "Updated name must be a text",
        })
        .optional(),
    })
    .strict(),
});

export const ImageValidations = {
  deleteImagesValidationSchema,
  updateImageValidationSchema,
};
