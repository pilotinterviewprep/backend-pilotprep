"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prepareTypes = exports.imageFieldsValidationConfig = exports.allowedImageType = exports.imageSortableFields = exports.imageSearchableFields = void 0;
const common_1 = require("../../constants/common");
exports.imageSearchableFields = ["name", "alt_text"];
exports.imageSortableFields = ["id", "name", "created_at", "updated_at"];
exports.allowedImageType = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/svg+xml",
    "image/vnd.microsoft.icon",
    "image/webp",
];
exports.imageFieldsValidationConfig = {
    sort_by: exports.imageSortableFields,
    sort_order: common_1.sortOrderType,
    type: exports.allowedImageType,
};
const prepareTypes = (types) => {
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
exports.prepareTypes = prepareTypes;
