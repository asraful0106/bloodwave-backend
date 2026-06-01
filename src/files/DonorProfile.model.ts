import { Schema, model, Document, Types } from 'mongoose';

export interface IDonorProfile extends Document {
  user_id: Types.ObjectId;
  is_available: boolean;
  inactive_until: Date | null;       // set when donor marks themselves temporarily unavailable
  last_donation_date: Date | null;
  next_eligible_date: Date | null;   // computed: last_donation_date + 56 days (whole blood)
  total_donations: number;
  created_at: Date;
  updated_at: Date;
}

const DonorProfileSchema = new Schema<IDonorProfile>(
  {
    user_id:            { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    is_available:       { type: Boolean, default: true },
    inactive_until:     { type: Date, default: null },
    last_donation_date: { type: Date, default: null },
    next_eligible_date: { type: Date, default: null },
    total_donations:    { type: Number, default: 0, min: 0 },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    versionKey: false,
  }
);

export const DonorProfile = model<IDonorProfile>('DonorProfile', DonorProfileSchema);
