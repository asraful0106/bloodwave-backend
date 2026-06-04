import type { JwtPayload } from "jsonwebtoken";
import AppError from "../../errorHelper/AppError";
import { StatusCodes } from "http-status-codes";
import { User } from "./user.model";
import type {
  IUser,
  IDonorProfile,
  IDonorPrivacySettings,
  IUserLocation,
  IUserContact,
} from "./user.interface";
import { envVars } from "../../config/envVars";
import bcrypt from "bcryptjs";
import { deleteLocalFileByUrl } from "../../utils/localUpload";

// ─────────────────────────────────────────────
// GET MY ACCOUNT
// ─────────────────────────────────────────────
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

// ─────────────────────────────────────────────
// CREATE USER
// ─────────────────────────────────────────────
const createUser = async (payload: Partial<IUser>) => {
  const { email, f_name, password, ...rest } = payload;

  if (!email || !f_name || !password) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      "f_name, email and password are required.",
    );
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
    donor_profile: {},
    donor_privacy_settings: {},
    user_locations: [],
    user_contacts: [],
    ...rest,
  });
  return user;
};

// ─────────────────────────────────────────────
// UPDATE SCALAR FIELDS  (name, phone, gender, dob, blood group, etc.)
// ─────────────────────────────────────────────
const updateUser = async (
  id: string,
  payload: Partial<IUser>,
  imageUrl?: string,
) => {
  const user = await User.findById(id);
  if (!user) throw new AppError(StatusCodes.NOT_FOUND, "User not found!");

  // ── image ──────────────────────────────────
  if (imageUrl && envVars.PROVIDER?.toLowerCase() === "local") {
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

  // ── scalar fields (strip every subdoc key so they can't corrupt state) ──
  const {
    user_image,
    donor_profile,
    donor_privacy_settings,
    user_locations,
    user_contacts,
    ...scalarPayload
  } = payload as Partial<IUser>;

  Object.assign(user, scalarPayload);
  await user.save();
  return user;
};

// ─────────────────────────────────────────────
// DONOR PROFILE  (single embedded subdoc — full replace)
// ─────────────────────────────────────────────
const updateDonorProfile = async (
  id: string,
  payload: Partial<IDonorProfile>,
) => {
  const user = await User.findById(id);
  if (!user) throw new AppError(StatusCodes.NOT_FOUND, "User not found!");

  // Merge into existing subdoc so caller can send partial updates
  if (!user.donor_profile) {
    user.donor_profile = {} as IDonorProfile;
  }
  Object.assign(user.donor_profile, payload);
  await user.save();
  return user.donor_profile;
};

// ─────────────────────────────────────────────
// DONOR PRIVACY SETTINGS  (single embedded subdoc — full replace)
// ─────────────────────────────────────────────
const updateDonorPrivacySettings = async (
  id: string,
  payload: Partial<IDonorPrivacySettings>,
) => {
  const user = await User.findById(id);
  if (!user) throw new AppError(StatusCodes.NOT_FOUND, "User not found!");

  if (!user.donor_privacy_settings) {
    user.donor_privacy_settings = {} as IDonorPrivacySettings;
  }
  Object.assign(user.donor_privacy_settings, payload);
  await user.save();
  return user.donor_privacy_settings;
};

// ─────────────────────────────────────────────
// USER LOCATIONS  (array subdoc)
// ─────────────────────────────────────────────
const addUserLocation = async (id: string, payload: Partial<IUserLocation>) => {
  const user = await User.findById(id);
  if (!user) throw new AppError(StatusCodes.NOT_FOUND, "User not found!");

  if (!user.user_locations) {
    user.user_locations = [] as any;
  }

  // If new location is primary, unset the old one
  if (payload.is_primary) {
    user.user_locations.forEach((loc) => (loc.is_primary = false));
  }

  user.user_locations.push(payload as IUserLocation);
  await user.save();
  return user.user_locations;
};

const updateUserLocation = async (
  id: string,
  locationId: string,
  payload: Partial<IUserLocation>,
) => {
  const user = await User.findById(id);
  if (!user) throw new AppError(StatusCodes.NOT_FOUND, "User not found!");

  const location = user.user_locations.id(locationId);
  if (!location)
    throw new AppError(StatusCodes.NOT_FOUND, "Location not found!");

  if (payload.is_primary) {
    user.user_locations.forEach((loc) => (loc.is_primary = false));
  }

  Object.assign(location, payload);
  await user.save();
  return user.user_locations;
};

const deleteUserLocation = async (id: string, locationId: string) => {
  const user = await User.findById(id);
  if (!user) throw new AppError(StatusCodes.NOT_FOUND, "User not found!");

  const location = user.user_locations.id(locationId);
  if (!location)
    throw new AppError(StatusCodes.NOT_FOUND, "Location not found!");

  location.deleteOne();
  await user.save();
  return user.user_locations;
};

// ─────────────────────────────────────────────
// USER CONTACTS  (array subdoc)
// ─────────────────────────────────────────────
const addUserContact = async (id: string, payload: Partial<IUserContact>) => {
  const user = await User.findById(id);
  if (!user) throw new AppError(StatusCodes.NOT_FOUND, "User not found!");

  if (!user.user_contacts) {
    user.user_contacts = [] as any;
  }

  user.user_contacts.push(payload as IUserContact);
  await user.save();
  return user.user_contacts;
};

const updateUserContact = async (
  id: string,
  contactId: string,
  payload: Partial<IUserContact>,
) => {
  const user = await User.findById(id);
  if (!user) throw new AppError(StatusCodes.NOT_FOUND, "User not found!");

  const contact = user.user_contacts.id(contactId);
  if (!contact) throw new AppError(StatusCodes.NOT_FOUND, "Contact not found!");

  Object.assign(contact, payload);
  await user.save();
  return user.user_contacts;
};

const deleteUserContact = async (id: string, contactId: string) => {
  const user = await User.findById(id);
  if (!user) throw new AppError(StatusCodes.NOT_FOUND, "User not found!");

  const contact = user.user_contacts.id(contactId);
  if (!contact) throw new AppError(StatusCodes.NOT_FOUND, "Contact not found!");

  contact.deleteOne();
  await user.save();
  return user.user_contacts;
};

// ─────────────────────────────────────────────
// DELETE USER
// ─────────────────────────────────────────────
const deleteUser = async (id: string) => {
  const user = await User.findById(id);
  if (!user) throw new AppError(StatusCodes.NOT_FOUND, "User not found!");

  if (user.user_image?.provider === "local" && user.user_image?.link) {
    await deleteLocalFileByUrl(user.user_image.link);
  }

  await User.findByIdAndDelete(id);
  return { message: "User deleted successfully" };
};

export const userService = {
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
