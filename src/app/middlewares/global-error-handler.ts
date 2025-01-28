import { ErrorRequestHandler } from "express";
import httpStatus from "http-status";
import { ZodError } from "zod";
import config from "../../config";
import handleZodError from "../error/zod-error";
import { TErrorSources } from "../interfaces/error";
import { Prisma } from "@prisma/client";
import handlePrismaClientKnownError from "../error/prisma-client-known-error";
import handlePrismaValidationError from "../error/prisma-validation-error";

const globalErrorHandler: ErrorRequestHandler = (error, req, res, next) => {
  let statusCode = error.statusCode || httpStatus.INTERNAL_SERVER_ERROR;
  let message = error.message || "Something went wrong!";
  let errorSources: TErrorSources[] = [
    {
      path: "",
      message: error.message || "",
    },
  ];

  if (error instanceof ZodError) {
    const simplifiedError = handleZodError(error);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorSources = simplifiedError.errorSources;
  } else if (error instanceof Prisma.PrismaClientValidationError) {
    const simplifiedError = handlePrismaValidationError(error);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorSources = simplifiedError.errorSources;
  } else if (error instanceof Prisma.PrismaClientKnownRequestError) {
    const simplifiedError = handlePrismaClientKnownError(error);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorSources = simplifiedError.errorSources;
  } else if (error.message === "jwt expired") {
    statusCode = httpStatus.UNAUTHORIZED;
    message = "Token has been expired";
  }
  res.status(statusCode).json({
    success: false,
    message: message,
    errorSources,
    stack: config.node_env === "development" ? error.stack : null,
  });
};

export default globalErrorHandler;
