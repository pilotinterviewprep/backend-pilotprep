import { Prisma } from "@prisma/client";
import { TErrorSources, TGenericErrorResponse } from "../interfaces/error";

const prismaValidationError = (
  error: Prisma.PrismaClientValidationError
): TGenericErrorResponse => {
  const statusCode = 400;
  const message = "Database validation error!";

  const errorSources: TErrorSources[] = [
    {
      path: "Database",
      message: "Perhaps you are missing some required fields",
    },
  ];

  return {
    statusCode,
    message,
    errorSources,
  };
};

export default prismaValidationError;
