"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.AuthServices = void 0;
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const http_status_1 = __importDefault(require("http-status"));
const config_1 = __importDefault(require("../../../config"));
const api_error_1 = __importDefault(require("../../error/api-error"));
const prisma_1 = __importDefault(require("../../shared/prisma"));
const jwt_helper_1 = require("../../utils/jwt-helper");
const otp_sender_1 = __importStar(require("../../utils/otp-sender"));
const email_sender_1 = __importDefault(require("../../utils/email-sender"));
const User_constants_1 = require("../User/User.constants");
const createOTP = (data) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const generatedOTP = (0, otp_sender_1.OTPGenerator)();
    const expirationTime = (new Date().getTime() + 2 * 60000).toString();
    const SMSBody = `Dear ${data.name || "customer"}, your OTP is: ${generatedOTP} \n${config_1.default.app_name}`;
    const emailBody = `<div style="background-color: #F5F5F5; padding: 40px; text-align: center">
            <h4 style="font-size: 16px; font-weight: bold; color: #3352ff">Your OTP is <span>${generatedOTP}</span></h4>
        </div>`;
    let emailResponse;
    if (data.email) {
        emailResponse = yield (0, email_sender_1.default)(data.email, emailBody);
    }
    const SMSResponse = yield (0, otp_sender_1.default)(data.contact_number, SMSBody);
    if (((_a = emailResponse === null || emailResponse === void 0 ? void 0 : emailResponse.accepted) === null || _a === void 0 ? void 0 : _a.length) === 0 && SMSResponse.success === false)
        throw new api_error_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, "Failed to send OTP");
    const result = yield prisma_1.default.oTP.create({
        data: {
            name: data.name,
            email: data.email || null,
            contact_number: data.contact_number,
            otp: generatedOTP,
            expires_at: expirationTime,
        },
        select: {
            contact_number: true,
            expires_at: true,
        },
    });
    return result;
});
const register = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const storedOTP = yield prisma_1.default.oTP.findFirst({
        where: {
            otp: Number(data.otp),
        },
    });
    if (!storedOTP) {
        throw new api_error_1.default(http_status_1.default.FORBIDDEN, "OTP not matched");
    }
    const verifiedOTP = yield (0, otp_sender_1.verifyOTP)(Number(data.otp), storedOTP.otp, Number(storedOTP.expires_at));
    if (verifiedOTP.success === false) {
        throw new api_error_1.default(http_status_1.default.FORBIDDEN, verifiedOTP.message);
    }
    const hashedPassword = yield bcrypt_1.default.hash(data.password, Number(config_1.default.salt_rounds));
    const result = yield prisma_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        if (!storedOTP.name || !storedOTP.email) {
            throw new api_error_1.default(http_status_1.default.FORBIDDEN, "Name and email not found");
        }
        const user = yield tx.user.create({
            data: {
                name: storedOTP.name,
                email: storedOTP.email,
                contact_number: storedOTP.contact_number,
                password: hashedPassword,
            },
            select: Object.assign({}, User_constants_1.userSelectedFields),
        });
        yield tx.oTP.delete({
            where: {
                otp: Number(data.otp),
            },
        });
        return user;
    }));
    return result;
});
const login = (credential) => __awaiter(void 0, void 0, void 0, function* () {
    const { email_or_contact_number, password } = credential;
    const user = yield prisma_1.default.user.findFirst({
        where: {
            OR: [
                {
                    email: email_or_contact_number,
                },
                {
                    contact_number: email_or_contact_number,
                },
            ],
            status: client_1.UserStatus.ACTIVE,
            is_deleted: false,
        },
    });
    if (!user) {
        throw new api_error_1.default(http_status_1.default.NOT_FOUND, "User not found");
    }
    const checkPassword = yield bcrypt_1.default.compare(password, user.password);
    if (!checkPassword) {
        throw new api_error_1.default(http_status_1.default.FORBIDDEN, "Email/Contact number or password is invalid");
    }
    const jwtPayload = {
        id: user.id,
        contact_number: user.contact_number,
        email: user.email,
        role: user.role,
    };
    const accessToken = (0, jwt_helper_1.generateToken)(jwtPayload, config_1.default.jwt_access_secret, config_1.default.jwt_access_expiresin);
    const refreshToken = (0, jwt_helper_1.generateToken)(jwtPayload, config_1.default.jwt_refresh_secret, config_1.default.jwt_refresh_expiresin);
    return {
        id: user.id,
        name: user.name,
        email: user.email,
        contact_number: user.contact_number,
        role: user.role,
        profile_pic: user.profile_pic,
        access_token: accessToken,
        refreshToken,
    };
});
const getAccessToken = (token) => __awaiter(void 0, void 0, void 0, function* () {
    if (!token) {
        throw new api_error_1.default(http_status_1.default.BAD_REQUEST, "Token not found");
    }
    const verifiedUser = (0, jwt_helper_1.verifyToken)(token, config_1.default.jwt_refresh_secret);
    const user = yield prisma_1.default.user.findFirst({
        where: {
            id: verifiedUser.id,
            status: client_1.UserStatus.ACTIVE,
            is_deleted: false,
        },
    });
    if (!user) {
        throw new api_error_1.default(http_status_1.default.NOT_FOUND, "User not found");
    }
    const passwordChangedTime = Math.floor(new Date(user.password_changed_at).getTime() / 1000);
    if (passwordChangedTime > verifiedUser.iat) {
        throw new api_error_1.default(http_status_1.default.UNAUTHORIZED, "You are not authorized");
    }
    const jwtPayload = {
        id: user.id,
        contact_number: user.contact_number,
        email: user.email,
        role: user.role,
    };
    const accessToken = (0, jwt_helper_1.generateToken)(jwtPayload, config_1.default.jwt_access_secret, config_1.default.jwt_access_expiresin);
    return {
        id: user.id,
        name: user.name,
        email: user.email,
        contact_number: user.contact_number,
        role: user.role,
        profile_pic: user.profile_pic,
        access_token: accessToken,
    };
});
const resetPassword = (user, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const userInfo = yield prisma_1.default.user.findUniqueOrThrow({
        where: {
            id: user === null || user === void 0 ? void 0 : user.id,
            status: client_1.UserStatus.ACTIVE,
            is_deleted: false,
        },
    });
    const checkPassword = yield bcrypt_1.default.compare(payload.old_password, userInfo.password);
    if (!checkPassword) {
        throw new api_error_1.default(http_status_1.default.BAD_REQUEST, "Old password is invalid");
    }
    const hashedPassword = yield bcrypt_1.default.hash(payload.new_password, Number(config_1.default.salt_rounds));
    const result = yield prisma_1.default.user.update({
        where: {
            id: userInfo === null || userInfo === void 0 ? void 0 : userInfo.id,
        },
        data: {
            password: hashedPassword,
            password_changed_at: new Date(),
        },
        select: Object.assign({}, User_constants_1.userSelectedFields),
    });
    if (!result) {
        throw new api_error_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, "Failed to update password");
    }
    const jwtPayload = {
        id: result.id,
        contact_number: result.contact_number,
        email: result.email,
        role: result.role,
    };
    const accessToken = (0, jwt_helper_1.generateToken)(jwtPayload, config_1.default.jwt_access_secret, config_1.default.jwt_access_expiresin);
    const refreshToken = (0, jwt_helper_1.generateToken)(jwtPayload, config_1.default.jwt_refresh_secret, config_1.default.jwt_refresh_expiresin);
    return {
        id: result.id,
        name: result.name,
        email: result.email,
        contact_number: result.contact_number,
        role: result.role,
        profile_pic: result.profile_pic,
        access_token: accessToken,
        refreshToken,
    };
});
const forgotPassword = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, new_password, otp } = payload;
    if (new_password && otp) {
        const storedOTP = yield prisma_1.default.oTP.findFirst({
            where: {
                otp: payload.otp,
            },
        });
        if (!storedOTP) {
            throw new api_error_1.default(http_status_1.default.BAD_REQUEST, "Invalid OTP");
        }
        yield (0, otp_sender_1.verifyOTP)(otp, storedOTP.otp, Number(storedOTP.expires_at));
        const hashedPassword = yield bcrypt_1.default.hash(new_password, Number(config_1.default.salt_rounds));
        const result = yield prisma_1.default.user.update({
            where: {
                email: storedOTP.email || "",
            },
            data: {
                password: hashedPassword,
            },
            select: Object.assign({}, User_constants_1.userSelectedFields),
        });
        return {
            success: true,
            message: "Password updated successfully",
            data: {
                id: result.id,
                name,
                email: result.email,
                contact_number: result.contact_number,
                profile_pic: result.profile_pic,
                role: result.role,
            },
        };
    }
    else if (email && !new_password && !otp) {
        const user = yield prisma_1.default.user.findUniqueOrThrow({
            where: {
                email: email,
                status: client_1.UserStatus.ACTIVE,
            },
        });
        const generatedOTP = (0, otp_sender_1.OTPGenerator)();
        const expirationTime = (new Date().getTime() + 2 * 60000).toString();
        const emailBody = `<div style="background-color: #f5f5f5; padding: 40px; border-radius: 10px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); display: flex; justify-content: center; align-items: center;">
    <h1>Your OTP is: </h1>
    <p style="font-size: 24px; font-weight: bold; background-color: #007BFF; color: #fff; padding: 10px 20px; border-radius: 5px;">${generatedOTP}</p>
  </div>`;
        const createOTP = yield prisma_1.default.oTP.create({
            data: {
                email: user.email,
                otp: generatedOTP,
                expires_at: expirationTime,
            },
        });
        if (createOTP) {
            const res = yield (0, email_sender_1.default)(user.email, emailBody);
            if ((res === null || res === void 0 ? void 0 : res.accepted.length) > 0) {
                return {
                    success: true,
                    message: "OTP sent successfully, check your email",
                    data: null,
                };
            }
        }
        else {
            return {
                success: false,
                message: "Failed to send OTP",
                data: null,
            };
        }
    }
});
exports.AuthServices = {
    createOTP,
    register,
    login,
    resetPassword,
    forgotPassword,
    getAccessToken,
};
