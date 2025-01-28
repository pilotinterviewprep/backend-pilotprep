import { TErrorSources, TGenericErrorResponse } from "../interfaces/error";
import { Prisma } from "@prisma/client";
import httpStatus from "http-status";

const prismaClientKnownError = (
  err: Prisma.PrismaClientKnownRequestError
): TGenericErrorResponse => {
  let statusCode = 400;
  let message = "Database error!";
  let errorSources: TErrorSources[] = [];

  if (err.code === "P2002" && err.meta?.target) {
    statusCode = httpStatus.CONFLICT;
    message = "Duplicate value exists.";
    errorSources = (err.meta.target as string[]).map((field: string) => ({
      path: field,
      message: `The ${field} is already exists in the ${err.meta?.modelName}. Please try another ${field} or undo from the trash`,
    }));
    if (errorSources.length)
      message = errorSources.map((item) => item.message).join(" | ");
  } else if (err.code === "P2025") {
    statusCode = httpStatus.NOT_FOUND;
    message = err.message.length < 200 ? err.message : "Data not found";
    errorSources = [
      {
        path: err.meta?.modelName as string,
        message: (err.meta?.cause as string) || err.message,
      },
    ];
  } else if (err.code === "P2003") {
    console.log(err);
  }

  return {
    statusCode,
    message,
    errorSources,
  };
};

export default prismaClientKnownError;
