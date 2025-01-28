import { Request } from "express";
import httpStatus from "http-status";
import catchAsync from "../../shared/catch-async";
import sendResponse from "../../shared/send-response";
import { AuthServices } from "./Auth.services";
import { TAuthUser } from "../../interfaces/common";

const createOTP = catchAsync(async (req, res, next) => {
  const result = await AuthServices.createOTP(req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "OTP sent successfully. Check your email and contact number",
    data: result,
  });
});

const register = catchAsync(async (req, res, next) => {
  const result = await AuthServices.register(req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "User registration is successful",
    data: result,
  });
});

const login = catchAsync(async (req, res, next) => {
  const { refreshToken, ...result } = await AuthServices.login(req.body);
  const maxAge = 60 * 24 * 60 * 60 * 1000;
  res.cookie("refresh_token", refreshToken, { maxAge, httpOnly: true });
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User login is successful",
    data: result,
  });
});

const getAccessToken = catchAsync(async (req, res, next) => {
  const result = await AuthServices.getAccessToken(req.cookies?.refresh_token);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Access token generated successfully",
    data: result,
  });
});

const resetPassword = catchAsync(
  async (req: Request & { user?: TAuthUser }, res, next) => {
    const { refreshToken, ...result } = await AuthServices.resetPassword(
      req?.user,
      req.body
    );
    const maxAge = 60 * 24 * 60 * 60 * 1000;
    res.cookie("refresh_token", refreshToken, { maxAge, httpOnly: true });
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Password reset is successful",
      data: result,
    });
  }
);

const forgotPassword = catchAsync(async (req, res, next) => {
  const result = await AuthServices.forgotPassword(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "New password sent to your email",
    data: result,
  });
});

const socialLogin = catchAsync(async (req, res, next) => {
  const result = await AuthServices.socialLogin(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User login is successful",
    data: result,
  });
});

export const AuthControllers = {
  createOTP,
  register,
  login,
  resetPassword,
  forgotPassword,
  getAccessToken,
  socialLogin,
};
