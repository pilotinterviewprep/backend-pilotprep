import { ZodError } from "zod";
import { TErrorSources, TGenericErrorResponse } from "../interfaces/error";

const zodError = (err: ZodError): TGenericErrorResponse => {
  const errorSources: TErrorSources[] = err.issues.map((issue) => ({
    path: issue.path[issue.path.length - 1],
    message: issue.message,
  }));
  let message = "Validation error!";
  const statusCode = 400;

  if (errorSources?.length) {
    message = errorSources.map((item) => item.message).join(" | ");
  }

  return {
    statusCode,
    message,
    errorSources,
  };
};

export default zodError;
