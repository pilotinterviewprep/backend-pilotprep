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
exports.UserServices = void 0;
const client_1 = require("@prisma/client");
const pagination_1 = __importDefault(require("../../utils/pagination"));
const User_constants_1 = require("./User.constants");
const prisma_1 = __importDefault(require("../../shared/prisma"));
const api_error_1 = __importDefault(require("../../error/api-error"));
const http_status_1 = __importDefault(require("http-status"));
const sharp_1 = __importDefault(require("sharp"));
const supabase_1 = __importDefault(require("../../shared/supabase"));
const config_1 = __importDefault(require("../../../config"));
const search_params_validator_1 = __importDefault(require("../../utils/search-params-validator"));
const getUsers = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const { searchTerm, page, limit, sortBy, sortOrder } = query, remainingQuery = __rest(query, ["searchTerm", "page", "limit", "sortBy", "sortOrder"]);
    if (sortBy)
        (0, search_params_validator_1.default)(User_constants_1.userFieldsValidationConfig, "sort_by", sortBy);
    if (sortOrder)
        (0, search_params_validator_1.default)(User_constants_1.userFieldsValidationConfig, "sort_order", sortOrder);
    const { pageNumber, limitNumber, skip, sortWith, sortSequence } = (0, pagination_1.default)({
        page,
        limit,
        sortBy,
        sortOrder,
    });
    const andConditions = [{ is_deleted: false }];
    if (searchTerm) {
        andConditions.push({
            OR: User_constants_1.userSearchableFields.map((field) => {
                return {
                    [field]: {
                        contains: searchTerm,
                        mode: "insensitive",
                    },
                };
            }),
        });
    }
    if (Object.keys(remainingQuery).length) {
        for (const [key, value] of Object.entries(remainingQuery)) {
            (0, search_params_validator_1.default)(User_constants_1.userFieldsValidationConfig, key, value);
            andConditions.push({
                [key]: value === "true" ? true : value === "false" ? false : value,
            });
        }
    }
    const whereConditions = {
        AND: andConditions,
    };
    const [result, total] = yield Promise.all([
        prisma_1.default.user.findMany({
            where: whereConditions,
            skip: skip,
            take: limitNumber,
            orderBy: {
                [sortWith]: sortSequence,
            },
            select: Object.assign({}, User_constants_1.userSelectedFields),
        }),
        prisma_1.default.user.count({ where: whereConditions }),
    ]);
    return {
        meta: {
            page: pageNumber,
            limit: limitNumber,
            total,
        },
        data: result,
    };
});
const getUser = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.user.findUniqueOrThrow({
        where: {
            id,
            status: client_1.UserStatus.ACTIVE,
            is_deleted: false,
        },
        select: Object.assign({}, User_constants_1.userSelectedFields),
    });
    return result;
});
const getMe = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.user.findUniqueOrThrow({
        where: {
            id: user === null || user === void 0 ? void 0 : user.id,
        },
        select: Object.assign({}, User_constants_1.userSelectedFields),
    });
    return result;
});
const updateProfile = (user, payload, file) => __awaiter(void 0, void 0, void 0, function* () {
    let profilePic;
    if (file) {
        const metadata = yield (0, sharp_1.default)(file.buffer).metadata();
        const fileName = `${Date.now()}_${file.originalname}`;
        const { data } = yield supabase_1.default.storage
            .from(config_1.default.user_bucket)
            .upload(fileName, file.buffer, {
            contentType: file.mimetype,
        });
        if (!(data === null || data === void 0 ? void 0 : data.id)) {
            throw new api_error_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, "Failed to upload profile picture");
        }
        const image = {
            user_id: user.id,
            name: file.originalname,
            alt_text: file.originalname,
            type: file.mimetype,
            size: file.size,
            width: metadata.width || 0,
            height: metadata.height || 0,
            path: data.path,
            bucket_id: data.id,
            bucket_name: config_1.default.user_bucket,
        };
        profilePic = yield prisma_1.default.image.create({
            data: image,
        });
        const userInfo = yield prisma_1.default.user.findUniqueOrThrow({
            where: {
                id: user === null || user === void 0 ? void 0 : user.id,
            },
        });
        if (userInfo.profile_pic) {
            const profilePic = yield prisma_1.default.image.findFirst({
                where: {
                    path: userInfo.profile_pic,
                },
            });
            if (profilePic) {
                yield supabase_1.default.storage
                    .from(config_1.default.user_bucket)
                    .remove([profilePic.path]);
                yield prisma_1.default.image.delete({
                    where: {
                        id: profilePic.id,
                    },
                });
            }
        }
    }
    if (profilePic === null || profilePic === void 0 ? void 0 : profilePic.path) {
        payload.profile_pic = profilePic.path;
    }
    const result = prisma_1.default.user.update({
        where: {
            id: user === null || user === void 0 ? void 0 : user.id,
        },
        data: payload,
        select: {
            id: true,
            first_name: true,
            email: true,
            role: true,
            profile_pic: true,
        },
    });
    return result;
});
const updateUser = (user, id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    yield authorizeUserUpdate(user, id);
    const [result] = yield prisma_1.default.$transaction([
        prisma_1.default.user.update({
            where: {
                id,
                is_deleted: false,
            },
            data: payload,
            select: Object.assign({}, User_constants_1.userSelectedFields),
        }),
    ]);
    if (!result)
        throw new api_error_1.default(http_status_1.default.NOT_FOUND, "User not found");
    return result;
});
// Helper function to handle authorization checks
const authorizeUserUpdate = (user, id) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = yield prisma_1.default.user.findUniqueOrThrow({
        where: { id },
        select: { role: true },
    });
    if (userData.role === client_1.UserRole.SUPER_ADMIN && user.role === client_1.UserRole.ADMIN) {
        throw new api_error_1.default(http_status_1.default.UNAUTHORIZED, "Admins cannot modify Super Admin");
    }
});
exports.UserServices = {
    getUsers,
    getUser,
    getMe,
    updateProfile,
    updateUser,
};
