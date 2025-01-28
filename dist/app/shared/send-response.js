"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sendResponse = (res, jsonData) => {
    res.status(jsonData === null || jsonData === void 0 ? void 0 : jsonData.statusCode).json({
        success: jsonData === null || jsonData === void 0 ? void 0 : jsonData.success,
        message: jsonData === null || jsonData === void 0 ? void 0 : jsonData.message,
        meta: (jsonData === null || jsonData === void 0 ? void 0 : jsonData.meta) || null || undefined,
        data: jsonData === null || jsonData === void 0 ? void 0 : jsonData.data,
    });
};
exports.default = sendResponse;
