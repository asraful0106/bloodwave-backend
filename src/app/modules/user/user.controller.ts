import type { NextFunction, Response, Request } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { userService } from "./user.service";
import { sendResposne } from "../../utils/sendResponse";
import { StatusCodes } from "http-status-codes";
import { envVars } from "../../config/envVars";
import { saveLocalImage } from "../../utils/localUpload";

const getMyAccount = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const me = await userService.getMyAccount(req.user);
    sendResposne(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "User retrieved successfully",
      data: me,
    });
  },
);

const createUser = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const createdUser = await userService.createUser(req.body);

    sendResposne(res, {
      success: true,
      statusCode: StatusCodes.CREATED,
      message: "User created successfully",
      data: createdUser,
    });
  },
);

const updateUser = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const { id } = req.params;

    let imageUrl: string | undefined;

    if (req.file) {
      // Normalise to lowercase for a consistent comparison
      if (envVars.PROVIDER?.toLowerCase() === "local") {
        const saved = await saveLocalImage({
          buffer: req.file.buffer,
          originalname: req.file.originalname,
        });
        imageUrl = saved.url;
      }
    }

    const updated = await userService.updateUser(id as string, req.body, imageUrl);

    sendResposne(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "User updated successfully",
      data: updated,
    });
  },
);

const deleteUser = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const { id } = req.params;

    const result = await userService.deleteUser(id as string);

    sendResposne(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "User deleted successfully",
      data: result,
    });
  },
);

export const userController = {
  getMyAccount,
  createUser,
  updateUser,
  deleteUser,
};
