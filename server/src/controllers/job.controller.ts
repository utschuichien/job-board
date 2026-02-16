import type { Request, Response } from 'express';
import Job from '../models/job.model.js';
import Application from '../models/application.model.js';
interface AuthRequest extends Request {
    user?: any;
}

// @desc    Lấy tất cả job (có tìm kiếm cơ bản)
// @route   GET /api/jobs
// @access  Public

export const getJobs = async (req: Request, res: Response) => {
    try {
        // 1. Lấy tham số từ Query String (Mặc định trang 1, 10 job/trang)
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 5; // Để số nhỏ (5) để dễ test phân trang
        const skip = (page - 1) * limit;

        // 1. Lấy các tham số filter từ URL
        const { search, jobType, location } = req.query;

        // 2. Xây dựng object truy vấn (Query Object)
        const query: any = {};

        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } }, // 'i' là không phân biệt hoa thường
                { description: { $regex: search, $options: 'i' } },
            ];
        }
        // Nếu có lọc theo loại hình (Remote, Full-time...)
        if (jobType && jobType !== 'All') {
            query.jobType = jobType;
        }

        // Nếu có lọc theo địa điểm
        if (location && location !== 'All') {
            // Dùng regex để tìm tương đối (VD chọn Hà Nội thì tìm đc cả "Hà Nội, VN")
            query.location = { $regex: location, $options: 'i' };
        }
        // 2. Logic tìm kiếm + Phân trang
        // .countDocuments() đếm tổng số job để tính ra có bao nhiêu trang tất cả
        const totalJobs = await Job.countDocuments(query);
        const jobs = await Job.find(query)
            .populate('employerId', 'name companyProfile')
            .sort({ createdAt: -1 })
            .skip(skip) // Bỏ qua n phần tử đầu
            .limit(limit); // Chỉ lấy n phần tử
        res.json({
            jobs,
            pagination: {
                page, // Trang hiện tại
                limit,
                totalPages: Math.ceil(totalJobs / limit), // Tổng số trang
                totalJobs, // Tổng số bản ghi
            },
        });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server khi lấy danh sách job' });
    }
};

// @desc    Tạo job mới
// @route   POST /api/jobs
// @access  Private (Employer only)
export const createJob = async (req: AuthRequest, res: Response) => {
    try {
        // 1. Lấy dữ liệu từ body
        const { title, description, requirements, salary, location, jobType, level, deadline } =
            req.body;

        // 2. Tạo job mới
        const job = await Job.create({
            employerId: req.user._id, // Lấy ID từ user đang đăng nhập (do middleware protect gán vào)
            title,
            description,
            requirements,
            salary,
            location,
            jobType,
            level,
            deadline,
        });

        res.status(201).json(job);
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi khi tạo tin tuyển dụng' });
    }
};

// @desc    Lấy chi tiết 1 job
// @route   GET /api/jobs/:id
// @access  Public
export const getJobById = async (req: Request, res: Response): Promise<void> => {
  try {
    const job = await Job.findById(req.params.id).populate('employerId', 'name companyProfile email');

    if (!job) {
      res.status(404).json({ message: 'Không tìm thấy công việc này' });
      return;
    }

    res.json(job);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server' });
  }
};

// @desc    Ứng viên nộp CV
// @route   POST /api/jobs/:id/apply
// @access  Private (Candidate)
export const applyJob = async (req: AuthRequest, res: Response) => {
    try {
        const jobId = req.params.id as string;
        const candidateId = req.user._id as string;

        // 1. Kiểm tra xem đã có file gửi lên chưa (Multer đã xử lý trước đó)
        if (!req.file) {
            res.status(400).json({ message: 'Vui lòng upload CV (PDF)' });
            return;
        }

        // 2. Kiểm tra xem user này đã nộp đơn cho job này chưa
        const existingApp = await Application.findOne({ jobId, candidateId });
        if (existingApp) {
            res.status(400).json({ message: 'Bạn đã ứng tuyển công việc này rồi!' });
            return;
        }

        // 3. Tạo Application mới
        const application = await Application.create({
            jobId,
            candidateId,
            cvUrl: req.file.path, // <--- ĐÂY LÀ LINK CLOUDINARY TRẢ VỀ
            status: 'pending',
        });

        res.status(201).json({ message: 'Nộp đơn thành công!', application });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi khi nộp đơn' });
    }
};

// @desc    Lấy danh sách job do chính user hiện tại đăng
// @route   GET /api/jobs/my-jobs
// @access  Private (Employer)
export const getMyJobs = async (req: AuthRequest, res: Response) => {
  try {
    const jobs = await Job.find({ employerId: req.user._id }) // Chỉ tìm job của user này
      .sort({ createdAt: -1 });
    
    res.json({
      jobs
    });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server' });
  }
};

export const getJobApplications = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const jobId = req.params.id as string;

        // 1. Check xem job này có phải của ông Employer này không (Bảo mật)
        const job = await Job.findOne({ _id: jobId, employerId: req.user._id });
        if (!job) {
            res.status(403).json({ message: 'Bạn không có quyền xem job này' });
            return;
        }

        // 2. Lấy list applications + Populate thông tin ứng viên
        const applications = await Application.find({ jobId }).populate(
            'candidateId',
            'name email candidateProfile',
        ); // Lấy tên, email, profile

        res.json(applications);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server' });
    }
};

// @desc    Cập nhật trạng thái hồ sơ (Duyệt/Loại)
// @route   PATCH /api/jobs/application/:id/status
// @access  Private (Employer)
export const updateApplicationStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { status } = req.body;
    const applicationId = req.params.id;

    // 1. Validate status hợp lệ
    const validStatuses = ['pending', 'interview', 'rejected', 'hired'];
    if (!validStatuses.includes(status)) {
      res.status(400).json({ message: 'Trạng thái không hợp lệ' });
      return;
    }

    // 2. Tìm Application
    const application = await Application.findById(applicationId).populate('jobId');

    if (!application) {
      res.status(404).json({ message: 'Không tìm thấy hồ sơ' });
      return;
    }

    // 3. (Bảo mật) Check xem Employer này có phải chủ của Job này không?
    // Vì application có link tới jobId, ta check owner của job đó
    const job: any = application.jobId; 
    if (job.employerId.toString() !== req.user._id.toString()) {
      res.status(403).json({ message: 'Bạn không có quyền chỉnh sửa hồ sơ này' });
      return;
    }

    // 4. Update
    application.status = status;
    await application.save();

    res.json({ message: 'Cập nhật thành công', application });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

// @desc    Cập nhật Job
// @route   PUT /api/jobs/:id
// @access  Private (Employer Owner)
export const updateJob = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      res.status(404).json({ message: 'Không tìm thấy công việc' });
      return;
    }

    // Kiểm tra xem người đang request có phải chủ nhân của job không
    if (job.employerId.toString() !== req.user._id.toString()) {
      res.status(403).json({ message: 'Bạn không có quyền sửa công việc này' });
      return;
    }

    // Cập nhật (cho phép sửa title, description, salary...)
    const updatedJob = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedJob);

  } catch (error) {
    res.status(500).json({ message: 'Lỗi server' });
  }
};

// @desc    Xóa Job
// @route   DELETE /api/jobs/:id
// @access  Private (Employer Owner)
export const deleteJob = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      res.status(404).json({ message: 'Không tìm thấy công việc' });
      return;
    }

    if (job.employerId.toString() !== req.user._id.toString()) {
      res.status(403).json({ message: 'Bạn không có quyền xóa công việc này' });
      return;
    }

    await job.deleteOne(); 
    // Mở rộng: Sau này có thể xóa luôn cả Application liên quan đến job này nếu muốn

    res.json({ message: 'Đã xóa công việc thành công' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server' });
  }
};

// @desc    Lấy danh sách job của một công ty cụ thể
// @route   GET /api/jobs/employer/:employerId
// @access  Public
export const getJobsByEmployer = async (req: Request, res: Response): Promise<void> => {
  try {
    const jobs = await Job.find({ 
      employerId: req.params.employerId as string,
      // Thường thì chỉ hiện job còn hạn, nhưng tạm thời cứ hiện hết
    }).sort({ createdAt: -1 }); // Mới nhất lên đầu

    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server' });
  }
};