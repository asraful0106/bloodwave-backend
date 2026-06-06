import { Schema, model } from "mongoose";
import {
  CreatedBy,
  Gender,
  UserRole,
  UserStatus,
  type IDonorPrivacySettings,
  type IDonorProfile,
  type IUser,
  type IUserContact,
  type IUserImage,
  type IUserLocation,
} from "./user.interface";

const UserImageSchema = new Schema<IUserImage>(
  {
    link: { type: String, required: true },
    provider: {
      type: String,
      enum: ["cloudinary", "s3", "local"],
      required: true,
    },
    is_primary: { type: Boolean, default: false },
    meta: {
      width: { type: Number },
      height: { type: Number },
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
    versionKey: false,
  },
);

const DonorProfileSchema = new Schema<IDonorProfile>(
  {
    is_available: { type: Boolean, default: true },
    inactive_until: { type: Date, default: null },
    last_donation_date: { type: Date, default: null },
    next_eligible_date: { type: Date, default: null },
    total_donations: { type: Number, default: 0, min: 0 },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
    versionKey: false,
  },
);

const DonorPrivacySettingsSchema = new Schema<IDonorPrivacySettings>(
  {
    show_name: { type: Boolean, default: true },
    show_gender: { type: Boolean, default: false },
    show_age: { type: Boolean, default: false },
    show_phone: { type: Boolean, default: false },
    show_last_donation: { type: Boolean, default: false },
    emergency_only: { type: Boolean, default: false },
    allow_inapp_call: { type: Boolean, default: false },
    allow_chat: { type: Boolean, default: true },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
    versionKey: false,
  },
);

const UserLocationSchema = new Schema<IUserLocation>(
  {
    address_text: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
    is_primary: { type: Boolean, default: false },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
    versionKey: false,
  },
);

const UserContactSchema = new Schema<IUserContact>(
  {
    type: {
      type: String,
      enum: ["phone", "email", "website", "social"],
      required: true,
    },
    title: { type: String, required: true, trim: true },
    value: { type: String, required: true, trim: true },
    is_public: { type: Boolean, default: true },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
    versionKey: false,
  },
);

const UserSchema = new Schema<IUser>(
  {
    f_name: { type: String, required: true, trim: true },
    l_name: { type: String, trim: true },
    phone: { type: String, unique: true, sparse: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.USER,
    },
    gender: { type: String, enum: Object.values(Gender) },
    date_of_birth: { type: Date },
    blood_group_name: { type: String },
    is_verified: { type: Boolean, default: false },
    status: {
      type: String,
      enum: Object.values(UserStatus),
      default: UserStatus.ACTIVE,
    },
    created_by: {
      type: String,
      enum: Object.values(CreatedBy),
      default: CreatedBy.SELF,
    },
    institution_id: {
      type: Schema.Types.ObjectId,
      ref: "Institution",
      default: null,
    },
    user_image: UserImageSchema,
    donor_profile: DonorProfileSchema,
    donor_privacy_settings: DonorPrivacySettingsSchema,
    user_locations: { type: [UserLocationSchema], default: [] },
    user_contacts: { type: [UserContactSchema], default: [] },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
    versionKey: false,
  },
);

export const User = model<IUser>("User", UserSchema);
