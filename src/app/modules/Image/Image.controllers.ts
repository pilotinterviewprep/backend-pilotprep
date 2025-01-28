import httpStatus from "http-status";
import catchAsync from "../../shared/catch-async";
import sendResponse from "../../shared/send-response";
import { ImageServices } from "./Image.services";

const uploadImages = catchAsync(async (req, res, next) => {
  const result = await ImageServices.uploadImages(req);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Successfully uploaded the images",
    data: result,
  });
});

const getImages = catchAsync(async (req, res, next) => {
  const result = await ImageServices.getImages(req.query);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Successfully retrieved the images",
    meta: result.meta,
    data: result.data,
  });
});

const getImage = catchAsync(async (req, res, next) => {
  const result = await ImageServices.getImage(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Successfully retrieved the image",
    data: result,
  });
});

const updateImage = catchAsync(async (req, res, next) => {
  const result = await ImageServices.updateImage(req.params.id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Successfully updated the image name",
    data: result,
  });
});

const deleteImages = catchAsync(async (req, res, next) => {
  const result = await ImageServices.deleteImages(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Successfully deleted the images",
    data: result,
  });
});

export const ImageControllers = {
  uploadImages,
  getImages,
  getImage,
  updateImage,
  deleteImages,
};
