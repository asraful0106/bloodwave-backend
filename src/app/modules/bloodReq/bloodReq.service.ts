import { Types } from "mongoose";
import { BloodRequest } from "./bloodReq.model";
import type { IBloodRequest } from "./bloodReq.interface";

// Fields projected from the populated user document on GET responses
const USER_POPULATE = {
  path: "user_id",
  select: "f_name l_name blood_group_name user_image user_contacts",
};

// ─── Create ──────────────────────────────────────────────────────────────────

export const createBloodRequest = async (
  payload: Partial<IBloodRequest>,
): Promise<IBloodRequest> => {
  const request = await BloodRequest.create(payload);
  return request;
};

// ─── Get one (with requester info) ───────────────────────────────────────────

export const getBloodRequestById = async (
  id: string,
): Promise<IBloodRequest | null> => {
  if (!Types.ObjectId.isValid(id)) return null;

  const request = await BloodRequest.findById(id)
    .populate(USER_POPULATE)
    .lean();

  return request as IBloodRequest | null;
};

export const getAllBloodReqByUserId = async (
  id: string,
): Promise<IBloodRequest[]> => {
  if (!Types.ObjectId.isValid(id)) return [];

  const requests = await BloodRequest.find({ user_id: id })
    .populate(USER_POPULATE)
    .lean();

  return requests as IBloodRequest[];
};

// ─── Get all (no pagination, with requester info) ────────────────────────────

export const getAllBloodRequests = async (): Promise<IBloodRequest[]> => {
  const requests = await BloodRequest.find()
    .populate(USER_POPULATE)
    .sort({ created_at: -1 })
    .lean();

  return requests as IBloodRequest[];
};

// ─── Update ───────────────────────────────────────────────────────────────────

export const updateBloodRequest = async (
  id: string,
  payload: Partial<IBloodRequest>,
): Promise<IBloodRequest | null> => {
  if (!Types.ObjectId.isValid(id)) return null;

  // Prevent callers from accidentally overwriting immutable ownership field
  delete (payload as Partial<IBloodRequest> & { user_id?: unknown }).user_id;

  const updated = await BloodRequest.findByIdAndUpdate(
    id,
    { $set: payload },
    { new: true, runValidators: true },
  ).lean();

  return updated as IBloodRequest | null;
};

// ─── Delete ───────────────────────────────────────────────────────────────────

export const deleteBloodRequest = async (
  id: string,
): Promise<IBloodRequest | null> => {
  if (!Types.ObjectId.isValid(id)) return null;

  const deleted = await BloodRequest.findByIdAndDelete(id).lean();
  return deleted as IBloodRequest | null;
};
