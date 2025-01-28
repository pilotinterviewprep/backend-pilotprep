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
exports.UserControllers = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catch_async_1 = __importDefault(require("../../shared/catch-async"));
const send_response_1 = __importDefault(require("../../shared/send-response"));
const User_services_1 = require("./User.services");
const pick_1 = require("../../utils/pick");
const User_constants_1 = require("./User.constants");
const getUsers = (0, catch_async_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const filteredQuery = (0, pick_1.pick)(req.query, User_constants_1.userFilterableFields);
    const result = yield User_services_1.UserServices.getUsers(filteredQuery);
    (0, send_response_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Users retrieved are successful",
        meta: result.meta,
        data: result.data,
    });
}));
const getUser = (0, catch_async_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield User_services_1.UserServices.getUser(req.params.id);
    (0, send_response_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "User retrieved is successful",
        data: result,
    });
}));
const getMe = (0, catch_async_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield User_services_1.UserServices.getMe(req.user);
    (0, send_response_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Profile retrieved is successful",
        data: result,
    });
}));
const updateProfile = (0, catch_async_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield User_services_1.UserServices.updateProfile(req.user, req.body, req.file);
    (0, send_response_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Profile updated is successful",
        data: result,
    });
}));
const updateUserRoleAndStatus = (0, catch_async_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield User_services_1.UserServices.updateUser(req.user, req.params.id, req.body);
    (0, send_response_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Successfully updated the user",
        data: result,
    });
}));
exports.UserControllers = {
    getUsers,
    getUser,
    getMe,
    updateProfile,
    updateUserRoleAndStatus,
};
