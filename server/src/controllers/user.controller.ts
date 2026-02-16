import { type Request, type Response } from 'express';
import Application from '../models/application.model.js';
import User from '../models/user.model.js';

export const getMyApplications = async (req: any, res: Response) => {
    try {
        const apps = await Application.find({ candidateId: req.user._id })
            .populate({
                path: 'jobId',
                select: 'title employerId',
                populate: { path: 'employerId', select: 'companyProfile name' }, // Populate lồng nhau để lấy tên cty
            })
            .sort({ createdAt: -1 });
        res.json(apps);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server' });
    }
};

// @desc    Lưu hoặc Bỏ lưu công việc (Toggle)
// @route   POST /api/users/saved-jobs/:id
// @access  Private (Candidate)
export const toggleSaveJob = async (req: any, res: Response): Promise<void> => {
  try {
    const jobId = req.params.id;
    const userId = req.user._id;

    const user = await User.findById(userId);
    if (!user) {
        res.status(404).json({ message: 'User not found' });
        return;
    }

    // Kiểm tra xem đã lưu chưa
    const isSaved = user.savedJobs.includes(jobId);

    if (isSaved) {
      // Nếu có rồi thì xóa đi ($pull)
      await User.findByIdAndUpdate(userId, { $pull: { savedJobs: jobId } });
      res.json({ message: 'Đã bỏ lưu', isSaved: false, jobId });
    } else {
      // Nếu chưa có thì thêm vào ($addToSet đảm bảo không trùng)
      await User.findByIdAndUpdate(userId, { $addToSet: { savedJobs: jobId } });
      res.json({ message: 'Đã lưu công việc', isSaved: true, jobId });
    }
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server' });
  }
};

// @desc    Lấy danh sách công việc đã lưu
// @route   GET /api/users/saved-jobs
// @access  Private (Candidate)
export const getSavedJobs = async (req: any, res: Response) => {
  try {
    const user = await User.findById(req.user._id)
      .populate({
        path: 'savedJobs',
        populate: { path: 'employerId', select: 'name companyProfile' } // Populate lồng nhau để lấy thông tin cty
      });
      
    res.json(user?.savedJobs || []);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server' });
  }
};


// @desc    Lấy thông tin công khai của công ty (Cho Candidate xem)
// @route   GET /api/users/companies/:id
// @access  Public
export const getCompanyProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    // Chỉ lấy các trường cần thiết, loại bỏ thông tin nhạy cảm
    const user = await User.findById(req.params.id)
      .select('name email companyProfile role');

    if (!user || user.role !== 'employer') {
      res.status(404).json({ message: 'Không tìm thấy nhà tuyển dụng' });
      return;
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server' });
  }
};

// @desc    Cập nhật thông tin cá nhân
// @route   PUT /api/users/profile
// @access  Private
export const updateProfile = async (req: any, res: Response) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      res.status(404).json({ message: 'User không tồn tại' });
      return;
    }

    // 1. Cập nhật thông tin chung
    user.name = req.body.name || user.name;
    
    // Nếu có upload file ảnh mới thì cập nhật Avatar
    if (req.file) {
      user.avatar = req.file.path;
    }

    // 2. Cập nhật thông tin riêng theo Role
    if (user.role === 'candidate') {
        user.candidateProfile = {
            ...user.candidateProfile, // Giữ cái cũ
            skills: req.body.skills ? req.body.skills.split(',') : user.candidateProfile?.skills,
            bio: req.body.bio || user.candidateProfile?.bio,
            experience: req.body.experience || user.candidateProfile?.experience
        };
    } 
    
    if (user.role === 'employer') {
        user.companyProfile = {
            ...user.companyProfile,
            companyName: req.body.companyName || user.companyProfile?.companyName,
            website: req.body.website || user.companyProfile?.website,
            location: req.body.location || user.companyProfile?.location,
            // Nếu là Employer thì avatar chính là Logo công ty
            logoUrl: req.file ? req.file.path : user.companyProfile?.logoUrl,
            description: req.body.description || user.companyProfile?.description
        };
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      avatar: updatedUser.avatar,
      candidateProfile: updatedUser.candidateProfile,
      companyProfile: updatedUser.companyProfile,
      token: req.headers.authorization.split(' ')[1] // Trả lại token cũ để client đỡ phải login lại
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi server khi update profile' });
  }
};