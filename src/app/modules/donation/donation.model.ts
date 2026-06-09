import { Schema, model } from 'mongoose';
import type { IBloodRequestSnapshot, IDonation, IRequesterSnapshot } from './donation.interface';

const BloodRequestSnapshotSchema = new Schema<IBloodRequestSnapshot>(
  {
    blood_request_id: { type: Schema.Types.ObjectId, required: true },
    blood_group_id:   { type: String, required: true },
    blood_group_name: { type: String, required: true },
    description:      { type: String },
    units_required:   { type: Number },
    units_fulfilled:  { type: Number },
    lat:              { type: Number },
    lng:              { type: Number },
    urgency_level:    { type: String },
    patient_type:     { type: String },
    needed_by:        { type: Date },
    status:           { type: String },
    location_label:   { type: String },
  },
  { _id: false }
);

const RequesterSnapshotSchema = new Schema<IRequesterSnapshot>(
  {
    requester_user_id: { type: Schema.Types.ObjectId, required: true },
    f_name:            { type: String, required: true },
    l_name:            { type: String, required: true },
    avatar_url:        { type: String },
  },
  { _id: false }
);

const DonationSchema = new Schema<IDonation>(
  {
    blood_request_id: { type: Schema.Types.ObjectId, ref: 'BloodRequest', required: true, index: true },
    donor_user_id:    { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    units:            { type: Number, required: true, min: 1 },
    status:           {
      type: String,
      enum: ['PROCESSING', 'FULFILLED', 'CANCELLED'],
      default: 'PROCESSING',
    },
    notes:                   { type: String, default: null },
    donated_at:              { type: Date, default: null },
    blood_request_snapshot:  { type: BloodRequestSnapshotSchema, required: true },
    requester_snapshot:      { type: RequesterSnapshotSchema, required: true },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    versionKey: false,
  }
);

// Prevent duplicate active donations for the same donor+request
// DonationSchema.index(
//   { donor_user_id: 1, blood_request_id: 1 },
//   {
//     unique: true,
//     partialFilterExpression: { status: { $in: ['PROCESSING', 'FULFILLED'] } },
//   }
// );

export const Donation = model<IDonation>('Donation', DonationSchema);
