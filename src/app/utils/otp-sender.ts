import config from "../../config";

const accountSid = config.twilio_sid;
const authToken = config.twilio_auth_token;
const client = require("twilio")(accountSid, authToken);

export const OTPGenerator = () => {
  return Math.floor(100000 + Math.random() * 900000);
};

async function OTPSender(contactNumber: string, body: string) {
  try {
    const message = await client.messages.create({
      body: body,
      from: config.twilio_phone_number,
      to: `+88${contactNumber}`,
    });
    return {
      success: true,
      message: `OTP sent successfully: ${message.sid}`,
    };
  } catch (error) {
    return {
      success: false,
      message: `Failed to send OTP: ${error}`,
    };
  }
}

export const verifyOTP = async (
  userInputOtp: number,
  storedOtp: number,
  expirationTime: number
) => {
  const currentTime = new Date().getTime();

  if (currentTime > expirationTime) {
    return { success: false, message: "OTP has expired" };
  }

  if (userInputOtp === storedOtp) {
    return { success: true, message: "OTP verified successfully" };
  } else {
    return { success: false, message: "Invalid OTP" };
  }
};

export default OTPSender;
