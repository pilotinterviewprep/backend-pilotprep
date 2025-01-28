"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zodError = (err) => {
    const errorSources = err.issues.map((issue) => ({
        path: issue.path[issue.path.length - 1],
        message: issue.message,
    }));
    let message = "Validation error!";
    const statusCode = 400;
    if (errorSources === null || errorSources === void 0 ? void 0 : errorSources.length) {
        message = errorSources.map((item) => item.message).join(" | ");
    }
    return {
        statusCode,
        message,
        errorSources,
    };
};
exports.default = zodError;
