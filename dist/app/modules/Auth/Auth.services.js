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
exports.AuthServices = void 0;
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const http_status_1 = __importDefault(require("http-status"));
const config_1 = __importDefault(require("../../../config"));
const api_error_1 = __importDefault(require("../../error/api-error"));
const prisma_1 = __importDefault(require("../../shared/prisma"));
const email_sender_1 = __importDefault(require("../../utils/email-sender"));
const jwt_helper_1 = require("../../utils/jwt-helper");
const otp_sender_1 = require("../../utils/otp-sender");
const User_constants_1 = require("../User/User.constants");
const createOTP = (data) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const generatedOTP = (0, otp_sender_1.OTPGenerator)();
    const expirationTime = (new Date().getTime() + 2 * 60000).toString();
    const emailBody = `<div style="background-color: #F5F5F5; padding: 40px; text-align: center">
            <h4 style="font-size: 16px; font-weight: bold; color: #3352ff">Your OTP is <span>${generatedOTP}</span></h4>
        </div>`;
    let emailResponse;
    if (data.email) {
        emailResponse = yield (0, email_sender_1.default)(data.email, emailBody);
    }
    if (((_a = emailResponse === null || emailResponse === void 0 ? void 0 : emailResponse.accepted) === null || _a === void 0 ? void 0 : _a.length) === 0)
        throw new api_error_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, "Failed to send OTP");
    const result = yield prisma_1.default.oTP.create({
        data: {
            first_name: data.first_name,
            username: data.username,
            email: data.email || null,
            otp: generatedOTP,
            expires_at: expirationTime,
        },
        select: {
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
    console.log(storedOTP, "storedOTP......");
    if (!storedOTP) {
        throw new api_error_1.default(http_status_1.default.FORBIDDEN, "OTP not matched");
    }
    const verifiedOTP = yield (0, otp_sender_1.verifyOTP)(Number(data.otp), storedOTP.otp, Number(storedOTP.expires_at));
    if (verifiedOTP.success === false) {
        throw new api_error_1.default(http_status_1.default.FORBIDDEN, verifiedOTP.message);
    }
    console.log(verifiedOTP, "verifiedOTP");
    const hashedPassword = yield bcrypt_1.default.hash(data.password, Number(config_1.default.salt_rounds));
    console.log(hashedPassword, "hashedPassword");
    const result = yield prisma_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        if (!storedOTP.first_name || !storedOTP.email) {
            throw new api_error_1.default(http_status_1.default.FORBIDDEN, "Name and email not found");
        }
        const user = yield tx.user.create({
            data: {
                first_name: storedOTP.first_name,
                last_name: storedOTP.last_name,
                username: storedOTP.username,
                country: storedOTP.country,
                email: storedOTP.email,
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
    console.log(result, "result");
    return result;
});
const login = (credential) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = credential;
    const user = yield prisma_1.default.user.findFirst({
        where: {
            OR: [
                {
                    email: email,
                },
            ],
            status: client_1.UserStatus.ACTIVE,
            is_deleted: false,
        },
    });
    if (!user) {
        throw new api_error_1.default(http_status_1.default.NOT_FOUND, "User not found");
    }
    if (user.provider !== client_1.Provider.MANUAL) {
        throw new api_error_1.default(http_status_1.default.FORBIDDEN, "User exist, please try with correct method");
    }
    if (!user.password) {
        throw new api_error_1.default(http_status_1.default.FORBIDDEN, "Email/Contact number or password is invalid");
    }
    const checkPassword = yield bcrypt_1.default.compare(password, user.password);
    if (!checkPassword) {
        throw new api_error_1.default(http_status_1.default.FORBIDDEN, "Email/Contact number or password is invalid");
    }
    const { accessToken, refreshToken } = prepareToken(user);
    return {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        username: user.username,
        country: user.country,
        email: user.email,
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
        email: user.email,
        role: user.role,
    };
    const accessToken = (0, jwt_helper_1.generateToken)(jwtPayload, config_1.default.jwt_access_secret, config_1.default.jwt_access_expiresin);
    return {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        username: user.username,
        country: user.country,
        email: user.email,
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
    if (!userInfo.password) {
        throw new api_error_1.default(http_status_1.default.BAD_REQUEST, "Password not found");
    }
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
        email: result.email,
        role: result.role,
    };
    const accessToken = (0, jwt_helper_1.generateToken)(jwtPayload, config_1.default.jwt_access_secret, config_1.default.jwt_access_expiresin);
    const refreshToken = (0, jwt_helper_1.generateToken)(jwtPayload, config_1.default.jwt_refresh_secret, config_1.default.jwt_refresh_expiresin);
    return {
        id: result.id,
        name: result.first_name + " " + result.last_name,
        email: result.email,
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
                first_name: user.first_name,
                username: user.username,
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
const socialLogin = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isExist = yield prisma_1.default.user.findUnique({
        where: {
            email: payload.email,
        },
    });
    if (isExist) {
        if (isExist.provider === client_1.Provider.MANUAL ||
            isExist.provider !== payload.provider) {
            throw new api_error_1.default(http_status_1.default.FORBIDDEN, "User already exist, please try to correct method");
        }
        const { accessToken, refreshToken } = prepareToken(isExist);
        return {
            id: isExist.id,
            first_name: isExist.first_name,
            email: isExist.email,
            role: isExist.role,
            profile_pic: isExist.profile_pic,
            access_token: accessToken,
            refreshToken,
        };
    }
    else {
        const newUser = yield prisma_1.default.user.create({
            data: {
                first_name: payload.first_name,
                email: payload.email,
                username: payload.username,
                profile_pic: payload.profile_pic || null,
                provider: payload.provider,
            },
        });
        const { accessToken, refreshToken } = prepareToken(newUser);
        return {
            id: newUser.id,
            first_name: newUser.first_name,
            email: newUser.email,
            role: newUser.role,
            profile_pic: newUser.profile_pic,
            access_token: accessToken,
            refreshToken,
        };
    }
});
const prepareToken = (user) => {
    const jwtPayload = {
        id: user.id,
        email: user.email,
        role: user.role,
    };
    const accessToken = (0, jwt_helper_1.generateToken)(jwtPayload, config_1.default.jwt_access_secret, config_1.default.jwt_access_expiresin);
    const refreshToken = (0, jwt_helper_1.generateToken)(jwtPayload, config_1.default.jwt_refresh_secret, config_1.default.jwt_refresh_expiresin);
    return {
        accessToken,
        refreshToken,
    };
};
exports.AuthServices = {
    createOTP,
    register,
    login,
    resetPassword,
    forgotPassword,
    getAccessToken,
    socialLogin,
};
