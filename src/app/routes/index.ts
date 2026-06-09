import { Router } from "express";
import { authRouter } from "../modules/auth/auth.route";
import { userRouter } from "../modules/user/user.routes";
import { bloodReqRouter } from "../modules/bloodReq/bloodReq.routes";
import { imageRouter } from "../modules/image/image.routes";
import { donationRouter } from "../modules/donation/donation.routes";

const router = Router();

interface IRouter {
  path: string;
  route: Router;
}

const moduleRoutes: IRouter[] = [
  // For user
  {
    path: "/users",
    route: userRouter,
  },
  // For Authentication
  {
    path: "/auth",
    route: authRouter,
  },
  // For Blood Req
  {
    path: "/blood-req",
    route: bloodReqRouter,
  },
  // Donation
  {
    path: "/donations",
    route: donationRouter,
  },
  // Image Route
  {
    path: "/image",
    route: imageRouter,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
