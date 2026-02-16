import {type Request, type Response } from 'express';
import User from '../models/user.model.js';
import Job from '../models/job.model.js';
import Application from '../models/application.model.js';

// @desc    Lấy số liệu thống kê tổng quan
// @route   GET /api/admin/stats
export const getStats = async (req: Request, res: Response) => {
    try {
        const totalUsers = await User.countDocuments({ role: { $ne: 'admin' } }); // Không đếm admin
        const totalJobs = await Job.countDocuments();
        const totalApplications = await Application.countDocuments();

        res.json({ totalUsers, totalJobs, totalApplications });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server' });
    }
};

// @desc    Lấy danh sách tất cả Users
// @route   GET /api/admin/users
export const getAllUsers = async (req: Request, res: Response) => {
     const page = Number(req.query.page) || 1;
     const limit = Number(req.query.limit) || 10;
     const skip = (page - 1) * limit;

    try {
        const users = await User.find({ role: { $ne: 'admin' } })
            .select('-password')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);
        const totalUsers = await User.countDocuments({ role: { $ne: 'admin' } });
        const totalPages = Math.ceil(totalUsers / limit);
        res.json({users, pagination: { page, limit, totalPages } });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server' });
    }
};

// @desc    Xóa User (Admin quyền lực nhất)
// @route   DELETE /api/admin/users/:id
export const deleteUser = async (req: Request, res: Response) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        // TODO: Nên xóa cả Job và Application liên quan đến User này (Cascade Delete) - Để sau làm
        res.json({ message: 'Đã xóa người dùng' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server' });
    }
};

// @desc    Lấy danh sách tất cả Jobs
// @route   GET /api/admin/jobs
export const getAllJobs = async (req: Request, res: Response) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    try {
        const jobs = await Job.find().populate('employerId', 'name email').sort({ createdAt: -1 }).skip(skip).limit(limit);
        const totalJobs = await Job.countDocuments();
        const totalPages = Math.ceil(totalJobs / limit);
        res.json({jobs, pagination: { page, limit, totalPages } });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server' });
    }
};

// @desc    Xóa Job
// @route   DELETE /api/admin/jobs/:id
export const deleteJobAny = async (req: Request, res: Response) => {
    try {
        await Job.findByIdAndDelete(req.params.id);
        res.json({ message: 'Đã xóa công việc' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server' });
    }
};
