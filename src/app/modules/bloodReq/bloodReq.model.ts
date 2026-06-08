import { Schema, model } from "mongoose";
import type { IBloodRequest } from "./bloodReq.interface";

const BloodRequestSchema = new Schema<IBloodRequest>(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    blood_group_name: { type: String, required: true },
    description: { type: String, trim: true },
    units_required: { type: Number, required: true, min: 1 },
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
    location_label: { type: String, trim: true },
    qty: { type: Number, default: 0, min: 0 },
    urgency_level: { type: Number, enum: [1, 2, 3], required: true },
    patient_type: { type: String, enum: ["adult", "child"], required: true },
    needed_by_datetime: { type: Date, required: true },
    blood_request_status: {
      type: String,
      enum: ["active", "pending", "fulfilled", "cancelled", "expired"],
      default: "pending",
    },
    share_token: { type: String, default: null, sparse: true },
    donors_count: { type: Number, default: 0, min: 0 },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
    versionKey: false,
  },
);

// // Geospatial index — find nearby requests
// BloodRequestSchema.index({ lat: 1, lng: 1 });
// // Common filter combos
// BloodRequestSchema.index({ blood_group_name: 1, blood_request_status: 1 });
// BloodRequestSchema.index({ urgency_level: -1, needed_by_datetime: 1 });
// BloodRequestSchema.index({ share_token: 1 }, { sparse: true });

export const BloodRequest = model<IBloodRequest>(
  "BloodRequest",
  BloodRequestSchema,
);
