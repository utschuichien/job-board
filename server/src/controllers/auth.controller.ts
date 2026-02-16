import type { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/user.model.js';
import generateToken from '../utils/jwt.js';
import { loginSchema, registerSchema } from '../schemas/auth.schema.js';
import sendEmail from '../utils/sendEmail.js';
import { OAuth2Client } from 'google-auth-library';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';

// @desc    Đăng ký user mới
// @route   POST /api/auth/register
// @access  Public
export const register = async (req: Request, res: Response): Promise<void> => {
    try {
        const validation = registerSchema.safeParse(req.body);
        console.log(validation);

        if (!validation.success) {
            res.status(400).json({
                message: 'Dữ liệu không hợp lệ',
                errors: validation.error.format(),
            });
            return;
        }

        const { name, email, password, role } = validation.data;

        const userExists = await User.findOne({ email });
        if (userExists) {
            res.status(400).json({ message: 'Email này đã được sử dụng' });
            return;
        }

        // 3. Mã hóa mật khẩu
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 4. Tạo User mới vào DB
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role,
        });

        if (user) {
            // 5. Trả về thông tin + Token (Không trả về password!)
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id as any, user.role),
            });
        } else {
            res.status(400).json({ message: 'Không thể tạo tài khoản' });
        }
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi server nội bộ' });
    }
};

// @desc    Đăng nhập & Nhận Token
// @route   POST /api/auth/login
// @access  Public
export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const validation = loginSchema.safeParse(req.body);
        if (!validation.success) {
            res.status(400).json({ errors: validation.error.format() });
            return;
        }
        const { email, password } = validation.data;
        const user = await User.findOne({ email });
        const checkPassword = await bcrypt.compare(password, user?.password || '');
        if (user && checkPassword) {
            // 4. Nếu đúng -> Trả về Token và thông tin
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id as any, user.role),
            });
        } else {
            res.status(401).json({ message: 'Email hoặc mật khẩu không đúng' });
        }
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi server nội bộ' });
    }
};

// @desc    Kiểm tra xem OTP có đúng không (để cho phép chuyển sang bước nhập pass)
// @route   POST /api/auth/verify-otp
export const verifyOtp = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, otp } = req.body;

        // 1. Hash OTP gửi lên
        const hashedOtp = crypto.createHash('sha256').update(otp).digest('hex');

        // 2. Kiểm tra trong DB
        const user = await User.findOne({
            email,
            resetPasswordToken: hashedOtp,
            resetPasswordExpire: { $gt: Date.now() }, // Chưa hết hạn
        });

        if (!user) {
            res.status(400).json({ message: 'Mã OTP không chính xác hoặc đã hết hạn' });
            return;
        }

        res.status(200).json({ success: true, message: 'OTP hợp lệ' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server' });
    }
};

// @desc    Gửi email quên mật khẩu
// @route   POST /api/auth/forgot-password
export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
    try {
        const user = await User.findOne({ email: req.body.email });

        if (!user) {
            res.status(404).json({ message: 'Không tìm thấy email này trong hệ thống' });
            return;
        }

        // 1. Lấy token reset từ Model
        const otp = user.getResetPasswordToken();

        // 2. Lưu token vào DB (nhớ tắt validate vì ta chỉ sửa 2 trường này)
        await user.save({ validateBeforeSave: false });

        const message = `Mã xác thực khôi phục mật khẩu của bạn là: ${otp}\n\nMã này sẽ hết hạn sau 10 phút.`;

        try {
            await sendEmail({
                email: user.email,
                subject: 'Mã OTP đặt lại mật khẩu - JobBoard',
                message,
            });

            res.status(200).json({ success: true, data: 'Email đã được gửi!' });
        } catch (error) {
            // Nếu gửi mail lỗi thì phải xóa token trong DB đi
            user.resetPasswordToken = null;
            user.resetPasswordExpire = null;
            await user.save({ validateBeforeSave: false });

            res.status(500).json({ message: 'Không thể gửi email' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server' });
    }
};

// @desc    Đặt lại mật khẩu mới
// @route   PUT /api/auth/reset-password
export const resetPassword = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, otp, password } = req.body;

        // 1. Hash mã OTP người dùng gửi lên để so sánh với cái trong DB
        const resetPasswordToken = crypto.createHash('sha256').update(otp).digest('hex');

        const user = await User.findOne({
            email: email,
            resetPasswordToken: resetPasswordToken,
            resetPasswordExpire: { $gt: Date.now() },
        });

        if (!user) {
            res.status(400).json({ message: 'Mã OTP không đúng hoặc đã hết hạn' });
            return;
        }

        // 3. Đổi mật khẩu
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        user.password = hashedPassword;
        user.resetPasswordToken = null;
        user.resetPasswordExpire = null;
        await user.save();
        res.status(200).json({ success: true, message: 'Mật khẩu đã được thay đổi!' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server' });
    }
};

// @desc    Lấy thông tin user hiện tại
// @route   GET /api/auth/me
export const getMe = async (req: Request, res: Response): Promise<void> => {
    const user = (req as any).user;
    res.status(200).json({
        user,
    });
};

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const googleLogin = async (req: Request, res: Response) => {
    try {
        const { token } = req.body; // Frontend gửi token sang

        // 1. Xác thực token với Google
        const ticket = await client.verifyIdToken({
            idToken: token as string,
            audience: process.env.GOOGLE_CLIENT_ID as string,
        });

        const payload = ticket.getPayload();
        // payload chứa: { email, name, picture, sub (googleId) ... }

        if (!payload) return res.status(400).json({ message: 'Token không hợp lệ' });

        const { email, name, picture, sub } = payload;

        // 2. Kiểm tra user trong DB
        let user = await User.findOne({ email: email as string });

        if (user) {
            // Case A: Đã có tài khoản
            // Nếu trước đây đăng ký bằng password, giờ update thêm googleId
            if (!user.googleId) {
                user.googleId = sub;
                user.avatar = user.avatar as string  || picture as string; // Nếu chưa có avatar thì lấy của GG
                user.authProvider = 'google';
                await user.save();
            }
        } else {
            // Case B: Chưa có tài khoản -> Tạo mới luôn
            const newUser = new User({
                email,
                name,
                googleId: sub,
                password: '', // Không có pass
                avatar: picture,
                role: 'candidate', // Mặc định là ứng viên
                authType: 'google',
            });
            user = await newUser.save();
        }

        res.status(200).json({
            token: generateToken(user._id as any, user.role),
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                avatar: user.avatar,
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi đăng nhập Google' });
    }
};
