import { Router } from "express";
import * as BloodRequestController from "./bloodReq.controller";

const router = Router();

// POST   /blood-req          → create a new blood request
router.post("/", BloodRequestController.createBloodRequest);

// GET    /blood-req          → list all blood requests (no pagination)
router.get("/", BloodRequestController.getAllBloodRequests);

// GET    /blood-req/user/:id      → get all blood request with requester info
router.get("/user/:id", BloodRequestController.getAllBloodRequestsByUserId);

// GET    /blood-req/:id      → get a single blood request with requester info
router.get("/:id", BloodRequestController.getBloodRequestById);

// PATCH  /blood-req/:id      → partial update
router.patch("/:id", BloodRequestController.updateBloodRequest);

// DELETE /blood-req/:id      → hard delete
router.delete("/:id", BloodRequestController.deleteBloodRequest);

export const bloodReqRouter = router;
