"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const http_status_1 = __importDefault(require("http-status"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const global_error_handler_1 = __importDefault(require("./app/middlewares/global-error-handler"));
const not_found_handler_1 = __importDefault(require("./app/middlewares/not-found-handler"));
const swagger_routes_1 = __importDefault(require("./app/routes/swagger.routes"));
const routes_1 = __importDefault(require("./app/routes"));
const config_1 = __importDefault(require("./config"));
const app = (0, express_1.default)();
// third party middleware configuration
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)({
    origin: ["http://localhost:8083"],
    credentials: true,
}));
// test server
app.get("/", (req, res) => {
    res.status(http_status_1.default.OK).json({
        success: true,
        message: `${config_1.default.app_name} server is working fine`,
    });
});
// main routes
app.use("/api/v1", routes_1.default);
// swagger docs
app.use("/api-docs", swagger_routes_1.default);
// handle error
app.use(global_error_handler_1.default);
app.use(not_found_handler_1.default);
exports.default = app;
