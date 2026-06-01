import { Schema, model, Document, Types } from 'mongoose';

export type UserRole = 'USER' | 'ADMIN' | 'MODERATOR';
export type Gender = 'MALE' | 'FEMALE' | 'OTHER';
export type UserStatus = 'ACTIVE' | 'INACTIVE' | 'BANNED';
export type CreatedBy = 'SELF' | 'ADMIN' | 'SYSTEM';

export interface IUser extends Document {
  f_name: string;
  l_name: string;
  phone: string;
  email: string;
  user_role: UserRole;
  gender: Gender;
  date_of_birth: Date;
  blood_group_id: string;         // e.g. "bg-3" — keep as string or ref a BloodGroup collection
  blood_group_name: string;       // e.g. "B+"
  is_verified: boolean;
  status: UserStatus;
  created_by: CreatedBy;
  institution_id: Types.ObjectId | null;
  created_at: Date;
  updated_at: Date;
}

const UserSchema = new Schema<IUser>(
  {
    f_name:           { type: String, required: true, trim: true },
    l_name:           { type: String, required: true, trim: true },
    phone:            { type: String, required: true, unique: true, trim: true },
    email:            { type: String, required: true, unique: true, lowercase: true, trim: true },
    user_role:        { type: String, enum: ['USER', 'ADMIN', 'MODERATOR'], default: 'USER' },
    gender:           { type: String, enum: ['MALE', 'FEMALE', 'OTHER'], required: true },
    date_of_birth:    { type: Date, required: true },
    blood_group_id:   { type: String, required: true },
    blood_group_name: { type: String, required: true },
    is_verified:      { type: Boolean, default: false },
    status:           { type: String, enum: ['ACTIVE', 'INACTIVE', 'BANNED'], default: 'ACTIVE' },
    created_by:       { type: String, enum: ['SELF', 'ADMIN', 'SYSTEM'], default: 'SELF' },
    institution_id:   { type: Schema.Types.ObjectId, ref: 'Institution', default: null },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    versionKey: false,
  }
);

export const User = model<IUser>('User', UserSchema);
