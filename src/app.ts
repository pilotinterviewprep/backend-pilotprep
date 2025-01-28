import express, { Application, Request, Response } from "express";
import cors from "cors";
import httpStatus from "http-status";
import cookiePerser from "cookie-parser";
import globalErrorHandler from "./app/middlewares/global-error-handler";
import notFoundHandler from "./app/middlewares/not-found-handler";
import swaggerRoutes from "./app/routes/swagger.routes";
import router from "./app/routes";
import config from "./config";

const app: Application = express();

// third party middleware configuration
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookiePerser());
app.use(cors({
  origin: ["http://localhost:8083", "https://frontend-pilotprep.vercel.app"], 
  credentials: true
}));


// test server
app.get("/", (req: Request, res: Response) => {
  res.status(httpStatus.OK).json({
    success: true,
    message: `${config.app_name} server is working fine`,
  });
});

// main routes
app.use("/api/v1", router);

// swagger docs
app.use("/api-docs", swaggerRoutes);

// handle error
app.use(globalErrorHandler);
app.use(notFoundHandler);

export default app;
