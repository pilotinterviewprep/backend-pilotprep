"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_1 = __importDefault(require("http-status"));
const zod_1 = require("zod");
const config_1 = __importDefault(require("../../config"));
const zod_error_1 = __importDefault(require("../error/zod-error"));
const client_1 = require("@prisma/client");
const prisma_client_known_error_1 = __importDefault(require("../error/prisma-client-known-error"));
const prisma_validation_error_1 = __importDefault(require("../error/prisma-validation-error"));
const globalErrorHandler = (error, req, res, next) => {
    let statusCode = error.statusCode || http_status_1.default.INTERNAL_SERVER_ERROR;
    let message = error.message || "Something went wrong!";
    let errorSources = [
        {
            path: "",
            message: error.message || "",
        },
    ];
    console.log("check error: ", error);
    if (error instanceof zod_1.ZodError) {
        const simplifiedError = (0, zod_error_1.default)(error);
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
        errorSources = simplifiedError.errorSources;
    }
    else if (error instanceof client_1.Prisma.PrismaClientValidationError) {
        const simplifiedError = (0, prisma_validation_error_1.default)(error);
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
        errorSources = simplifiedError.errorSources;
    }
    else if (error instanceof client_1.Prisma.PrismaClientKnownRequestError) {
        const simplifiedError = (0, prisma_client_known_error_1.default)(error);
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
        errorSources = simplifiedError.errorSources;
    }
    else if (error.message === "jwt expired") {
        statusCode = http_status_1.default.UNAUTHORIZED;
        message = "Token has been expired";
    }
    res.status(statusCode).json({
        success: false,
        message: message,
        errorSources,
        stack: config_1.default.node_env === "development" ? error.stack : null,
    });
};
exports.default = globalErrorHandler;
