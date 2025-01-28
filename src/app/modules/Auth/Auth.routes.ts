import { UserRole } from "@prisma/client";
import { Router } from "express";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validate-request";
import { AuthControllers } from "./Auth.controllers";
import { AuthValidations } from "./Auth.validations";

const router = Router();

router.post(
  "/send-otp",
  validateRequest(AuthValidations.createOTPValidationSchema),
  AuthControllers.createOTP
);

router.post(
  "/register",
  validateRequest(AuthValidations.registerValidationSchema),
  AuthControllers.register
);

router.post(
  "/login",
  validateRequest(AuthValidations.loginValidationSchema),
  AuthControllers.login
);

router.post("/access-token", AuthControllers.getAccessToken);

router.post(
  "/reset-password",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.RETAILER, UserRole.USER),
  validateRequest(AuthValidations.resetPasswordValidationSchema),
  AuthControllers.resetPassword
);

router.post(
  "/forgot-password",
  validateRequest(AuthValidations.forgotPasswordValidationSchema),
  AuthControllers.forgotPassword
);

router.post(
  "/social-login",
  validateRequest(AuthValidations.socialLoginValidationSchema),
  AuthControllers.socialLogin
);

export const AuthRoutes = router;
