import swaggerJsdoc from "swagger-jsdoc";
import config from "./config";

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: config.app_name,
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

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
