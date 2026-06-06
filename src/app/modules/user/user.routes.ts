import { Router } from "express";
import { userController } from "./user.controller.js";
import { memoryUpload } from "../../config/multer.js";
// import { checkAuth } from "../../middlewares/checkAuth.js";
// import { UserRole } from "./user.interface.js";

const router = Router();
// const allRoles = checkAuth(...Object.values(UserRole));

// ─── ACCOUNT ──────────────────────────────────────────────
// GET    /users/me
router.get("/me", userController.getMyAccount);

// POST   /users/register
router.post("/register", userController.createUser);

// PATCH  /users/:id              — scalar fields + optional image
router.patch(
  "/:id",
  memoryUpload.single("image"),
  userController.updateUser,
);

// DELETE /users/:id
router.delete("/:id", userController.deleteUser);

// ─── DONOR PROFILE ────────────────────────────────────────
// PATCH  /users/:id/donor-profile
router.patch("/:id/donor-profile", userController.updateDonorProfile);

// ─── DONOR PRIVACY SETTINGS ───────────────────────────────
// PATCH  /users/:id/donor-privacy
router.patch(
  "/:id/donor-privacy",
  userController.updateDonorPrivacySettings,
);

// ─── LOCATIONS ────────────────────────────────────────────
// POST   /users/:id/locations
router.post("/:id/locations", userController.addUserLocation);

// PATCH  /users/:id/locations/:locationId
router.patch(
  "/:id/locations/:locationId",
  userController.updateUserLocation,
);

// DELETE /users/:id/locations/:locationId
router.delete(
  "/:id/locations/:locationId",
  userController.deleteUserLocation,
);

// ─── CONTACTS ─────────────────────────────────────────────
// POST   /users/:id/contacts
router.post("/:id/contacts", userController.addUserContact);

// PATCH  /users/:id/contacts/:contactId
router.patch(
  "/:id/contacts/:contactId",
  userController.updateUserContact,
);

// DELETE /users/:id/contacts/:contactId
router.delete(
  "/:id/contacts/:contactId",
  userController.deleteUserContact,
);

export const userRouter = router;
