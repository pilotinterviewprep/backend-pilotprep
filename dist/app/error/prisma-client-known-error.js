"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_1 = __importDefault(require("http-status"));
const prismaClientKnownError = (err) => {
    var _a, _b, _c;
    let statusCode = 400;
    let message = "Database error!";
    let errorSources = [];
    if (err.code === "P2002" && ((_a = err.meta) === null || _a === void 0 ? void 0 : _a.target)) {
        statusCode = http_status_1.default.CONFLICT;
        message = "Duplicate value exists.";
        errorSources = err.meta.target.map((field) => {
            var _a;
            return ({
                path: field,
                message: `The ${field} is already exists in the ${(_a = err.meta) === null || _a === void 0 ? void 0 : _a.modelName}. Please try another ${field} or undo from the trash`,
            });
        });
        if (errorSources.length)
            message = errorSources.map((item) => item.message).join(" | ");
    }
    else if (err.code === "P2025") {
        statusCode = http_status_1.default.NOT_FOUND;
        message = err.message.length < 200 ? err.message : "Data not found";
        errorSources = [
            {
                path: (_b = err.meta) === null || _b === void 0 ? void 0 : _b.modelName,
                message: ((_c = err.meta) === null || _c === void 0 ? void 0 : _c.cause) || err.message,
            },
        ];
    }
    else if (err.code === "P2003") {
        console.log(err);
    }
    return {
        statusCode,
        message,
        errorSources,
    };
};
exports.default = prismaClientKnownError;
