import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const sendEmail = async (options: { email: string; subject: string; message: string }) => {
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: Number(process.env.EMAIL_PORT),
        secure: false,
        auth: {
            user: process.env.EMAIL_NAME,
            pass: process.env.EMAIL_PASSWORD,
        },
    });

    // 2. Định nghĩa nội dung thư
    const message = {
        from: `${process.env.FROM_NAME} <${process.env.EMAIL_NAME}>`,
        to: options.email,
        subject: options.subject,
        text: options.message, // Gửi dạng text thường
        // html: options.message // Nếu muốn gửi HTML đẹp thì dùng dòng này
    };

    // 3. Gửi thư
    await transporter.sendMail(message);
};

export default sendEmail;
