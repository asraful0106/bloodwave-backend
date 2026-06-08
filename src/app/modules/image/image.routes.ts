import { Router } from "express";
import { imageController } from "./image.controller.js";

const router = Router();

// ✅ modern wildcard syntax
router.get("/:path", imageController.getImage);
router.get("/uploads/:path", imageController.getImage);

export const imageRouter = router;
