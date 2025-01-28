import { UserRole, UserStatus } from "@prisma/client";
import { sortOrderType } from "../../constants/common";

export const userFilterableFields = [
  "searchTerm",
  "limit",
  "page",
  "sortBy",
  "sortOrder",
  "role",
  "status",
];

export const userSearchableFields = ["name", "email", "contact_number"];

export const userSortableFields = [
  "id",
  "name",
  "email",
  "contact_number",
  "created_at",
  "updated_at",
  "role",
  "status",
];

export const userSelectedFields = {
  id: true,
  name: true,
  email: true,
  contact_number: true,
  role: true,
  status: true,
  profile_pic: true,
  created_at: true,
  updated_at: true,
};

export const userRole = [
  UserRole.SUPER_ADMIN,
  UserRole.ADMIN,
  UserRole.RETAILER,
  UserRole.USER,
];

export const userStatus = [
  UserStatus.ACTIVE,
  UserStatus.BLOCKED,
  UserStatus.INACTIVE,
];

export const userFieldsValidationConfig = {
  sort_by: userSortableFields,
  sort_order: sortOrderType,
  role: Object.values(UserRole),
  status: Object.values(UserStatus),
};
