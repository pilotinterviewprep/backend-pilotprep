import jwt, { JwtPayload, Secret } from "jsonwebtoken";

export const generateToken = (
  payload: JwtPayload,
  secret: Secret,
  expiresIn: string
) => {
  const token = jwt.sign(payload, secret, { expiresIn });
  return token;
};

export const verifyToken = (token: string, secret: Secret) => {
  return jwt.verify(token, secret) as JwtPayload;
};
