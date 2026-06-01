import { Schema, model, Document, Types } from 'mongoose';

export type ImageProvider = 'cloudinary' | 's3' | 'local';

export interface IImageMeta {
  width: number;
  height: number;
}

export interface IUserImage extends Document {
  user_id: Types.ObjectId;
  link: string;
  provider: ImageProvider;
  is_primary: boolean;
  meta: IImageMeta;
  created_at: Date;
  updated_at: Date;
}

const UserImageSchema = new Schema<IUserImage>(
  {
    user_id:    { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    link:       { type: String, required: true },
    provider:   { type: String, enum: ['cloudinary', 's3', 'local'], required: true },
    is_primary: { type: Boolean, default: false },
    meta: {
      width:  { type: Number },
      height: { type: Number },
    },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    versionKey: false,
  }
);

// Only one primary image per user
UserImageSchema.index({ user_id: 1, is_primary: 1 });

export const UserImage = model<IUserImage>('UserImage', UserImageSchema);
