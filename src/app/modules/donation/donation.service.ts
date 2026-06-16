import mongoose, { type ClientSession, type Types } from "mongoose";
import { Donation } from "./donation.model";
import type { IDonation } from "./donation.interface";
import { BloodRequest } from "../bloodReq/bloodReq.model";
import { User } from "../user/user.model";

// ─── DTOs ────────────────────────────────────────────────────────────────────

export interface CreateDonationDTO {
  blood_request_id: string;
  donor_user_id: string; // injected from auth middleware
  units: number;
  notes?: string;
}

export interface UpdateDonationDTO {
  notes?: string;
  status?: "FULFILLED" | "CANCELLED";
  donated_at?: Date;
}

export interface ListDonationsQuery {
  donor_user_id?: string;
  blood_request_id?: string;
  status?: string;
  page?: number;
  limit?: number;
}

// ─── Service ─────────────────────────────────────────────────────────────────

export const DonationService = {
  // ── CREATE ────────────────────────────────────────────────────────────────

  async createDonation(dto: CreateDonationDTO): Promise<IDonation> {
    const session: ClientSession = await mongoose.startSession();
    session.startTransaction();

    try {
      // 1. Lock & fetch the blood request within the transaction
      const bloodRequest = await BloodRequest.findById(dto.blood_request_id)
        .session(session)
        .exec();

      if (!bloodRequest) {
        throw new Error("Blood request not found.");
      }

      if (
        bloodRequest.blood_request_status !== "active" &&
        bloodRequest.blood_request_status !== "pending"
      ) {
        throw new Error(
          `Blood request is ${bloodRequest.blood_request_status} and cannot accept donations.`,
        );
      }

      // 2. Capacity check — qty can never exceed units_required
      const newQty = bloodRequest.qty + dto.units;
      if (newQty > bloodRequest.units_required) {
        const remaining = bloodRequest.units_required - bloodRequest.qty;
        throw new Error(
          `Only ${remaining} unit(s) still needed. You tried to donate ${dto.units}.`,
        );
      }

      // 3. Build snapshots (captured at donation time)
      const bloodRequestSnapshot = {
        blood_request_id: bloodRequest._id as Types.ObjectId,
        blood_group_id: bloodRequest.blood_group_name, // use name as id if no separate id field
        blood_group_name: bloodRequest.blood_group_name,
        description: bloodRequest.description ?? "",
        units_required: bloodRequest.units_required,
        units_fulfilled: bloodRequest.qty, // before this donation
        lat: bloodRequest.lat,
        lng: bloodRequest.lng,
        urgency_level: String(bloodRequest.urgency_level),
        patient_type: bloodRequest.patient_type,
        needed_by: bloodRequest.needed_by_datetime,
        status: bloodRequest.blood_request_status,
        location_label: bloodRequest.location_label ?? "",
      };

      // NOTE: Requester snapshot — caller should pass requester info or you fetch User here.
      // For now we build a minimal snapshot from blood request user_id.
      // Extend this by injecting requester name/avatar from your User model.
      const bloodReqUser = await User.findById(bloodRequest.user_id);
      if(!bloodReqUser) {
        throw new Error("User not found.");
      }
      const requesterSnapshot = {
        requester_user_id: bloodRequest.user_id,
        f_name: bloodReqUser?.f_name,
        l_name: bloodReqUser?.l_name,
        avatar_url: bloodReqUser?.user_image?.link,
      };

      // 4. Create the donation document
      const [donation] = await Donation.create(
        [
          {
            blood_request_id: bloodRequest._id,
            donor_user_id: new mongoose.Types.ObjectId(dto.donor_user_id),
            units: dto.units,
            status: "PROCESSING",
            notes: dto.notes ?? null,
            donated_at: null,
            blood_request_snapshot: bloodRequestSnapshot,
            requester_snapshot: requesterSnapshot,
          },
        ],
        { session },
      );

      // 5. Update blood request qty & flip status to fulfilled if now complete
      const updatedQty = newQty;
      const isFulfilled = updatedQty >= bloodRequest.units_required;

      await BloodRequest.findByIdAndUpdate(
        bloodRequest._id,
        {
          $set: {
            qty: updatedQty,
            ...(isFulfilled ? { blood_request_status: "fulfilled" } : {}),
          },
          $inc: { donors_count: 1 },
        },
        { session },
      );

      await session.commitTransaction();
      return donation as IDonation;
    } catch (err) {
      await session.abortTransaction();
      throw err;
    } finally {
      session.endSession();
    }
  },

  // ── READ (list) ───────────────────────────────────────────────────────────

  async listDonations(query: ListDonationsQuery) {
    const {
      donor_user_id,
      blood_request_id,
      status,
      page = 1,
      limit = 20,
    } = query;

    const filter: Record<string, unknown> = {};
    if (donor_user_id)
      filter.donor_user_id = new mongoose.Types.ObjectId(donor_user_id);
    if (blood_request_id)
      filter.blood_request_id = new mongoose.Types.ObjectId(blood_request_id);
    if (status) filter.status = status;

    const skip = (page - 1) * limit;

    const [donations, total] = await Promise.all([
      Donation.find(filter)
        .skip(skip)
        .limit(limit)
        .sort({ created_at: -1 })
        .lean(),
      Donation.countDocuments(filter),
    ]);

    return {
      donations,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    };
  },

  // ── READ (single) ─────────────────────────────────────────────────────────

  async getDonationById(id: string): Promise<IDonation> {
    const donation = await Donation.findById(id).lean();
    if (!donation) throw new Error("Donation not found.");
    return donation as unknown as IDonation;
  },

  // ── UPDATE ────────────────────────────────────────────────────────────────

  async updateDonation(id: string, dto: UpdateDonationDTO): Promise<IDonation> {
    // Guard: cannot update a cancelled donation
    const existing = await Donation.findById(id);
    if (!existing) throw new Error("Donation not found.");
    if (existing.status === "CANCELLED") {
      throw new Error("Cannot update a cancelled donation.");
    }

    const update: Partial<IDonation> = {};
    if (dto.notes !== undefined) update.notes = dto.notes;
    if (dto.donated_at !== undefined) update.donated_at = dto.donated_at;

    // Status transitions allowed: PROCESSING → FULFILLED only via update
    // PROCESSING → CANCELLED is handled by cancel() with transaction
    if (dto.status === "FULFILLED") {

      update.status = "FULFILLED";
      update.donated_at = dto.donated_at ?? new Date();
    }

    const updated = await Donation.findByIdAndUpdate(
      id,
      { $set: update },
      {
        new: true,
      },
    );

    if (!updated) throw new Error("Donation not found.");
    return updated;
  },

  // ── CANCEL (soft delete) ─────────────────────────────────────────────────

  async cancelDonation(
    id: string,
    // requestorUserId: string,
  ): Promise<IDonation> {
    const session: ClientSession = await mongoose.startSession();
    session.startTransaction();

    try {
      // 1. Fetch the donation (lock via session)
      const donation = await Donation.findById(id).session(session);
      if (!donation) throw new Error("Donation not found.");

      if (donation.status === "CANCELLED") {
        throw new Error("Donation is already cancelled.");
      }

      // Optional ownership check — remove if admins can cancel freely
      // if (donation.donor_user_id.toString() !== requestorUserId) {
      //   throw new Error("You are not authorised to cancel this donation.");
      // }

      const wasActive =
        donation.status === "PROCESSING" || donation.status === "FULFILLED";

      // 2. Soft-delete the donation
      donation.status = "CANCELLED";
      await donation.save({ session });

      // 3. If the donation was active, give back the qty to the blood request
      if (wasActive) {
        const bloodRequest = await BloodRequest.findById(
          donation.blood_request_id,
        ).session(session);

        if (bloodRequest) {
          const restoredQty = Math.max(0, bloodRequest.qty - donation.units);

          // If request was fulfilled but now has capacity again, revert to active
          const wasFullyFulfilled =
            bloodRequest.blood_request_status === "fulfilled";
          const newStatus = wasFullyFulfilled
            ? "active"
            : bloodRequest.blood_request_status;

          await BloodRequest.findByIdAndUpdate(
            bloodRequest._id,
            {
              $set: {
                qty: restoredQty,
                ...(wasFullyFulfilled
                  ? { blood_request_status: newStatus }
                  : {}),
              },
              $inc: { donors_count: -1 },
            },
            { session },
          );
        }
      }

      await session.commitTransaction();
      return donation;
    } catch (err) {
      await session.abortTransaction();
      throw err;
    } finally {
      session.endSession();
    }
  },
};
