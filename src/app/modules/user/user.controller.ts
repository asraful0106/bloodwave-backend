import type { NextFunction, Response, Request } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { userService } from "./user.service";
import { sendResposne } from "../../utils/sendResponse";
import { StatusCodes } from "http-status-codes";
import { envVars } from "../../config/envVars";
import { saveLocalImage } from "../../utils/localUpload";

// ─── GET MY ACCOUNT ───────────────────────────
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

// ─── CREATE USER ──────────────────────────────
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

// ─── UPDATE SCALAR FIELDS ─────────────────────
const updateUser = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const { id } = req.params;
    let imageUrl: string | undefined;

    if (req.file && envVars.PROVIDER?.toLowerCase() === "local") {
      const saved = await saveLocalImage({
        buffer: req.file.buffer,
        originalname: req.file.originalname,
      });
      imageUrl = saved.url;
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

// ─── DONOR PROFILE ────────────────────────────
const updateDonorProfile = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const { id } = req.params;
    const updated = await userService.updateDonorProfile(id as string, req.body);
    sendResposne(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Donor profile updated successfully",
      data: updated,
    });
  },
);

// ─── DONOR PRIVACY SETTINGS ───────────────────
const updateDonorPrivacySettings = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const { id } = req.params;
    const updated = await userService.updateDonorPrivacySettings(id as string, req.body);
    sendResposne(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Donor privacy settings updated successfully",
      data: updated,
    });
  },
);

// ─── LOCATIONS ────────────────────────────────
const addUserLocation = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const { id } = req.params;
    const locations = await userService.addUserLocation(id as string, req.body);
    sendResposne(res, {
      success: true,
      statusCode: StatusCodes.CREATED,
      message: "Location added successfully",
      data: locations,
    });
  },
);

const updateUserLocation = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const { id, locationId } = req.params;
    const locations = await userService.updateUserLocation(
      id as string,
      locationId as string,
      req.body,
    );
    sendResposne(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Location updated successfully",
      data: locations,
    });
  },
);

const deleteUserLocation = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const { id, locationId } = req.params;
    const locations = await userService.deleteUserLocation(
      id as string,
      locationId as string,
    );
    sendResposne(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Location deleted successfully",
      data: locations,
    });
  },
);

// ─── CONTACTS ─────────────────────────────────
const addUserContact = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const { id } = req.params;
    const contacts = await userService.addUserContact(id as string, req.body);
    sendResposne(res, {
      success: true,
      statusCode: StatusCodes.CREATED,
      message: "Contact added successfully",
      data: contacts,
    });
  },
);

const updateUserContact = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const { id, contactId } = req.params;
    const contacts = await userService.updateUserContact(
      id as string,
      contactId as string,
      req.body,
    );
    sendResposne(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Contact updated successfully",
      data: contacts,
    });
  },
);

const deleteUserContact = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const { id, contactId } = req.params;
    const contacts = await userService.deleteUserContact(
      id as string,
      contactId as string,
    );
    sendResposne(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Contact deleted successfully",
      data: contacts,
    });
  },
);

// ─── DELETE USER ──────────────────────────────
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
  updateDonorProfile,
  updateDonorPrivacySettings,
  addUserLocation,
  updateUserLocation,
  deleteUserLocation,
  addUserContact,
  updateUserContact,
  deleteUserContact,
  deleteUser,
};