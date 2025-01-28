"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyOTP = exports.OTPGenerator = void 0;
const config_1 = __importDefault(require("../../config"));
const accountSid = config_1.default.twilio_sid;
const authToken = config_1.default.twilio_auth_token;
const client = require("twilio")(accountSid, authToken);
const OTPGenerator = () => {
    return Math.floor(100000 + Math.random() * 900000);
};
exports.OTPGenerator = OTPGenerator;
function OTPSender(contactNumber, body) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const message = yield client.messages.create({
                body: body,
                from: config_1.default.twilio_phone_number,
                to: `+88${contactNumber}`,
            });
            return {
                success: true,
                message: `OTP sent successfully: ${message.sid}`,
            };
        }
        catch (error) {
            return {
                success: false,
                message: `Failed to send OTP: ${error}`,
            };
        }
    });
}
const verifyOTP = (userInputOtp, storedOtp, expirationTime) => __awaiter(void 0, void 0, void 0, function* () {
    const currentTime = new Date().getTime();
    if (currentTime > expirationTime) {
        return { success: false, message: "OTP has expired" };
    }
    if (userInputOtp === storedOtp) {
        return { success: true, message: "OTP verified successfully" };
    }
    else {
        return { success: false, message: "Invalid OTP" };
    }
});
exports.verifyOTP = verifyOTP;
exports.default = OTPSender;
