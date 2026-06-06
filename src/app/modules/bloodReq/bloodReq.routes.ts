import { Router } from "express";
import * as BloodRequestController from "./bloodReq.controller";

const router = Router();

// POST   /blood-requests          → create a new blood request
router.post("/", BloodRequestController.createBloodRequest);

// GET    /blood-requests          → list all blood requests (no pagination)
router.get("/", BloodRequestController.getAllBloodRequests);

// GET    /blood-requests/:id      → get a single blood request with requester info
router.get("/:id", BloodRequestController.getBloodRequestById);

// PATCH  /blood-requests/:id      → partial update
router.patch("/:id", BloodRequestController.updateBloodRequest);

// DELETE /blood-requests/:id      → hard delete
router.delete("/:id", BloodRequestController.deleteBloodRequest);

export const bloodReqRouter = router;
