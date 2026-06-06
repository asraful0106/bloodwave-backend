import type { Document, Types } from "mongoose";

export enum UserRole {
  SUPER_ADMIN = "SUPER_ADMIN",
  ADMIN = "ADMIN",
  USER = "USER",
}
export enum Gender {
  MALE = "MALE",
  FEMALE = "FEMALE",
  OTHER = "OTHER",
}

export enum UserStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  BANNED = "BANNED",
}

export enum CreatedBy {
  SELF = "SELF",
  ADMIN = "ADMIN",
  SYSTEM = "SYSTEM",
}

export interface IUser extends Document {
  _id: Types.ObjectId;
  f_name: string;
  l_name: string;
  phone: string;
  email: string;
  password: string;
  role: UserRole;
  gender: Gender;
  date_of_birth: Date;
  blood_group_name: string; // e.g. "B+"
  is_verified: boolean;
  status: UserStatus;
  created_by: CreatedBy;
  institution_id: Types.ObjectId | null;
  user_image: IUserImage;
  donor_profile: IDonorProfile;
  donor_privacy_settings: IDonorPrivacySettings;
  user_locations: Types.DocumentArray<IUserLocation>;
  user_contacts: Types.DocumentArray<IUserContact>;

  created_at: Date;
  updated_at: Date;
}

export type ImageProvider = "cloudinary" | "s3" | "local";

export interface IImageMeta {
  width: number;
  height: number;
}

export interface IUserImage extends Document {
  link: string;
  provider: ImageProvider;
  is_primary: boolean;
  meta: IImageMeta;
  created_at: Date;
  updated_at: Date;
}

export interface IDonorProfile extends Document {
  is_available: boolean;
  inactive_until: Date | null; // set when donor marks themselves temporarily unavailable
  last_donation_date: Date | null;
  next_eligible_date: Date | null; // computed: last_donation_date + 56 days (whole blood)
  total_donations: number;
  created_at: Date;
  updated_at: Date;
}

export interface IDonorPrivacySettings extends Document {
  show_name: boolean;
  show_gender: boolean;
  show_age: boolean;
  show_phone: boolean;
  show_last_donation: boolean;
  emergency_only: boolean; // only visible to requesters with urgency_level = EMERGENCY
  allow_inapp_call: boolean;
  allow_chat: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface IUserLocation extends Document {
  _id: Types.ObjectId;
  address_text: string;
  city: string;
  lat: number;
  lng: number;
  is_primary: boolean;
  created_at: Date;
  updated_at: Date;
}

export type ContactType = "phone" | "email" | "website" | "social";

export interface IUserContact extends Document {
  _id: Types.ObjectId;
  type: ContactType;
  title: string; // e.g. "Primary", "Emergency", "Facebook", "LinkedIn"
  value: string; // phone number, URL, etc.
  is_public: boolean;
  created_at: Date;
  updated_at: Date;
}
