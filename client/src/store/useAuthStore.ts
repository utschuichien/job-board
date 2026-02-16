import { create } from 'zustand';
import axiosClient from '../api/axiosClient'; // Import axios đã cấu hình của bạn

interface User {
    _id: string;
    name: string;
    email: string;
    role: 'candidate' | 'employer' | 'admin';
    avatar?: string;

    // Candidate Info
    candidateProfile?: {
        bio?: string;
        skills?: string[];
        experience?: number;
        resumeUrl?: string;
    };

    // Employer Info
    companyProfile?: {
        companyName?: string;
        website?: string;
        location?: string;
        description?: string;
        logoUrl?: string;
    };
    savedJobs?: string[];
}

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    loading: boolean; // <--- 1. Thêm biến loading

    login: (userData: User, token: string) => void;
    logout: () => void;
    updateUser: (user: User) => void;
    checkAuth: () => Promise<void>; // <--- 2. Thêm hàm kiểm tra phiên đăng nhập
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    isAuthenticated: false,
    loading: true, // <--- 3. Mặc định là đang load (để chặn UI lại)

    login: (userData, token) => {
        localStorage.setItem('token', token);
        // Lưu user vào state
        set({ user: userData, isAuthenticated: true, loading: false });
    },

    logout: () => {
        localStorage.removeItem('token');
        set({ user: null, isAuthenticated: false, loading: false });
    },

    updateUser: (userData) => {
        set({ user: userData });
    },

    // 4. Hàm quan trọng nhất: Kiểm tra token khi F5
    checkAuth: async () => {
        set({ loading: true });

        const token = localStorage.getItem('token');

        // Nếu không có token trong LS -> Chắc chắn chưa đăng nhập
        if (!token) {
            set({ user: null, isAuthenticated: false, loading: false });
            return;
        }

        try {
            // Gọi API về server để lấy thông tin user mới nhất (Verify token)
            // Giả sử bạn có endpoint: GET /api/auth/me
            const res = await axiosClient.get('/auth/me');

            set({
                user: res.data.user, // Backend trả về user object
                isAuthenticated: true,
                loading: false,
            });
        } catch (error) {
            // Nếu token hết hạn hoặc không hợp lệ -> Xóa luôn
            localStorage.removeItem('token');
            set({ user: null, isAuthenticated: false, loading: false });
        }
    },
}));
