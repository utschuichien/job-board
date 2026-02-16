import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import {
    LogOut,
    User,
    Heart,
    ChevronDown,
    LayoutDashboard,
    Briefcase,
} from 'lucide-react';

function Navbar() {
    const { user, logout, isAuthenticated } = useAuthStore();
    const navigate = useNavigate();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const handleLogout = () => {
        logout();
        navigate('/login');
        setIsDropdownOpen(false);
    };
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <nav className="bg-white  shadow-md sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    {/* LOGO */}
                    <Link to="/" className="flex items-center gap-2">
                        <div className="bg-blue-600 p-2 rounded-lg">
                            <span className="text-white font-bold text-xl">JB</span>
                        </div>
                        <span className="font-bold text-xl text-gray-800 tracking-tight">
                            JobBoard
                        </span>
                    </Link>

                    {/* MENU BÊN PHẢI */}
                    <div className="flex items-center gap-4">
                        {!isAuthenticated ? (
                            // 1. GIAO DIỆN KHI CHƯA ĐĂNG NHẬP
                            <div className="flex items-center gap-3">
                                <Link
                                    to="/register"
                                    className="text-gray-600 hover:text-blue-600 font-medium px-3 py-2"
                                >
                                    Đăng ký
                                </Link>
                                <Link to="/login" className="btn-primary text-sm">
                                    Đăng nhập
                                </Link>
                            </div>
                        ) : (
                            // 2. GIAO DIỆN KHI ĐÃ ĐĂNG NHẬP (Dropdown Avatar)
                            <div className="relative" ref={dropdownRef}>
                                {/* Nút bấm kích hoạt Dropdown */}
                                <button
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                    className="flex items-center gap-3 pl-4 hover:bg-gray-50 p-1.5 pr-2.5 rounded-full transition border border-transparent hover:border-gray-200 focus:outline-none"
                                >
                                    <div className="hidden md:flex items-center">
                                        <span className="text-sm font-semibold text-gray-700 max-w-[150px] truncate">
                                            {user?.name}
                                        </span>
                                    </div>

                                    {/* Container chứa Avatar và Mũi tên */}
                                    <div className="flex items-center gap-1">
                                        {/* 2. Avatar tròn (Chỉ chứa ảnh) */}
                                        <div className="w-9 h-9 rounded-full overflow-hidden border border-gray-200 bg-gray-100 shrink-0">
                                            <img
                                                src={
                                                    user?.avatar ||
                                                    user?.companyProfile?.logoUrl ||
                                                    'https://i0.wp.com/sbcf.fr/wp-content/uploads/2018/03/sbcf-default-avatar.png?ssl=1'
                                                }
                                                alt="Avatar"
                                                className="w-full h-full object-cover"
                                            />
                                        </div>

                                        {/* 3. Mũi tên (Đã đưa ra ngoài div avatar để nằm bên cạnh) */}
                                        <ChevronDown
                                            size={16}
                                            className={`text-gray-400 transition-transform ${
                                                isDropdownOpen ? 'rotate-180' : ''
                                            }`}
                                        />
                                    </div>
                                </button>

                                {/* MENU SỔ XUỐNG (DROPDOWN BODY) */}
                                {isDropdownOpen && (
                                    <div className="absolute right-0 mt-2 w-60 bg-white rounded-xl shadow-lg border border-gray-100 py-2 animate-in fade-in zoom-in-95 duration-200 origin-top-right">
                                        {/* Header nhỏ trong dropdown */}
                                        <div className="px-4 py-3 border-b border-gray-100 mb-2">
                                            <p className="text-sm font-bold text-gray-800">
                                                {user?.name}
                                            </p>
                                            <p className="text-xs text-gray-500 truncate">
                                                {user?.email}
                                            </p>
                                        </div>

                                        {/* Các chức năng chung */}
                                        <Link
                                            to="/profile"
                                            onClick={() => setIsDropdownOpen(false)}
                                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition"
                                        >
                                            <User size={18} /> Hồ sơ cá nhân
                                        </Link>

                                        {/* Chức năng riêng cho Candidate */}
                                        {user?.role === 'candidate' && (
                                            <>
                                                <Link
                                                    to="/saved-jobs"
                                                    onClick={() => setIsDropdownOpen(false)}
                                                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition"
                                                >
                                                    <Heart size={18} /> Việc làm đã lưu
                                                </Link>
                                                <Link
                                                    to="/my-applications"
                                                    onClick={() => setIsDropdownOpen(false)}
                                                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition"
                                                >
                                                    <Briefcase size={18} /> Lịch sử ứng tuyển
                                                </Link>
                                            </>
                                        )}

                                        {/* Chức năng riêng cho Employer */}
                                        {user?.role === 'employer' && (
                                            <Link
                                                to="/employer/dashboard"
                                                onClick={() => setIsDropdownOpen(false)}
                                                className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition"
                                            >
                                                <LayoutDashboard size={18} /> Quản lý tuyển dụng
                                            </Link>
                                        )}
                                        {user?.role === 'admin' && (
                                            <Link
                                                to="/admin/dashboard"
                                                onClick={() => setIsDropdownOpen(false)}
                                                className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition"
                                            >
                                                <LayoutDashboard size={18} /> Admin Dashboard
                                            </Link>
                                        )}

                                        <div className="h-px bg-gray-100 my-2"></div>

                                        {/* Nút Đăng xuất */}
                                        <button
                                            onClick={handleLogout}
                                            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition text-left"
                                        >
                                            <LogOut size={18} /> Đăng xuất
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
