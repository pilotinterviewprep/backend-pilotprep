"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const config_1 = __importDefault(require("./config"));
const swaggerDefinition = {
    openapi: "3.0.0",
    info: {
        title: config_1.default.app_name,
        version: "1.0.0",
        description: "Documentation for all endpoints in the application",
    },
    servers: [
        {
            url: "http://localhost:5001",
            description: "Local server",
        },
    ],
    components: {
        securitySchemes: {
            AdminAuth: {
                type: "apiKey",
                in: "header",
                name: "Authorization",
            },
            UserAuth: {
                type: "apiKey",
                in: "header",
                name: "Authorization",
            },
            RetailerAuth: {
                type: "apiKey",
                in: "header",
                name: "Authorization",
            },
        },
    },
};
const options = {
    swaggerDefinition,
    apis: ["./src/app/**/*.swagger.ts"],
};
const swaggerSpec = (0, swagger_jsdoc_1.default)(options);
exports.default = swaggerSpec;
