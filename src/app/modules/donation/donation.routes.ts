import { Router } from "express";
import { DonationController } from "./donation.controller";

const router = Router();

// POST   /donations              → create a donation
// GET    /donations              → list donations (donor sees own; admin sees all)
// GET    /donations/:id          → get single donation
// PATCH  /donations/:id          → update notes / status (admin or donor)
// DELETE /donations/:id          → soft-delete (cancel)

router.post("/", DonationController.create);
router.get("/", DonationController.list);
router.get("/:id", DonationController.getOne);
router.patch("/:id", DonationController.update);
router.delete("/:id", DonationController.cancel);

export const donationRouter = router;
