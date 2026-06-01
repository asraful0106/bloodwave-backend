import type { NextFunction, Request, Response } from "express";
import AppError from "../errorHelper/AppError.js";
import { StatusCodes } from "http-status-codes";
import { verifyToken } from "../utils/jwt";
import { envVars } from "../config/envVars.js";
import type { JwtPayload } from "jsonwebtoken";

export const checkAuth =
  (...authRoles: string[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // const accessToken = req.headers.authorization;
      const accessToken = req.cookies.accessToken;

      if (!accessToken) {
        throw new AppError(StatusCodes.FORBIDDEN, "NO Token Recieved");
      }

      const verifedToken = verifyToken(
        accessToken,
        envVars.JWT_SECRET,
      ) as JwtPayload;

      if (!authRoles.includes(verifedToken.role)) {
        throw new AppError(
          StatusCodes.FORBIDDEN,
          "You are not permitted to view this route!",
        );
      }
      req.user = verifedToken;
      next();
    } catch (err) {
      next(err);
    }
  };
