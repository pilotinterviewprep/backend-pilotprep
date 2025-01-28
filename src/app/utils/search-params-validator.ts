import httpStatus from "http-status";
import ApiError from "../error/api-error";

const searchParamsValidator = (
  fieldsValidationConfig: Record<string, any>,
  key: string,
  value: any
) => {
  const allowedValues = fieldsValidationConfig[key];
  if (allowedValues && !allowedValues.includes(value))
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `Invalid value for ${key}. Valid values are ${allowedValues
        .map((i: string) => `'${i}'`)
        .join(", ")}`
    );
};

export default searchParamsValidator;
