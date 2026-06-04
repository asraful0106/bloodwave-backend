import { Router } from "express";
import { userController } from "./user.controller.js";
import { memoryUpload } from "../../config/multer.js";
import { checkAuth } from "../../middlewares/checkAuth.js";
import { UserRole } from "./user.interface.js";

const router = Router();

// GET /me — any authenticated role
router.get(
  "/me",
  checkAuth(...Object.values(UserRole)),
  userController.getMyAccount,
);

// POST /register — public
router.post("/register", userController.createUser);

// PATCH /:id — authenticated; accepts optional image upload
router.patch(
  "/:id",
  checkAuth(...Object.values(UserRole)),
  memoryUpload.single("image"),
  userController.updateUser,
);

// DELETE /:id — authenticated
router.delete(
  "/:id",
  checkAuth(...Object.values(UserRole)),
  userController.deleteUser,
);

export const userRouter = router;
