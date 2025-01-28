"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fileUploader = void 0;
const multer_1 = __importDefault(require("multer"));
const storage = multer_1.default.memoryStorage();
const multipleUpload = (0, multer_1.default)({ storage }).fields([
    {
        name: "images",
        maxCount: 10,
    },
]);
const singleUpload = (0, multer_1.default)({ storage });
exports.fileUploader = {
    singleUpload,
    multipleUpload,
};
