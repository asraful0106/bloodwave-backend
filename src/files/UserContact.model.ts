import { Schema, model, Document, Types } from 'mongoose';

export type ContactType = 'phone' | 'email' | 'website' | 'social';

export interface IUserContact extends Document {
  user_id: Types.ObjectId;
  type: ContactType;
  title: string;       // e.g. "Primary", "Emergency", "Facebook", "LinkedIn"
  value: string;       // phone number, URL, etc.
  is_public: boolean;
  created_at: Date;
  updated_at: Date;
}

const UserContactSchema = new Schema<IUserContact>(
  {
    user_id:   { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    type:      { type: String, enum: ['phone', 'email', 'website', 'social'], required: true },
    title:     { type: String, required: true, trim: true },
    value:     { type: String, required: true, trim: true },
    is_public: { type: Boolean, default: true },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    versionKey: false,
  }
);

export const UserContact = model<IUserContact>('UserContact', UserContactSchema);
