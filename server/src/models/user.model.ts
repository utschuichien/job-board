import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

// 1. TypeScript Interface (Dùng để code logic)
export interface IUser extends Document {
    name: string;
    email: string;
    password?: string; // Có thể null nếu login bằng Google
    googleId?: string; // Nếu đăng nhập bằng Google sẽ có trường này
    authProvider: 'local' | 'google';
    role: 'candidate' | 'employer' | 'admin';
    avatar?: string;

    // Thông tin riêng cho Candidate
    candidateProfile?: {
        bio?: string;
        skills: string[]; // ['React', 'NodeJS']
        resumeUrl?: string; // Link CV PDF
        experience: number; // Số năm kinh nghiệm
    };

    // Thông tin riêng cho Employer
    companyProfile?: {
        companyName: string;
        website?: string;
        location?: string;
        logoUrl?: string;
        description?: string;
    };
    resetPasswordToken?: string | null;
    resetPasswordExpire?: Date | null;
    getResetPasswordToken: () => string;
    savedJobs: mongoose.Types.Array<string>; // Mảng lưu các Job ID đã lưu

    createdAt: Date;
}

// 2. Mongoose Schema (Dùng để lưu DB)
const UserSchema: Schema = new Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true }, // Unique để không trùng email
        password: { type: String, required: false },
        googleId: { type: String, required: false },
        authProvider: { type: String, enum: ['local', 'google'], default: 'local' },
        role: {
            type: String,
            enum: ['candidate', 'employer', 'admin'],
            default: 'candidate',
        },
        avatar: { type: String, default: "" },

        // Nhúng (Embedded) thông tin Profile vào đây cho gọn
        candidateProfile: {
            bio: String,
            skills: [String],
            resumeUrl: String,
            experience: { type: Number, default: 0 },
        },

        companyProfile: {
            companyName: String,
            website: String,
            location: String,
            logoUrl: String,
            description: String,
        },
        savedJobs: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Job',
            },
        ],
        resetPasswordToken: String,
        resetPasswordExpire: Date ,
    },

    { timestamps: true },
);
UserSchema.methods.getResetPasswordToken = function () {
    // 1. Tạo mã OTP 6 số ngẫu nhiên
    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // VD: "582910"

    // 2. Vẫn Hash nó lại trước khi lưu vào DB (để bảo mật, hacker xem DB cũng ko biết mã là gì)
    this.resetPasswordToken = crypto.createHash('sha256').update(otp).digest('hex');

    // 3. Hạn sử dụng 10 phút
    this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

    return otp; // Trả về mã gốc (chưa hash) để gửi qua email
};

export default mongoose.model<IUser>('User', UserSchema);
