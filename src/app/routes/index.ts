import { Router } from "express";
import { authRouter } from "../modules/auth/auth.route";
import { userRouter } from "../modules/user/user.routes";
import { bloodReqRouter } from "../modules/bloodReq/bloodReq.routes";

const router = Router();

interface IRouter {
  path: string;
  route: Router;
}

const moduleRoutes: IRouter[] = [
  // For user
  {
    path: "/user",
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
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
