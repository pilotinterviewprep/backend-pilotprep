"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_1 = __importDefault(require("../../swagger"));
const router = express_1.default.Router();
router.use("/", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_1.default));
const swaggerRoutes = router;
exports.default = swaggerRoutes;
