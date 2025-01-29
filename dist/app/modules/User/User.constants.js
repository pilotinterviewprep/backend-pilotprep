"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userFieldsValidationConfig = exports.userStatus = exports.userRole = exports.userSelectedFields = exports.userSortableFields = exports.userSearchableFields = exports.userFilterableFields = void 0;
const client_1 = require("@prisma/client");
const common_1 = require("../../constants/common");
exports.userFilterableFields = [
    "searchTerm",
    "limit",
    "page",
    "sortBy",
    "sortOrder",
    "role",
    "status",
];
exports.userSearchableFields = ["name", "email"];
exports.userSortableFields = [
    "id",
    "first_name",
    "last_name",
    "email",
    "created_at",
    "updated_at",
    "role",
    "status",
];
exports.userSelectedFields = {
    id: true,
    first_name: true,
    last_name: true,
    country: true,
    email: true,
    role: true,
    status: true,
    profile_pic: true,
    created_at: true,
    updated_at: true,
};
exports.userRole = [
    client_1.UserRole.SUPER_ADMIN,
    client_1.UserRole.ADMIN,
    client_1.UserRole.RETAILER,
    client_1.UserRole.USER,
];
exports.userStatus = [
    client_1.UserStatus.ACTIVE,
    client_1.UserStatus.BLOCKED,
    client_1.UserStatus.INACTIVE,
];
exports.userFieldsValidationConfig = {
    sort_by: exports.userSortableFields,
    sort_order: common_1.sortOrderType,
    role: Object.values(client_1.UserRole),
    status: Object.values(client_1.UserStatus),
};
