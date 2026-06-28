import type { Request, Response, NextFunction } from "express";
import * as BloodRequestService from "./bloodReq.service";

// ─── Create ──────────────────────────────────────────────────────────────────

export const createBloodRequest = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const request = await BloodRequestService.createBloodRequest(req.body);

    res.status(201).json({
      success: true,
      message: "Blood request created successfully.",
      data: request,
    });
  } catch (error) {
    next(error);
  }
};

// ─── Get one ─────────────────────────────────────────────────────────────────

export const getBloodRequestById = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const request = await BloodRequestService.getBloodRequestById(
      req.params.id as string,
    );

    if (!request) {
      res.status(404).json({
        success: false,
        message: "Blood request not found.",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: request,
    });
  } catch (error) {
    next(error);
  }
};

// ─── Get all ─────────────────────────────────────────────────────────────────

export const getAllBloodRequests = async (
  _req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const requests = await BloodRequestService.getAllBloodRequests();

    res.status(200).json({
      success: true,
      total: requests.length,
      data: requests,
    });
  } catch (error) {
    next(error);
  }
};
// ─── Get all blood req by user_id ─────────────────────────────────────────────────────────────────

export const getAllBloodRequestsByUserId = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const request = await BloodRequestService.getAllBloodReqByUserId(
      req.params.id as string,
    );

    if (!request) {
      res.status(404).json({
        success: false,
        message: "Blood request not found.",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: request,
    });
  } catch (error) {
    next(error);
  }
};

// ─── Update ───────────────────────────────────────────────────────────────────

export const updateBloodRequest = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const updated = await BloodRequestService.updateBloodRequest(
      req.params.id as string,
      req.body,
    );

    if (!updated) {
      res.status(404).json({
        success: false,
        message: "Blood request not found.",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Blood request updated successfully.",
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

// ─── Delete ───────────────────────────────────────────────────────────────────

export const deleteBloodRequest = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const deleted = await BloodRequestService.deleteBloodRequest(req.params.id as string);

    if (!deleted) {
      res.status(404).json({
        success: false,
        message: "Blood request not found.",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Blood request deleted successfully.",
    });
  } catch (error) {
    next(error);
  }
};
