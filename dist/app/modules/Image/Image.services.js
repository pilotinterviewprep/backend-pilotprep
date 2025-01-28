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
exports.ImageServices = void 0;
const http_status_1 = __importDefault(require("http-status"));
const api_error_1 = __importDefault(require("../../error/api-error"));
const prisma_1 = __importDefault(require("../../shared/prisma"));
const pagination_1 = __importDefault(require("../../utils/pagination"));
const Image_constant_1 = require("./Image.constant");
const search_params_validator_1 = __importDefault(require("../../utils/search-params-validator"));
const supabase_1 = __importDefault(require("../../shared/supabase"));
const sharp_1 = __importDefault(require("sharp"));
const config_1 = __importDefault(require("../../../config"));
const checker_1 = require("../../utils/checker");
const uploadImages = (req) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const files = req.files;
    const user = req.user;
    if (!((_a = files === null || files === void 0 ? void 0 : files.images) === null || _a === void 0 ? void 0 : _a.length)) {
        throw new api_error_1.default(http_status_1.default.BAD_REQUEST, "No images found");
    }
    const images = [];
    if (files === null || files === void 0 ? void 0 : files.images) {
        for (let i = 0; i < files.images.length; i++) {
            const file = files.images[i];
            if (!Image_constant_1.allowedImageType.includes(file.mimetype)) {
                continue;
            }
            const metadata = yield (0, sharp_1.default)(file.buffer).metadata();
            const { data } = yield supabase_1.default.storage
                .from(config_1.default.general_bucket)
                .upload(file.originalname, file.buffer, {
                contentType: file.mimetype,
            });
            if (data === null || data === void 0 ? void 0 : data.id) {
                images.push({
                    user_id: user === null || user === void 0 ? void 0 : user.id,
                    name: file.originalname,
                    alt_text: file.originalname.replace(/\.[^/.]+$/, ""),
                    type: file.mimetype,
                    size: file.size,
                    width: metadata.width || 0,
                    height: metadata.height || 0,
                    path: data.path,
                    bucket_id: data.id,
                    bucket_name: config_1.default.general_bucket,
                });
            }
        }
    }
    const result = yield prisma_1.default.image.createMany({
        data: images,
        skipDuplicates: true,
    });
    return {
        uploaded_count: result.count,
        message: `${result.count} image has been uploaded`,
    };
});
const getImages = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const { searchTerm, page, limit, sortBy, sortOrder, fromDate, toDate, type } = query;
    if (sortBy)
        (0, search_params_validator_1.default)(Image_constant_1.imageFieldsValidationConfig, "sort_by", sortBy);
    if (sortOrder)
        (0, search_params_validator_1.default)(Image_constant_1.imageFieldsValidationConfig, "sort_order", sortOrder);
    const { pageNumber, limitNumber, skip, sortWith, sortSequence } = (0, pagination_1.default)({
        page,
        limit,
        sortBy,
        sortOrder,
    });
    const andConditions = [
        { bucket_name: config_1.default.general_bucket },
    ];
    if (searchTerm) {
        andConditions.push({
            OR: Image_constant_1.imageSearchableFields.map((field) => {
                return {
                    [field]: {
                        contains: searchTerm,
                        mode: "insensitive",
                    },
                };
            }),
        });
    }
    if (type) {
        const types = (0, Image_constant_1.prepareTypes)(type);
        andConditions.push({
            type: {
                in: types,
            },
        });
    }
    if (fromDate) {
        const date = (0, checker_1.validDateChecker)(fromDate, "fromDate");
        andConditions.push({
            created_at: {
                gte: date,
            },
        });
    }
    if (toDate) {
        const date = (0, checker_1.validDateChecker)(toDate, "toDate");
        andConditions.push({
            created_at: {
                lte: date,
            },
        });
    }
    const whereConditions = {
        AND: andConditions,
    };
    const [result, total] = yield Promise.all([
        prisma_1.default.image.findMany({
            where: whereConditions,
            skip: skip,
            take: limitNumber,
            orderBy: {
                [sortWith]: sortSequence,
            },
            include: {
                uploaded_by: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        }),
        prisma_1.default.image.count({ where: whereConditions }),
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
const getImage = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.image.findUniqueOrThrow({
        where: {
            id,
        },
        include: {
            uploaded_by: {
                select: {
                    id: true,
                    name: true,
                },
            },
        },
    });
    return result;
});
const updateImage = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.image.update({
        where: {
            id: id,
        },
        data: payload,
    });
    return result;
});
const deleteImages = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { images_path } = payload;
    const { data, error } = yield supabase_1.default.storage
        .from(config_1.default.general_bucket)
        .remove(images_path);
    if ((error === null || error === void 0 ? void 0 : error.status) === 400 || (data === null || data === void 0 ? void 0 : data.length) === 0)
        throw new api_error_1.default(http_status_1.default.BAD_REQUEST, "No valid image path found to delete");
    const deletedImagesBucketId = data === null || data === void 0 ? void 0 : data.map((image) => image.id);
    const result = yield prisma_1.default.image.deleteMany({
        where: {
            bucket_id: {
                in: deletedImagesBucketId,
            },
        },
    });
    return {
        deleted_count: result.count,
        message: `${result.count} image has been deleted`,
    };
});
exports.ImageServices = {
    uploadImages,
    getImages,
    getImage,
    updateImage,
    deleteImages,
};
