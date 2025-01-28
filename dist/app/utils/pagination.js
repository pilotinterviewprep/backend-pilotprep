"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pagination = (paginationOptions) => {
    const { page, limit, sortBy, sortOrder } = paginationOptions;
    const pageNumber = Number(page) || 1;
    const limitNumber = Number(limit) || 10;
    const skip = (pageNumber - 1) * limitNumber;
    const sortWith = sortBy || "created_at";
    const sortSequence = sortOrder || "desc";
    return {
        pageNumber,
        limitNumber,
        skip,
        sortWith,
        sortSequence,
    };
};
exports.default = pagination;
