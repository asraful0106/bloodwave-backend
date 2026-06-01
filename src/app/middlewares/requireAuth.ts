import type { Request, Response, NextFunction } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
import AppError from "../errorHelper/AppError.js";

export const requireAuth = (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  try {
    const token = req.cookies?.accessToken;

    if (!token) {
      return next(new AppError(401, "Unauthorized: No access token"));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

    // optional sanity check:
    if (!decoded?.userId) {
      return next(new AppError(401, "Unauthorized: Invalid token payload"));
    }

    req.user = decoded;
    return next();
  } catch (err) {
    return next(new AppError(401, "Unauthorized: Invalid or expired token"));
  }
};
