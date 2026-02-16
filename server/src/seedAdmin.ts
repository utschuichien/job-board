import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/user.model.js';
import bcrypt from 'bcryptjs';

dotenv.config();

const createAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI as string);

        // Kiểm tra xem có admin chưa
        const existAdmin = await User.findOne({ email: 'admin@jobboard.com' });
        if (existAdmin) {
            console.log('Admin đã tồn tại!');
            process.exit();
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('123456', salt); // Mật khẩu là 123456

        await User.create({
            name: 'Super Admin',
            email: 'admin@jobboard.com',
            password: hashedPassword,
            role: 'admin',
        });

        console.log('✅ Tạo Admin thành công: admin@jobboard.com / 123456');
        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

createAdmin();
