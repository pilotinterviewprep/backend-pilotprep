import { UserRole, UserStatus } from "@prisma/client";

export type TUpdateUserPayload = {
  role?: UserRole;
  status?: UserStatus;
  is_deleted?: boolean;
};
