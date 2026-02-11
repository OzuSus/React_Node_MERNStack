import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || "587"),
    secure: false,
    auth: {
        user: process.env.SMTP_USERNAME,
        pass: process.env.SMTP_PASSWORD
    }
});

export async function sendVerificationEmail(toEmail, token) {
    const frontend = process.env.FRONTEND_VERIFY_URL;
    const backend = process.env.BACKEND_VERIFY_URL;
    const verifyUrlFrontend = frontend ? `${frontend}?token=${token}` : "";
    const verifyUrlBackend = backend ? `${backend}?token=${token}` : "";

    const html = `
       <p>Xin chào,</p>
       <p>Vui lòng nhấn vào liên kết dưới đây để xác thực email của bạn:</p>
       ${verifyUrlFrontend ? `<p><a href="${verifyUrlFrontend}">${verifyUrlFrontend}</a></p>` : ""}
       ${verifyUrlBackend ? `<p>Nếu bạn muốn xác thực trực tiếp bằng API: <a href="${verifyUrlBackend}">${verifyUrlBackend}</a></p>` : ""}
       <p>Link sẽ hết hạn sau 24 giờ.</p>
    `;

    const mailOptions = {
        from: `"TMDT" <${process.env.SMTP_USER}>`,
        to: toEmail,
        subject: "Xác thực tài khoản TMDT",
        html
    };

    return transporter.sendMail(mailOptions);
}