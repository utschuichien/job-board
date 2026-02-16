// server/src/models/application.model.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IApplication extends Document {
    jobId: mongoose.Types.ObjectId;
    candidateId: mongoose.Types.ObjectId;
    cvUrl: string; // Link CV nộp riêng cho job này
    coverLetter?: string;
    status: 'pending' | 'reviewed' | 'interview' | 'rejected' | 'hired';
    createdAt: Date;
}

const ApplicationSchema: Schema = new Schema(
    {
        jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
        candidateId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

        cvUrl: { type: String, required: true },
        coverLetter: { type: String },

        status: {
            type: String,
            enum: ['pending', 'reviewed', 'interview', 'rejected', 'hired'],
            default: 'pending',
        },
    },
    { timestamps: true },
);

// Ngăn chặn 1 người nộp 2 lần vào 1 job
ApplicationSchema.index({ jobId: 1, candidateId: 1 }, { unique: true });

export default mongoose.model<IApplication>('Application', ApplicationSchema);
