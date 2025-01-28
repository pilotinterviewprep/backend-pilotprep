import { Server } from "http";
import app from "./app";
import config from "./config";
import cron from "node-cron";
import { seedSuperAdmin } from "./app/db";
import oldOTPCleaner from "./app/utils/old-otp-cleaner";

const port = config.port || 9000;

let server: Server;

async function main() {
  try {
    await seedSuperAdmin();
    server = app.listen(port, () => {
      console.log(`${config.app_name} server is running on port ${port}`);
    });

    // cron schedule to clear OTP
    cron.schedule("0 0 * * *", () => {
      oldOTPCleaner();
    });
  } catch (error) {
    console.log(error);
  }
}

// handle unhandledRejection
process.on("unhandledRejection", () => {
  console.log("Unhandled rejection is detected. shutting down...");
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});

// handle uncaught expception
process.on("uncaughtException", () => {
  console.log("Uncaught exception is detected. shutting down...");
  process.exit(1);
});

main();
