"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Auth_routes_1 = require("../modules/Auth/Auth.routes");
const User_routes_1 = require("../modules/User/User.routes");
const Image_routes_1 = require("../modules/Image/Image.routes");
const router = (0, express_1.Router)();
const routes = [
    {
        path: "/auth",
        route: Auth_routes_1.AuthRoutes,
    },
    {
        path: "/user",
        route: User_routes_1.UserRoutes,
    },
    {
        path: "/image",
        route: Image_routes_1.ImageRoutes,
    },
];
routes.forEach((route) => router.use(route.path, route.route));
exports.default = router;
