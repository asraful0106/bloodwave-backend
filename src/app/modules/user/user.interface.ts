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
  f_name: string;
  l_name: string;
  phone: string;
  email: string;
  password: string;
  role: UserRole;
  gender: Gender;
  date_of_birth: Date;
  blood_group_id: string; // e.g. "bg-3" — keep as string or ref a BloodGroup collection
  blood_group_name: string; // e.g. "B+"
  is_verified: boolean;
  status: UserStatus;
  created_by: CreatedBy;
  institution_id: Types.ObjectId | null;
  created_at: Date;
  updated_at: Date;
}
