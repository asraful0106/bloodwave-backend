import type { Document, Types } from "mongoose";

export type DonationStatus = "PROCESSING" | "FULFILLED" | "CANCELLED";

/**
 * Snapshot of the blood request embedded at donation time.
 * Preserves context even if the original request is later modified or deleted.
 */
export interface IBloodRequestSnapshot {
  blood_request_id: Types.ObjectId;
  blood_group_id: string;
  blood_group_name: string;
  description: string;
  units_required: number;
  units_fulfilled: number;
  lat: number;
  lng: number;
  urgency_level: string; // string enum from request: "NORMAL" | "URGENT" | "EMERGENCY"
  patient_type: string; // string enum from request: "UNKNOWN" | "RELATIVE" | "FRIEND"
  needed_by: Date;
  status: string;
  location_label: string;
}

/**
 * Snapshot of the requester embedded at donation time.
 */
export interface IRequesterSnapshot {
  requester_user_id: Types.ObjectId;
  f_name: string;
  l_name: string;
  avatar_url?: string;
}

export interface IDonation extends Document {
  blood_request_id: Types.ObjectId;
  donor_user_id: Types.ObjectId;
  units: number;
  status: DonationStatus;
  notes: string | null;
  donated_at: Date | null;
  blood_request_snapshot: IBloodRequestSnapshot;
  requester_snapshot: IRequesterSnapshot;
  created_at: Date;
  updated_at: Date;
}
