import { Provider, User, UserStatus } from "@prisma/client";
import bcrypt from "bcrypt";
import httpStatus from "http-status";
import config from "../../../config";
import ApiError from "../../error/api-error";
import { TAuthUser } from "../../interfaces/common";
import prisma from "../../shared/prisma";
import sendEmail from "../../utils/email-sender";
import { generateToken, verifyToken } from "../../utils/jwt-helper";
import { OTPGenerator, verifyOTP } from "../../utils/otp-sender";
import { userSelectedFields } from "../User/User.constants";
import {
  IChangePasswordPayload,
  ILoginCredential,
  IOTPCreatePayload,
  IRegisterPayload,
  TAccessBySocialMediaPayload,
  TForgotPasswordPayload,
} from "./Auth.interfaces";

const createOTP = async (data: IOTPCreatePayload) => {
  const generatedOTP = OTPGenerator();
  const expirationTime = (new Date().getTime() + 2 * 60000).toString();

  const isUserExist = await prisma.user.findFirst({
    where: {
      email: data.email,
    },
  });

  if (isUserExist) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Email already exist. Please login");
  }

  const emailBody = `<div style="background-color: #F5F5F5; padding: 40px; text-align: center">
            <h4 style="font-size: 16px; font-weight: bold; color: #3352ff">Your OTP is <span>${generatedOTP}</span></h4>
        </div>`;

  let emailResponse;
  if (data.email) {
    emailResponse = await sendEmail(data.email, emailBody);
  }

  if (emailResponse?.accepted?.length === 0)
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Failed to send OTP");

  const result = await prisma.oTP.create({
    data: {
      first_name: data.first_name,
      username: data.username,
      email: data.email || null,
      otp: generatedOTP,
      expires_at: expirationTime,
    },
    select: {
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
    if (!storedOTP.first_name || !storedOTP.email) {
      throw new ApiError(httpStatus.FORBIDDEN, "Name and email not found");
    }
    const user = await tx.user.create({
      data: {
        first_name: storedOTP.first_name,
        last_name: storedOTP.last_name,
        username: storedOTP.username,
        country: storedOTP.country,
        email: storedOTP.email,
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
  const { email, password } = credential;

  const user = await prisma.user.findFirst({
    where: {
      OR: [
        {
          email: email,
        },
      ],
      status: UserStatus.ACTIVE,
      is_deleted: false,
    },
  });

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }
  if (user.provider !== Provider.MANUAL) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      "User exist, please try with correct method"
    );
  }
  if (!user.password) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      "Email/Contact number or password is invalid"
    );
  }

  const checkPassword = await bcrypt.compare(password, user.password);
  if (!checkPassword) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      "Email/Contact number or password is invalid"
    );
  }

  const { accessToken, refreshToken } = prepareToken(user);

  return {
    id: user.id,
    first_name: user.first_name,
    last_name: user.last_name,
    username: user.username,
    country: user.country,
    email: user.email,
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
    first_name: user.first_name,
    last_name: user.last_name,
    username: user.username,
    country: user.country,
    email: user.email,
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

  if (!userInfo.password) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Password not found");
  }

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
    name: result.first_name + " " + result.last_name,
    email: result.email,
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
        first_name: result.first_name,
        last_name: result.last_name,
        username: result.username,
        email: result.email,
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

    if (user.provider !== Provider.MANUAL) {
      throw new ApiError(
        httpStatus.FORBIDDEN,
        "Can't reset password. You are registered with third party provider"
      );
    }

    const generatedOTP = OTPGenerator();
    const expirationTime = (new Date().getTime() + 2 * 60000).toString();

    const emailBody = `<div style="background-color: #f5f5f5; padding: 40px; border-radius: 10px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); display: flex; justify-content: center; align-items: center;">
    <h1>Your OTP is: </h1>
    <p style="font-size: 24px; font-weight: bold; background-color: #007BFF; color: #fff; padding: 10px 20px; border-radius: 5px;">${generatedOTP}</p>
  </div>`;

    const createOTP = await prisma.oTP.create({
      data: {
        first_name: user.first_name,
        username: user.username,
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

const socialLogin = async (payload: TAccessBySocialMediaPayload) => {
  const isExist = await prisma.user.findUnique({
    where: {
      email: payload.email,
    },
  });

  if (isExist) {
    if (
      isExist.provider === Provider.MANUAL ||
      isExist.provider !== payload.provider
    ) {
      throw new ApiError(
        httpStatus.FORBIDDEN,
        "User already exist, please try to correct method"
      );
    }

    const { accessToken, refreshToken } = prepareToken(isExist);

    return {
      id: isExist.id,
      first_name: isExist.first_name,
      email: isExist.email,
      role: isExist.role,
      profile_pic: isExist.profile_pic,
      access_token: accessToken,
      refreshToken,
    };
  } else {
    const newUser = await prisma.user.create({
      data: {
        first_name: payload.first_name,
        email: payload.email,
        username: payload.username,
        profile_pic: payload.profile_pic || null,
        provider: payload.provider,
      },
    });

    const { accessToken, refreshToken } = prepareToken(newUser);

    return {
      id: newUser.id,
      first_name: newUser.first_name,
      email: newUser.email,
      role: newUser.role,
      profile_pic: newUser.profile_pic,
      access_token: accessToken,
      refreshToken,
    };
  }
};

const prepareToken = (user: User) => {
  const jwtPayload = {
    id: user.id,
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
    accessToken,
    refreshToken,
  };
};

export const AuthServices = {
  createOTP,
  register,
  login,
  resetPassword,
  forgotPassword,
  getAccessToken,
  socialLogin,
};
