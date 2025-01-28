"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config({ path: path_1.default.join(process.cwd(), ".env") });
exports.default = {
    node_env: process.env.NODE_ENV,
    app_name: process.env.APP_NAME,
    port: process.env.PORT,
    super_admin_name: process.env.SUPER_ADMIN_NAME,
    super_admin_email: process.env.SUPER_ADMIN_EMAIL,
    super_admin_contact_number: process.env.SUPER_ADMIN_CONTACT_NUMBER,
    super_admin_password: process.env.SUPER_ADMIN_PASSWORD,
    salt_rounds: process.env.SALT_ROUNDS,
    jwt_access_secret: process.env.JWT_ACCESS_SECRET,
    jwt_access_expiresin: process.env.JWT_ACCESS_EXPIRESIN,
    jwt_refresh_secret: process.env.JWT_REFRESH_SECRET,
    jwt_refresh_expiresin: process.env.JWT_REFRESH_EXPIRESIN,
    twilio_sid: process.env.TWILIO_SID,
    twilio_auth_token: process.env.TWILIO_AUTH_TOKEN,
    twilio_phone_number: process.env.TWILIO_PHONE_NUMBER,
    app_email_address: process.env.APP_EMAIL_ADDRESS,
    email_app_pass: process.env.EMAIL_APP_PASS,
    supabase_bucket_url: process.env.SUPABASE_BUCKET_URL,
    supabase_bucket_key: process.env.SUPABASE_BUCKET_KEY,
    user_bucket: process.env.USER_BUCKET,
    general_bucket: process.env.GENERAL_BUCKET,
};
