import { sortOrderType } from "../../constants/common";

export const imageSearchableFields = ["name", "alt_text"];
export const imageSortableFields = ["id", "name", "created_at", "updated_at"];

export const allowedImageType = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/svg+xml",
  "image/vnd.microsoft.icon",
  "image/webp",
];

export const imageFieldsValidationConfig: Record<string, any> = {
  sort_by: imageSortableFields,
  sort_order: sortOrderType,
  type: allowedImageType,
};

export const prepareTypes = (types: string) => {
  return types.split(",").map((type) => {
    switch (type) {
      case "svg":
        return "image/svg+xml";
      case "ico":
        return "image/vnd.microsoft.icon";
      default:
        return `image/${type}`;
    }
  });
};
