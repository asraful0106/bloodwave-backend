import { Schema, model, Document, Types } from 'mongoose';

/**
 * Tracks daily activity counts per user.
 * Used to render activity heatmaps (like GitHub contribution graphs).
 * One document per user per date — upsert on activity.
 */
export interface IUserActivity extends Document {
  user_id: Types.ObjectId;
  date: Date;    // stored as midnight UTC for the activity day
  count: number;
  created_at: Date;
  updated_at: Date;
}

const UserActivitySchema = new Schema<IUserActivity>(
  {
    user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    date:    { type: Date, required: true },
    count:   { type: Number, default: 1, min: 0 },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    versionKey: false,
  }
);

// Compound unique index: one record per user per day
UserActivitySchema.index({ user_id: 1, date: 1 }, { unique: true });

export const UserActivity = model<IUserActivity>('UserActivity', UserActivitySchema);
