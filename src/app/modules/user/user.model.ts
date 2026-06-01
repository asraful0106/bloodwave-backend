import { Schema, model } from "mongoose";
import { CreatedBy, Gender, UserRole, UserStatus, type IUser } from "./user.interface";


const UserSchema = new Schema<IUser>(
  {
    f_name: { type: String, required: true, trim: true },
    l_name: { type: String, trim: true },
    phone: { type: String, unique: true, trim: true },
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
    blood_group_id: { type: String},
    blood_group_name: { type: String},
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
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
    versionKey: false,
  },
);

export const User = model<IUser>("User", UserSchema);
