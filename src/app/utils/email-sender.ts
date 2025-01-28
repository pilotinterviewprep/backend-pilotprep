import nodemailer from "nodemailer";
import config from "../../config";

const emailSender = async (receiverEmail: string, html: string) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // Use `true` for port 465, `false` for all other ports
    auth: {
      user: config.app_email_address,
      pass: config.email_app_pass,
    },
  });

  const info = await transporter.sendMail({
    from: `"${config.app_name}" <${config.app_email_address}>`,
    to: receiverEmail,
    subject: `${config.app_name} - New Password`,
    html,
  });
  return info;
};

export default emailSender;
