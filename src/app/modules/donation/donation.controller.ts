import type { Request, Response, NextFunction } from "express";
import { DonationService } from "./donation.service";
import AppError from "../../errorHelper/AppError";
import { User } from "../user/user.model";
import { UserRole } from "../user/user.interface";

// Helper — keeps controllers thin
const ok = (res: Response, data: unknown, status = 200) =>
  res.status(status).json({ success: true, data });

const fail = (res: Response, err: unknown, status = 400) => {
  const message = err instanceof Error ? err.message : "Something went wrong.";
  return res.status(status).json({ success: false, message });
};

export const DonationController = {
  // ── POST /donations ───────────────────────────────────────────────────────
  async create(req: Request, res: Response, _next: NextFunction) {
    try {
      const donor_user_id = req.get("userId");;
      if (!donor_user_id) return fail(res, new Error("Unauthenticated."), 401);

      const { blood_request_id, units, notes } = req.body;

      if (!blood_request_id)
        return fail(res, new Error("blood_request_id is required."));
      if (!units || typeof units !== "number" || units < 1) {
        return fail(res, new Error("units must be a positive integer."));
      }

      const donation = await DonationService.createDonation({
        blood_request_id,
        donor_user_id,
        units,
        notes,
      });

      return ok(res, donation, 201);
    } catch (err) {
      return fail(res, err);
    }
  },

  // ── GET /donations ────────────────────────────────────────────────────────
  async list(req: Request, res: Response, _next: NextFunction) {
    try {
      const userId = req.get("userId");
      if (!userId) throw new AppError(400, "user requird");
      // console.log("UserId: ",userId);

      const user = await User.findById(userId);
      if (!user) throw new AppError(400, "User not found!");
      // console.log("User", user);

      // Non-admin donors only see their own donations
      const donor_user_id =
        user?.role === UserRole.ADMIN
          ? (req.query.donor_user_id as string | undefined)
          : user?._id?.toString();

      const result = await DonationService.listDonations({
        donor_user_id,
        blood_request_id: req.query.blood_request_id as string | undefined,
        status: req.query.status as string | undefined,
        page: req.query.page ? Number(req.query.page) : 1,
        limit: req.query.limit ? Number(req.query.limit) : 20,
      });

      return ok(res, result);
    } catch (err) {
      return fail(res, err);
    }
  },

  // ── GET /donations/:id ────────────────────────────────────────────────────
  async getOne(req: Request, res: Response, _next: NextFunction) {
    try {
      const donation = await DonationService.getDonationById(
        req.params.id as string,
      );
      return ok(res, donation);
    } catch (err) {
      return fail(res, err, 404);
    }
  },

  // ── PATCH /donations/:id ──────────────────────────────────────────────────
  async update(req: Request, res: Response, _next: NextFunction) {
    try {
      const { notes, status, donated_at } = req.body;
      const donation = await DonationService.updateDonation(
        req.params.id as string,
        {
          notes,
          status,
          donated_at: donated_at ? new Date(donated_at) : undefined,
        },
      );
      return ok(res, donation);
    } catch (err) {
      return fail(res, err);
    }
  },

  // ── DELETE /donations/:id ─────────────────────────────────────────────────
  async cancel(req: Request, res: Response, _next: NextFunction) {
    try {
      const requestorUserId = (req as any).user?._id?.toString();
      if (!requestorUserId)
        return fail(res, new Error("Unauthenticated."), 401);

      const donation = await DonationService.cancelDonation(
        req.params.id as string,
        requestorUserId,
      );
      return ok(res, donation);
    } catch (err) {
      // 403 for auth errors, 400 for business rule errors
      const message = err instanceof Error ? err.message : "";
      const status = message.includes("authorised") ? 403 : 400;
      return fail(res, err, status);
    }
  },
};
