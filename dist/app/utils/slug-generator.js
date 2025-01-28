"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.slugGenerator = void 0;
const slugGenerator = (str) => {
    const slug = str
        .trim()
        .toLowerCase()
        .replace(/ /g, "-")
        .replace(/[^\w-]+/g, "");
    return slug;
};
exports.slugGenerator = slugGenerator;
