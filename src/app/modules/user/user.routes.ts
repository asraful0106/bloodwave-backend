import { Router } from "express";
import { userController } from "./user.controller.js";
import { memoryUpload } from "../../config/multer.js";
import { checkAuth } from "../../middlewares/checkAuth.js";
import { UserRole } from "./user.interface.js";

const router = Router();
const allRoles = checkAuth(...Object.values(UserRole));

// ─── ACCOUNT ──────────────────────────────────────────────
// GET    /users/me
router.get("/me", allRoles, userController.getMyAccount);

// POST   /users/register
router.post("/register", userController.createUser);

// PATCH  /users/:id              — scalar fields + optional image
router.patch(
  "/:id",
  allRoles,
  memoryUpload.single("image"),
  userController.updateUser,
);

// DELETE /users/:id
router.delete("/:id", allRoles, userController.deleteUser);

// ─── DONOR PROFILE ────────────────────────────────────────
// PATCH  /users/:id/donor-profile
router.patch("/:id/donor-profile", allRoles, userController.updateDonorProfile);

// ─── DONOR PRIVACY SETTINGS ───────────────────────────────
// PATCH  /users/:id/donor-privacy
router.patch(
  "/:id/donor-privacy",
  allRoles,
  userController.updateDonorPrivacySettings,
);

// ─── LOCATIONS ────────────────────────────────────────────
// POST   /users/:id/locations
router.post("/:id/locations", allRoles, userController.addUserLocation);

// PATCH  /users/:id/locations/:locationId
router.patch(
  "/:id/locations/:locationId",
  allRoles,
  userController.updateUserLocation,
);

// DELETE /users/:id/locations/:locationId
router.delete(
  "/:id/locations/:locationId",
  allRoles,
  userController.deleteUserLocation,
);

// ─── CONTACTS ─────────────────────────────────────────────
// POST   /users/:id/contacts
router.post("/:id/contacts", allRoles, userController.addUserContact);

// PATCH  /users/:id/contacts/:contactId
router.patch(
  "/:id/contacts/:contactId",
  allRoles,
  userController.updateUserContact,
);

// DELETE /users/:id/contacts/:contactId
router.delete(
  "/:id/contacts/:contactId",
  allRoles,
  userController.deleteUserContact,
);

export const userRouter = router;
