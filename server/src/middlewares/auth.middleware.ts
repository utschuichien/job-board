import { type Request, type Response, type NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

// Mở rộng kiểu Request để TS không báo lỗi khi ta gán req.user
interface AuthRequest extends Request {
    user?: any;
}

export const protect = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    let token;

    // 1. Kiểm tra header có dạng: "Bearer <token_dai_ngoang>"
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // 2. Lấy token ra
            token = req.headers.authorization.split(' ')[1];

            // 3. Giải mã token
            const decoded: any = jwt.verify(token as string , process.env.JWT_SECRET as string);

            // 4. Tìm user trong DB và gán vào req.user (để các hàm sau dùng)
            // .select('-password') để không lấy password ra
            req.user = await User.findById(decoded.id).select('-password');

            next(); // Cho phép đi tiếp
        } catch (error) {
            res.status(401).json({ message: 'Token không hợp lệ, vui lòng đăng nhập lại' });
        }
    }

    if (!token) {
        res.status(401).json({ message: 'Bạn không có quyền truy cập, thiếu Token' });
    }
};

// Middleware kiểm tra quyền (Chỉ Employer mới được đăng bài)
export const authorize = (...roles: string[]) => {
    return (req: AuthRequest, res: Response, next: NextFunction) => {
        if (!req.user || !roles.includes(req.user.role)) {
            res.status(403).json({
                message: `Role ${req.user?.role} không được phép thực hiện hành động này`,
            });
            return;
        }
        next();
    };
};
