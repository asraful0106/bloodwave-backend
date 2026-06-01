import type { JwtPayload, SignOptions } from "jsonwebtoken";
import jwt from "jsonwebtoken";

// For sing up a new token
export const generateToken = (
  paylod: JwtPayload,
  secret: string,
  expiresIn: string,
) => {
  const token = jwt.sign(paylod, secret, {
    expiresIn,
  } as SignOptions);
  return token;
};

// For verify jwt token
export const verifyToken = (token: string, secret: string) => {
  const verifiedToken = jwt.verify(token, secret);
  return verifiedToken;
};
