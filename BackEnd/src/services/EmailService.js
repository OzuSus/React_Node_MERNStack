import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST, port: parseInt(process.env.SMTP_PORT || "587"), secure: false, auth: {
        user: process.env.SMTP_USERNAME, pass: process.env.SMTP_PASSWORD
    }
});
export async function sendVerificationEmail(toEmail, username, token) {
    const frontend = process.env.FRONTEND_VERIFY_URL;
    const backend = process.env.BACKEND_VERIFY_URL;

    // Prefer frontend link; include token and username
    const verifyUrl = frontend
        ? `${frontend}?token=${encodeURIComponent(token)}&username=${encodeURIComponent(username)}`
        : `${backend}?token=${encodeURIComponent(token)}&username=${encodeURIComponent(username)}`;

    const html = `
    <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee; max-width: 600px; margin: auto; background: #ffffff;">
      <div style="text-align: center;">
        <img src="https://res.cloudinary.com/duztah40b/image/upload/v1745154145/logo_p2qp8w.jpg" alt="Logo" style="height: 100px;" />
        <h2 style="color: #333;">Xác thực tài khoản</h2>
        <p style="color: #555;">Xin chào <strong>${username}</strong>,</p>
        <p style="color: #555;">Cảm ơn bạn đã đăng ký. Vui lòng nhấn nút bên dưới để xác thực tài khoản.</p>
        <a href="${verifyUrl}" style="display: inline-block; padding: 12px 24px; background-color: #007BFF; color: white; text-decoration: none; border-radius: 5px; margin-top: 20px;">
          Xác thực ngay
        </a>
        <p style="color: #aaa; margin-top: 30px; font-size: 12px;">Nếu bạn không yêu cầu đăng ký, hãy bỏ qua email này.</p>
      </div>
    </div>
  `;

    const mailOptions = {
        from: `"TMDT" <${process.env.SMTP_USERNAME}>`,
        to: toEmail,
        subject: "Xác thực tài khoản của bạn",
        html
    };

    return transporter.sendMail(mailOptions);
}