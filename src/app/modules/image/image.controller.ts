import type { Request, Response } from "express";
import { imageService } from "./image.service.js";
import AppError from "../../errorHelper/AppError.js";
import { StatusCodes } from "http-status-codes";

export const imageController = {
  async getImage(req: Request, res: Response) {
    try {
      let filename = req.params.path;

      if (!filename) {
        throw new AppError(StatusCodes.NOT_FOUND, "File Name is required!");
      }

      if (Array.isArray(filename)) {
        filename = filename.join("/");
      }

      // Remove optional "uploads/"
      if (filename.startsWith("uploads/")) {
        filename = filename.replace(/^uploads\//, "");
      }

      await imageService.streamImage(req, res, filename);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  },
};
