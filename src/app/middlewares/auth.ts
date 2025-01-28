import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { JwtPayload } from "jsonwebtoken";
import config from "../../config";
import ApiError from "../error/api-error";
import { verifyToken } from "../utils/jwt-helper";
import prisma from "../shared/prisma";
import { TAuthUser } from "../interfaces/common";

const auth = (...roles: string[]) => {
  return async (
    req: Request & { user?: JwtPayload },
    res: Response,
    next: NextFunction
  ) => {
    try {
      const token = req.headers.authorization;
      if (!token) {
        throw new ApiError(httpStatus.UNAUTHORIZED, "You are not authorized");
      }

      const verifiedUser = verifyToken(
        token,
        config.jwt_access_secret
      ) as TAuthUser;

      const user = await prisma.user.findUniqueOrThrow({
        where: {
          id: verifiedUser?.id,
          is_deleted: false,
          status: "ACTIVE",
        },
      });

      const passwordChangedTime = Math.floor(
        new Date(user?.password_changed_at).getTime() / 1000
      );

      if (passwordChangedTime > verifiedUser.iat) {
        throw new ApiError(
          httpStatus.UNAUTHORIZED,
          "Password changed recently"
        );
      }

      if (roles?.length && !roles.includes(verifiedUser?.role)) {
        throw new ApiError(httpStatus.UNAUTHORIZED, "You are not authorized");
      }

      req.user = verifiedUser;

      next();
    } catch (error: any) {
      next(error);
    }
  };
};

export default auth;
