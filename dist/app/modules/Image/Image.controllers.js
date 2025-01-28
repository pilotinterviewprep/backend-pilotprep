"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImageControllers = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catch_async_1 = __importDefault(require("../../shared/catch-async"));
const send_response_1 = __importDefault(require("../../shared/send-response"));
const Image_services_1 = require("./Image.services");
const uploadImages = (0, catch_async_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield Image_services_1.ImageServices.uploadImages(req);
    (0, send_response_1.default)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: "Successfully uploaded the images",
        data: result,
    });
}));
const getImages = (0, catch_async_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield Image_services_1.ImageServices.getImages(req.query);
    (0, send_response_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Successfully retrieved the images",
        meta: result.meta,
        data: result.data,
    });
}));
const getImage = (0, catch_async_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield Image_services_1.ImageServices.getImage(req.params.id);
    (0, send_response_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Successfully retrieved the image",
        data: result,
    });
}));
const updateImage = (0, catch_async_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield Image_services_1.ImageServices.updateImage(req.params.id, req.body);
    (0, send_response_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Successfully updated the image name",
        data: result,
    });
}));
const deleteImages = (0, catch_async_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield Image_services_1.ImageServices.deleteImages(req.body);
    (0, send_response_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Successfully deleted the images",
        data: result,
    });
}));
exports.ImageControllers = {
    uploadImages,
    getImages,
    getImage,
    updateImage,
    deleteImages,
};
