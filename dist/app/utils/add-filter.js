"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const addFilter = (conditions, field, operator, value) => {
    if (value !== undefined && value !== null && !Number.isNaN(value)) {
        conditions.push({
            [field]: {
                [operator]: value,
            },
        });
    }
};
exports.default = addFilter;
