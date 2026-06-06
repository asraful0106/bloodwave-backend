import type { Document, Types } from "mongoose";

export type UrgencyLevel = 1 | 2 | 3;
// 1 = NORMAL, 2 = URGENT, 3 = EMERGENCY

export type PatientType = "adult" | "child";

export type BloodRequestStatus =
  | "active"
  | "pending"
  | "fulfilled"
  | "cancelled"
  | "expired";

export interface IBloodRequest extends Document {
  user_id: Types.ObjectId; // requester
  blood_group_name: string; // e.g. "B+"
  description: string;
  units_required: number;
  lat: number;
  lng: number;
  location_label?: string; // human-readable hospital/area name
  qty: number; // units currently pledged / in-progress
  urgency_level: UrgencyLevel;
  patient_type: PatientType;
  needed_by_datetime: Date;
  blood_request_status: BloodRequestStatus;
  share_token: string | null; // public shareable token
  donors_count: number; // denormalised count for quick display
  created_at: Date;
  updated_at: Date;
}
