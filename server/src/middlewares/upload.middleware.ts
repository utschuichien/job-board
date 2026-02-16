import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';
import dotenv from 'dotenv';

dotenv.config();

// 1. Cấu hình Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME as string ,
    api_key: process.env.CLOUDINARY_API_KEY as string ,
    api_secret: process.env.CLOUDINARY_API_SECRET as string ,
});

// 2. Cấu hình nơi lưu trữ (Storage)
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
        // Lấy đuôi file gốc (ví dụ: pdf, docx)
        const format = file.originalname.split('.').pop();

        return {
            folder: 'job-board-cvs',
            resource_type: 'auto',
            format: format,
            public_id: file.originalname.split('.')[0] + '-' + Date.now(),
        };
    },
});

// 3. Khởi tạo Multer
const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // Giới hạn 5MB
});

export default upload;
