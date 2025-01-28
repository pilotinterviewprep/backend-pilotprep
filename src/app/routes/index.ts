import { Router } from "express";
import { AuthRoutes } from "../modules/Auth/Auth.routes";
import { UserRoutes } from "../modules/User/User.routes";
import { ImageRoutes } from "../modules/Image/Image.routes";

const router = Router();

const routes = [
  {
    path: "/auth",
    route: AuthRoutes,
  },
  {
    path: "/user",
    route: UserRoutes,
  },
  {
    path: "/image",
    route: ImageRoutes,
  },
];

routes.forEach((route) => router.use(route.path, route.route));

export default router;
