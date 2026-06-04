import type { JwtPayload } from "jsonwebtoken";
import AppError from "../../errorHelper/AppError";
import { StatusCodes } from "http-status-codes";
import { User } from "./user.model";
import type { IUser } from "./user.interface";
import { envVars } from "../../config/envVars";
import bcrypt from "bcryptjs";
import { deleteLocalFileByUrl } from "../../utils/localUpload";

const getMyAccount = async (user: JwtPayload | undefined) => {
  if (!user) {
    throw new AppError(
      StatusCodes.FORBIDDEN,
      "You are not permitted to visit this url",
    );
  }

  const me = await User.findById(user.userId);
  return me;
};

const createUser = async (payload: Partial<IUser>) => {
  const { email, f_name, password, ...rest } = payload;

  if (!email || !f_name || !password) {
    throw new AppError(StatusCodes.BAD_REQUEST, "All fields are required.");
  }

  const isUserExist = await User.findOne({ email });

  if (isUserExist) {
    throw new AppError(StatusCodes.BAD_REQUEST, "User already exists!");
  }

  const hashedPassword = await bcrypt.hash(
    password,
    Number(envVars.BCRYPT_SALT_ROUND),
  );

  const user = await User.create({
    f_name,
    email,
    password: hashedPassword,
    ...rest,
  });

  return user;
};

const updateUser = async (
  id: string,
  payload: Partial<IUser>,
  imageUrl?: string,
) => {
  const user = await User.findById(id);

  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, "User not found!");
  }

  // Handle image update — user_image is a single embedded subdocument
  if (imageUrl && envVars.PROVIDER?.toLowerCase() === "local") {
    // Delete old local image if one exists
    if (user.user_image?.provider === "local" && user.user_image?.link) {
      await deleteLocalFileByUrl(user.user_image.link);
    }

    user.user_image = {
      link: imageUrl,
      provider: "local",
      is_primary: true,
      meta: { width: 0, height: 0 },
    } as IUser["user_image"];
  }

  // Safely merge scalar / nested fields from payload.
  // Array subdocs (user_locations, user_contacts) are replaced wholesale
  // if provided — callers should send the full updated array.
  const {
    user_image, // handled above; ignore from payload
    ...scalarPayload
  } = payload as Partial<IUser> & { user_image?: unknown };

  Object.assign(user, scalarPayload);

  await user.save();

  return user;
};

const deleteUser = async (id: string) => {
  const user = await User.findById(id);

  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, "User not found!");
  }

  // Clean up local image file if present
  if (user.user_image?.provider === "local" && user.user_image?.link) {
    await deleteLocalFileByUrl(user.user_image.link);
  }

  // Hard delete — findByIdAndDelete is cleaner than a stale isDeleted flag
  await User.findByIdAndDelete(id);

  return { message: "User deleted successfully" };
};

export const userService = {
  getMyAccount,
  createUser,
  updateUser,
  deleteUser,
};
