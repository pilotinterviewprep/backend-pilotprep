import httpStatus from "http-status";
import ApiError from "../../error/api-error";
import { TFiles } from "../../interfaces/file";
import { Prisma } from "@prisma/client";
import prisma from "../../shared/prisma";
import { Request } from "express";
import { TDeleteImagePayload, TUpdateImagePayload } from "./Image.interfaces";
import pagination from "../../utils/pagination";
import {
  allowedImageType,
  imageFieldsValidationConfig,
  imageSearchableFields,
  prepareTypes,
} from "./Image.constant";
import validateQueryFields from "../../utils/search-params-validator";
import supabase from "../../shared/supabase";
import sharp from "sharp";
import { TAuthUser } from "../../interfaces/common";
import config from "../../../config";
import { validDateChecker } from "../../utils/checker";

const uploadImages = async (req: Request & { user?: TAuthUser }) => {
  const files = req.files as TFiles;
  const user = req.user;

  if (!files?.images?.length) {
    throw new ApiError(httpStatus.BAD_REQUEST, "No images found");
  }

  const images: Prisma.ImageCreateManyInput[] = [];

  if (files?.images) {
    for (let i = 0; i < files.images.length; i++) {
      const file = files.images[i];
      if (!allowedImageType.includes(file.mimetype)) {
        continue;
      }
      const metadata = await sharp(file.buffer).metadata();
      const { data } = await supabase.storage
        .from(config.general_bucket)
        .upload(file.originalname, file.buffer, {
          contentType: file.mimetype,
        });

      if (data?.id) {
        images.push({
          user_id: user?.id,
          name: file.originalname,
          alt_text: file.originalname.replace(/\.[^/.]+$/, ""),
          type: file.mimetype,
          size: file.size,
          width: metadata.width || 0,
          height: metadata.height || 0,
          path: data.path,
          bucket_id: data.id,
          bucket_name: config.general_bucket,
        });
      }
    }
  }

  const result = await prisma.image.createMany({
    data: images,
    skipDuplicates: true,
  });

  return {
    uploaded_count: result.count,
    message: `${result.count} image has been uploaded`,
  };
};

const getImages = async (query: Record<string, any>) => {
  const { searchTerm, page, limit, sortBy, sortOrder, fromDate, toDate, type } =
    query;

  if (sortBy)
    validateQueryFields(imageFieldsValidationConfig, "sort_by", sortBy);
  if (sortOrder)
    validateQueryFields(imageFieldsValidationConfig, "sort_order", sortOrder);

  const { pageNumber, limitNumber, skip, sortWith, sortSequence } = pagination({
    page,
    limit,
    sortBy,
    sortOrder,
  });

  const andConditions: Prisma.ImageWhereInput[] = [
    { bucket_name: config.general_bucket },
  ];

  if (searchTerm) {
    andConditions.push({
      OR: imageSearchableFields.map((field) => {
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
    const types = prepareTypes(type);
    andConditions.push({
      type: {
        in: types,
      },
    });
  }

  if (fromDate) {
    const date = validDateChecker(fromDate, "fromDate");
    andConditions.push({
      created_at: {
        gte: date,
      },
    });
  }

  if (toDate) {
    const date = validDateChecker(toDate, "toDate");
    andConditions.push({
      created_at: {
        lte: date,
      },
    });
  }

  const whereConditions = {
    AND: andConditions,
  };

  const [result, total] = await Promise.all([
    prisma.image.findMany({
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
            first_name: true,
          },
        },
      },
    }),
    prisma.image.count({ where: whereConditions }),
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

const getImage = async (id: string) => {
  const result = await prisma.image.findUniqueOrThrow({
    where: {
      id,
    },
    include: {
      uploaded_by: {
        select: {
          id: true,
          first_name: true,
        },
      },
    },
  });

  return result;
};

const updateImage = async (id: string, payload: TUpdateImagePayload) => {
  const result = await prisma.image.update({
    where: {
      id: id,
    },
    data: payload,
  });
  return result;
};

const deleteImages = async (payload: TDeleteImagePayload) => {
  const { images_path } = payload;
  const { data, error } = await supabase.storage
    .from(config.general_bucket)
    .remove(images_path);

  if ((error as any)?.status === 400 || data?.length === 0)
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "No valid image path found to delete"
    );

  const deletedImagesBucketId = data?.map((image) => image.id);

  const result = await prisma.image.deleteMany({
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
};

export const ImageServices = {
  uploadImages,
  getImages,
  getImage,
  updateImage,
  deleteImages,
};
