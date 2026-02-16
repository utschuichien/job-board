// server/src/models/job.model.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IJob extends Document {
    title: string;
    employerId: mongoose.Types.ObjectId; // Link tới User (Employer)
    description: string; // HTML string (từ Rich Text Editor)
    requirements: string[];

    // Các field dùng để lọc (Filter)
    salary: {
        from: number;
        to: number;
        negotiable: boolean; // Lương thỏa thuận
        currency: 'VND' | 'USD';
    };
    location: string; // Hà Nội, TP.HCM...
    jobType: 'Remote' | 'On-site' | 'Hybrid';
    level: 'Intern' | 'Junior' | 'Middle' | 'Senior' | 'Lead';

    isActive: boolean; // Ẩn/Hiện bài đăng
    deadline: Date;
    createdAt: Date;
}

const JobSchema: Schema = new Schema(
    {
        title: { type: String, required: true, index: true }, // Index để tìm kiếm nhanh
        employerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        description: { type: String, required: true },
        requirements: [String],

        salary: {
            from: { type: Number, default: 0 },
            to: { type: Number, default: 0 },
            negotiable: { type: Boolean, default: false },
            currency: { type: String, enum: ['VND', 'USD'], default: 'VND' },
        },

        location: { type: String, required: true, index: true },
        jobType: { type: String, enum: ['Remote', 'On-site', 'Hybrid', 'Full-time'], required: true },
        level: {
            type: String,
            enum: ['Intern', 'Junior', 'Middle', 'Senior', 'Lead'],
            required: true,
        },

        isActive: { type: Boolean, default: true },
        deadline: { type: Date, required: true },
    },
    { timestamps: true },
);

// Tạo Index toàn văn (Text Search) cho title để user gõ tìm kiếm
JobSchema.index({ title: 'text', location: 'text' });

export default mongoose.model<IJob>('Job', JobSchema);
