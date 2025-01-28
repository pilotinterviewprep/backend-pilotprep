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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthControllers = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catch_async_1 = __importDefault(require("../../shared/catch-async"));
const send_response_1 = __importDefault(require("../../shared/send-response"));
const Auth_services_1 = require("./Auth.services");
const createOTP = (0, catch_async_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield Auth_services_1.AuthServices.createOTP(req.body);
    (0, send_response_1.default)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: "OTP sent successfully. Check your email and contact number",
        data: result,
    });
}));
const register = (0, catch_async_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield Auth_services_1.AuthServices.register(req.body);
    (0, send_response_1.default)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: "User registration is successful",
        data: result,
    });
}));
const login = (0, catch_async_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const _a = yield Auth_services_1.AuthServices.login(req.body), { refreshToken } = _a, result = __rest(_a, ["refreshToken"]);
    const maxAge = 60 * 24 * 60 * 60 * 1000;
    res.cookie("refresh_token", refreshToken, { maxAge, httpOnly: true });
    (0, send_response_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "User login is successful",
        data: result,
    });
}));
const getAccessToken = (0, catch_async_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const result = yield Auth_services_1.AuthServices.getAccessToken((_a = req.cookies) === null || _a === void 0 ? void 0 : _a.refresh_token);
    (0, send_response_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Access token generated successfully",
        data: result,
    });
}));
const resetPassword = (0, catch_async_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const _a = yield Auth_services_1.AuthServices.resetPassword(req === null || req === void 0 ? void 0 : req.user, req.body), { refreshToken } = _a, result = __rest(_a, ["refreshToken"]);
    const maxAge = 60 * 24 * 60 * 60 * 1000;
    res.cookie("refresh_token", refreshToken, { maxAge, httpOnly: true });
    (0, send_response_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Password reset is successful",
        data: result,
    });
}));
const forgotPassword = (0, catch_async_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield Auth_services_1.AuthServices.forgotPassword(req.body);
    (0, send_response_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "New password sent to your email",
        data: result,
    });
}));
exports.AuthControllers = {
    createOTP,
    register,
    login,
    resetPassword,
    forgotPassword,
    getAccessToken,
};
