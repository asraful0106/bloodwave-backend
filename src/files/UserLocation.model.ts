import { Schema, model, Document, Types } from 'mongoose';

export interface IUserLocation extends Document {
  user_id: Types.ObjectId;
  address_text: string;
  city: string;
  lat: number;
  lng: number;
  is_primary: boolean;
  created_at: Date;
  updated_at: Date;
}

const UserLocationSchema = new Schema<IUserLocation>(
  {
    user_id:      { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    address_text: { type: String, required: true, trim: true },
    city:         { type: String, required: true, trim: true },
    lat:          { type: Number, required: true },
    lng:          { type: Number, required: true },
    is_primary:   { type: Boolean, default: false },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    versionKey: false,
  }
);

// Geospatial index for proximity-based donor/request search
UserLocationSchema.index({ lat: 1, lng: 1 });
UserLocationSchema.index({ user_id: 1, is_primary: 1 });

export const UserLocation = model<IUserLocation>('UserLocation', UserLocationSchema);
