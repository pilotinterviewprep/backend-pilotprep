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
exports.seedSuperAdmin = void 0;
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const config_1 = __importDefault(require("../../config"));
const prisma_1 = __importDefault(require("../shared/prisma"));
const superAdmin = {
    first_name: config_1.default.super_admin_name,
    email: config_1.default.super_admin_email,
    username: config_1.default.super_admin_name.toLowerCase(),
    role: client_1.UserRole.SUPER_ADMIN,
};
const seedSuperAdmin = () => __awaiter(void 0, void 0, void 0, function* () {
    const isExistSuperAdmin = yield prisma_1.default.user.findFirst({
        where: {
            role: client_1.UserRole.SUPER_ADMIN,
        },
    });
    const hashedPassword = yield bcrypt_1.default.hash(config_1.default.super_admin_password, Number(config_1.default.salt_rounds));
    if (!(isExistSuperAdmin === null || isExistSuperAdmin === void 0 ? void 0 : isExistSuperAdmin.id)) {
        yield prisma_1.default.user.create({
            data: Object.assign(Object.assign({}, superAdmin), { password: hashedPassword }),
        });
    }
});
exports.seedSuperAdmin = seedSuperAdmin;
