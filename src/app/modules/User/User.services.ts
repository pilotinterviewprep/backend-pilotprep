import { Prisma, UserRole, UserStatus } from "@prisma/client";
import pagination from "../../utils/pagination";
import {
  userFieldsValidationConfig,
  userSearchableFields,
  userSelectedFields,
} from "./User.constants";
import prisma from "../../shared/prisma";
import { TAuthUser } from "../../interfaces/common";
import { TFile } from "../../interfaces/file";
import ApiError from "../../error/api-error";
import httpStatus from "http-status";
import { TUpdateUserPayload } from "./User.interfaces";
import sharp from "sharp";
import supabase from "../../shared/supabase";
import config from "../../../config";
import searchParamsValidator from "../../utils/search-params-validator";

const getUsers = async (query: Record<string, any>) => {
  const { searchTerm, page, limit, sortBy, sortOrder, ...remainingQuery } =
    query;

  if (sortBy)
    searchParamsValidator(userFieldsValidationConfig, "sort_by", sortBy);
  if (sortOrder)
    searchParamsValidator(userFieldsValidationConfig, "sort_order", sortOrder);

  const { pageNumber, limitNumber, skip, sortWith, sortSequence } = pagination({
    page,
    limit,
    sortBy,
    sortOrder,
  });

  const andConditions: Prisma.UserWhereInput[] = [{ is_deleted: false }];

  if (searchTerm) {
    andConditions.push({
      OR: userSearchableFields.map((field) => {
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
      searchParamsValidator(userFieldsValidationConfig, key, value);
      andConditions.push({
        [key]: value === "true" ? true : value === "false" ? false : value,
      });
    }
  }

  const whereConditions = {
    AND: andConditions,
  };

  const [result, total] = await Promise.all([
    prisma.user.findMany({
      where: whereConditions,
      skip: skip,
      take: limitNumber,
      orderBy: {
        [sortWith]: sortSequence,
      },
      select: {
        ...userSelectedFields,
      },
    }),
    prisma.user.count({ where: whereConditions }),
  ]);

  return {
    meta: {
      page: pageNumber,
      limit: limitNumber,
      total,
    },
    data: result,
  };
};

const getUser = async (id: string) => {
  const result = await prisma.user.findUniqueOrThrow({
    where: {
      id,
      status: UserStatus.ACTIVE,
      is_deleted: false,
    },
    select: {
      ...userSelectedFields,
    },
  });
  return result;
};

const getMe = async (user: TAuthUser | undefined) => {
  const result = await prisma.user.findUniqueOrThrow({
    where: {
      id: user?.id,
    },
    select: {
      ...userSelectedFields,
    },
  });
  return result;
};

const updateProfile = async (
  user: TAuthUser,
  payload: Record<string, any>,
  file: TFile | undefined
) => {
  let profilePic;

  if (file) {
    const metadata = await sharp(file.buffer).metadata();
    const fileName = `${Date.now()}_${file.originalname}`;
    const { data } = await supabase.storage
      .from(config.user_bucket)
      .upload(fileName, file.buffer, {
        contentType: file.mimetype,
      });

    if (!data?.id) {
      throw new ApiError(
        httpStatus.INTERNAL_SERVER_ERROR,
        "Failed to upload profile picture"
      );
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
      bucket_name: config.user_bucket,
    };

    profilePic = await prisma.image.create({
      data: image,
    });

    const userInfo = await prisma.user.findUniqueOrThrow({
      where: {
        id: user?.id,
      },
    });

    if (userInfo.profile_pic) {
      const profilePic = await prisma.image.findFirst({
        where: {
          path: userInfo.profile_pic,
        },
      });
      if (profilePic) {
        await supabase.storage
          .from(config.user_bucket)
          .remove([profilePic.path]);
        await prisma.image.delete({
          where: {
            id: profilePic.id,
          },
        });
      }
    }
  }

  if (profilePic?.path) {
    payload.profile_pic = profilePic.path;
  }

  const result = prisma.user.update({
    where: {
      id: user?.id,
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
};

const updateUser = async (
  user: TAuthUser | undefined,
  id: string,
  payload: TUpdateUserPayload
) => {
  await authorizeUserUpdate(user as TAuthUser, id);

  const [result] = await prisma.$transaction([
    prisma.user.update({
      where: {
        id,
        is_deleted: false,
      },
      data: payload,
      select: {
        ...userSelectedFields,
      },
    }),
  ]);

  if (!result) throw new ApiError(httpStatus.NOT_FOUND, "User not found");

  return result;
};

// Helper function to handle authorization checks
const authorizeUserUpdate = async (user: TAuthUser, id: string) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: { id },
    select: { role: true },
  });

  if (userData.role === UserRole.SUPER_ADMIN && user.role === UserRole.ADMIN) {
    throw new ApiError(
      httpStatus.UNAUTHORIZED,
      "Admins cannot modify Super Admin"
    );
  }
};

export const UserServices = {
  getUsers,
  getUser,
  getMe,
  updateProfile,
  updateUser,
};
