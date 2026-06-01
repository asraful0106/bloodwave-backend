import { Router } from "express";
// import { userRouter } from "../modules/user/user.route.js";
// import { authRouter } from "../modules/auth/auth.route.js";

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
  // {
  //   path: "/auth",
  //   route: authRouter,
  // },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
