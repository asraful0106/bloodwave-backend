import { Schema, model, Document, Types } from 'mongoose';

export interface IDonorPrivacySettings extends Document {
  user_id: Types.ObjectId;
  show_name: boolean;
  show_gender: boolean;
  show_age: boolean;
  show_phone: boolean;
  show_last_donation: boolean;
  emergency_only: boolean;        // only visible to requesters with urgency_level = EMERGENCY
  allow_inapp_call: boolean;
  allow_chat: boolean;
  created_at: Date;
  updated_at: Date;
}

const DonorPrivacySettingsSchema = new Schema<IDonorPrivacySettings>(
  {
    user_id:            { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    show_name:          { type: Boolean, default: true },
    show_gender:        { type: Boolean, default: false },
    show_age:           { type: Boolean, default: false },
    show_phone:         { type: Boolean, default: false },
    show_last_donation: { type: Boolean, default: false },
    emergency_only:     { type: Boolean, default: false },
    allow_inapp_call:   { type: Boolean, default: false },
    allow_chat:         { type: Boolean, default: true },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    versionKey: false,
  }
);

export const DonorPrivacySettings = model<IDonorPrivacySettings>(
  'DonorPrivacySettings',
  DonorPrivacySettingsSchema
);
