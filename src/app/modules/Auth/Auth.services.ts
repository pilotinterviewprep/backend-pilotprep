import { UserStatus } from "@prisma/client";
import bcrypt from "bcrypt";
import httpStatus from "http-status";
import config from "../../../config";
import ApiError from "../../error/api-error";
import prisma from "../../shared/prisma";
import { generateToken, verifyToken } from "../../utils/jwt-helper";
import {
  IChangePasswordPayload,
  IOTPCreatePayload,
  IRegisterPayload,
  ILoginCredential,
  TForgotPasswordPayload,
} from "./Auth.interfaces";
import sendOTP, { OTPGenerator, verifyOTP } from "../../utils/otp-sender";
import { TAuthUser } from "../../interfaces/common";
import sendEmail from "../../utils/email-sender";
import { userSelectedFields } from "../User/User.constants";
import passwordGenerator from "../../utils/password-generator";

const createOTP = async (data: IOTPCreatePayload) => {
  const generatedOTP = OTPGenerator();
  const expirationTime = (new Date().getTime() + 2 * 60000).toString();
  const SMSBody = `Dear ${
    data.name || "customer"
  }, your OTP is: ${generatedOTP} \n${config.app_name}`;

  const emailBody = `<div style="background-color: #F5F5F5; padding: 40px; text-align: center">
            <h4 style="font-size: 16px; font-weight: bold; color: #3352ff">Your OTP is <span>${generatedOTP}</span></h4>
        </div>`;

  let emailResponse;
  if (data.email) {
    emailResponse = await sendEmail(data.email, emailBody);
  }

  const SMSResponse = await sendOTP(data.contact_number, SMSBody);

  if (emailResponse?.accepted?.length === 0 && SMSResponse.success === false)
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Failed to send OTP");

  const result = await prisma.oTP.create({
    data: {
      name: data.name,
      email: data.email || null,
      contact_number: data.contact_number,
      otp: generatedOTP,
      expires_at: expirationTime,
    },
    select: {
      contact_number: true,
      expires_at: true,
    },
  });

  return result;
};

const register = async (data: IRegisterPayload) => {
  const storedOTP = await prisma.oTP.findFirst({
    where: {
      otp: Number(data.otp),
    },
  });
  if (!storedOTP) {
    throw new ApiError(httpStatus.FORBIDDEN, "OTP not matched");
  }
  const verifiedOTP = await verifyOTP(
    Number(data.otp),
    storedOTP.otp,
    Number(storedOTP.expires_at)
  );
  if (verifiedOTP.success === false) {
    throw new ApiError(httpStatus.FORBIDDEN, verifiedOTP.message);
  }

  const hashedPassword = await bcrypt.hash(
    data.password,
    Number(config.salt_rounds)
  );

  const result = await prisma.$transaction(async (tx) => {
    if (!storedOTP.name || !storedOTP.email) {
      throw new ApiError(httpStatus.FORBIDDEN, "Name and email not found");
    }
    const user = await tx.user.create({
      data: {
        name: storedOTP.name,
        email: storedOTP.email,
        contact_number: storedOTP.contact_number,
        password: hashedPassword,
      },
      select: {
        ...userSelectedFields,
      },
    });
    await tx.oTP.delete({
      where: {
        otp: Number(data.otp),
      },
    });
    return user;
  });

  return result;
};

const login = async (credential: ILoginCredential) => {
  const { email_or_contact_number, password } = credential;

  const user = await prisma.user.findFirst({
    where: {
      OR: [
        {
          email: email_or_contact_number,
        },
        {
          contact_number: email_or_contact_number,
        },
      ],
      status: UserStatus.ACTIVE,
      is_deleted: false,
    },
  });

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }

  const checkPassword = await bcrypt.compare(password, user.password);
  if (!checkPassword) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      "Email/Contact number or password is invalid"
    );
  }

  const jwtPayload = {
    id: user.id,
    contact_number: user.contact_number,
    email: user.email,
    role: user.role,
  };

  const accessToken = generateToken(
    jwtPayload,
    config.jwt_access_secret,
    config.jwt_access_expiresin
  );

  const refreshToken = generateToken(
    jwtPayload,
    config.jwt_refresh_secret,
    config.jwt_refresh_expiresin
  );

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    contact_number: user.contact_number,
    role: user.role,
    profile_pic: user.profile_pic,
    access_token: accessToken,
    refreshToken,
  };
};

const getAccessToken = async (token: string) => {
  if (!token) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Token not found");
  }

  const verifiedUser = verifyToken(
    token,
    config.jwt_refresh_secret
  ) as TAuthUser;

  const user = await prisma.user.findFirst({
    where: {
      id: verifiedUser.id,
      status: UserStatus.ACTIVE,
      is_deleted: false,
    },
  });

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }

  const passwordChangedTime = Math.floor(
    new Date(user.password_changed_at).getTime() / 1000
  );

  if (passwordChangedTime > verifiedUser.iat) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "You are not authorized");
  }

  const jwtPayload = {
    id: user.id,
    contact_number: user.contact_number,
    email: user.email,
    role: user.role,
  };

  const accessToken = generateToken(
    jwtPayload,
    config.jwt_access_secret,
    config.jwt_access_expiresin
  );

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    contact_number: user.contact_number,
    role: user.role,
    profile_pic: user.profile_pic,
    access_token: accessToken,
  };
};

const resetPassword = async (
  user: TAuthUser | undefined,
  payload: IChangePasswordPayload
) => {
  const userInfo = await prisma.user.findUniqueOrThrow({
    where: {
      id: user?.id,
      status: UserStatus.ACTIVE,
      is_deleted: false,
    },
  });

  const checkPassword = await bcrypt.compare(
    payload.old_password,
    userInfo.password
  );

  if (!checkPassword) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Old password is invalid");
  }

  const hashedPassword = await bcrypt.hash(
    payload.new_password,
    Number(config.salt_rounds)
  );

  const result = await prisma.user.update({
    where: {
      id: userInfo?.id,
    },
    data: {
      password: hashedPassword,
      password_changed_at: new Date(),
    },
    select: {
      ...userSelectedFields,
    },
  });

  if (!result) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Failed to update password"
    );
  }

  const jwtPayload = {
    id: result.id,
    contact_number: result.contact_number,
    email: result.email,
    role: result.role,
  };

  const accessToken = generateToken(
    jwtPayload,
    config.jwt_access_secret,
    config.jwt_access_expiresin
  );

  const refreshToken = generateToken(
    jwtPayload,
    config.jwt_refresh_secret,
    config.jwt_refresh_expiresin
  );

  return {
    id: result.id,
    name: result.name,
    email: result.email,
    contact_number: result.contact_number,
    role: result.role,
    profile_pic: result.profile_pic,
    access_token: accessToken,
    refreshToken,
  };
};

const forgotPassword = async (payload: TForgotPasswordPayload) => {
  const { email, new_password, otp } = payload;
  if (new_password && otp) {
    const storedOTP = await prisma.oTP.findFirst({
      where: {
        otp: payload.otp,
      },
    });

    if (!storedOTP) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Invalid OTP");
    }

    await verifyOTP(otp, storedOTP.otp, Number(storedOTP.expires_at));

    const hashedPassword = await bcrypt.hash(
      new_password,
      Number(config.salt_rounds)
    );

    const result = await prisma.user.update({
      where: {
        email: storedOTP.email || "",
      },
      data: {
        password: hashedPassword,
      },
      select: {
        ...userSelectedFields,
      },
    });

    return {
      success: true,
      message: "Password updated successfully",
      data: {
        id: result.id,
        name,
        email: result.email,
        contact_number: result.contact_number,
        profile_pic: result.profile_pic,
        role: result.role,
      },
    };
  } else if (email && !new_password && !otp) {
    const user = await prisma.user.findUniqueOrThrow({
      where: {
        email: email,
        status: UserStatus.ACTIVE,
      },
    });

    const generatedOTP = OTPGenerator();
    const expirationTime = (new Date().getTime() + 2 * 60000).toString();

    const emailBody = `<div style="background-color: #f5f5f5; padding: 40px; border-radius: 10px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); display: flex; justify-content: center; align-items: center;">
    <h1>Your OTP is: </h1>
    <p style="font-size: 24px; font-weight: bold; background-color: #007BFF; color: #fff; padding: 10px 20px; border-radius: 5px;">${generatedOTP}</p>
  </div>`;

    const createOTP = await prisma.oTP.create({
      data: {
        email: user.email,
        otp: generatedOTP,
        expires_at: expirationTime,
      },
    });

    if (createOTP) {
      const res = await sendEmail(user.email, emailBody);
      if (res?.accepted.length > 0) {
        return {
          success: true,
          message: "OTP sent successfully, check your email",
          data: null,
        };
      }
    } else {
      return {
        success: false,
        message: "Failed to send OTP",
        data: null,
      };
    }
  }
};

export const AuthServices = {
  createOTP,
  register,
  login,
  resetPassword,
  forgotPassword,
  getAccessToken,
};
