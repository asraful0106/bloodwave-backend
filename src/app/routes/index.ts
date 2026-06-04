import { Router } from "express";
import { authRouter } from "../modules/auth/auth.route";

const router = Router();

interface IRouter {
  path: string;
  route: Router;
}

const moduleRoutes: IRouter[] = [
  // For user
  // {
  //   path: "/user",
  //   route: userRouter,
  // },
  {
    path: "/auth",
    route: authRouter,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
