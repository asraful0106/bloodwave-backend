import passport from "passport";
import type { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";

import { catchAsync } from "../../utils/catchAsync";
import AppError from "../../errorHelper/AppError";
import { createUserTokens } from "../../utils/userTokens";
import { sendResposne } from "../../utils/sendResponse";
import { AuthServices } from "./auth.service";

// Login with phone + password
const credentialsLogin = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate("local", async (err: any, user: any, info: any) => {
      try {
        if (err) {
          return next(
            new AppError(
              StatusCodes.UNAUTHORIZED,
              err.message || "Authentication failed",
            ),
          );
        }

        if (!user) {
          return next(
            new AppError(
              StatusCodes.UNAUTHORIZED,
              info?.message || "Invalid phone or password",
            ),
          );
        }

        const userTokens = await createUserTokens(user);

        const safeUser = user.toObject ? user.toObject() : { ...user };

        delete safeUser.password;

        const responseData = {
          ...safeUser,
          ...userTokens,
        };

        return sendResposne(res, {
          success: true,
          statusCode: StatusCodes.OK,
          message: "User Logged In Successfully.",
          data: responseData,
        });
      } catch (error) {
        next(error);
      }
    })(req, res, next);
  },
);

const getNewAccessToken = catchAsync(async (req: Request, res: Response) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Refresh token is required");
  }

  const tokenInfo = await AuthServices.getNewAccessToken(refreshToken);

  return sendResposne(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "New Access Token Retrieved Successfully.",
    data: tokenInfo,
  });
});

const logout = catchAsync(async (req: Request, res: Response) => {
  return sendResposne(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "User Logged Out Successfully.",
    data: null,
  });
});

export const AuthControllers = {
  credentialsLogin,
  getNewAccessToken,
  logout,
};
