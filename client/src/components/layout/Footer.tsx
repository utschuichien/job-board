import { Link } from 'react-router-dom';
import { Facebook, Twitter, Linkedin, Instagram, Mail, Phone, MapPin } from 'lucide-react';

function Footer() {
    return (
        <footer className="bg-slate-900 text-slate-300 pt-16 pb-8 border-t border-slate-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* GRID 4 CỘT */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
                    {/* Cột 1: Thông tin chung */}
                    <div>
                        <Link to="/" className="flex items-center gap-2 mb-6">
                            <div className="bg-blue-600 p-2 rounded-lg">
                                <span className="text-white font-bold text-xl">JB</span>
                            </div>
                            <span className="font-bold text-xl text-white tracking-tight">
                                JobBoard
                            </span>
                        </Link>
                        <p className="text-slate-400 text-sm leading-relaxed mb-6">
                            Nền tảng tuyển dụng hàng đầu, kết nối hàng triệu ứng viên tiềm năng với
                            các doanh nghiệp uy tín. Tìm việc dễ dàng, tuyển dụng nhanh chóng.
                        </p>
                        <div className="flex gap-4">
                            <a href="#" className="hover:text-white transition-colors">
                                <Facebook size={20} />
                            </a>
                            <a href="#" className="hover:text-white transition-colors">
                                <Twitter size={20} />
                            </a>
                            <a href="#" className="hover:text-white transition-colors">
                                <Linkedin size={20} />
                            </a>
                            <a href="#" className="hover:text-white transition-colors">
                                <Instagram size={20} />
                            </a>
                        </div>
                    </div>

                    {/* Cột 2: Dành cho Ứng viên */}
                    <div>
                        <h3 className="text-white font-semibold text-lg mb-6">Dành cho Ứng viên</h3>
                        <ul className="space-y-4 text-sm">
                            <li>
                                <Link to="/" className="hover:text-blue-400 transition-colors">
                                    Việc làm mới nhất
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/saved-jobs"
                                    className="hover:text-blue-400 transition-colors"
                                >
                                    Việc làm đã lưu
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/profile"
                                    className="hover:text-blue-400 transition-colors"
                                >
                                    Hồ sơ cá nhân
                                </Link>
                            </li>
                            <li>
                                <Link to="#" className="hover:text-blue-400 transition-colors">
                                    Hướng dẫn viết CV
                                </Link>
                            </li>
                            <li>
                                <Link to="#" className="hover:text-blue-400 transition-colors">
                                    Cẩm nang nghề nghiệp
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Cột 3: Dành cho Nhà tuyển dụng */}
                    <div>
                        <h3 className="text-white font-semibold text-lg mb-6">Nhà Tuyển Dụng</h3>
                        <ul className="space-y-4 text-sm">
                            <li>
                                <Link
                                    to="/post-job"
                                    className="hover:text-blue-400 transition-colors"
                                >
                                    Đăng tin tuyển dụng
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/employer/dashboard"
                                    className="hover:text-blue-400 transition-colors"
                                >
                                    Quản lý hồ sơ
                                </Link>
                            </li>
                            <li>
                                <Link to="#" className="hover:text-blue-400 transition-colors">
                                    Tìm kiếm nhân tài
                                </Link>
                            </li>
                            <li>
                                <Link to="#" className="hover:text-blue-400 transition-colors">
                                    Báo giá dịch vụ
                                </Link>
                            </li>
                            <li>
                                <Link to="#" className="hover:text-blue-400 transition-colors">
                                    Liên hệ tư vấn
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Cột 4: Liên hệ */}
                    <div>
                        <h3 className="text-white font-semibold text-lg mb-6">Liên hệ</h3>
                        <ul className="space-y-4 text-sm">
                            <li className="flex items-start gap-3">
                                <MapPin size={18} className="mt-0.5 text-blue-500 shrink-0" />
                                <span>Tầng 12, Tòa nhà Bitexco, Quận 1, TP. Hồ Chí Minh</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone size={18} className="text-blue-500 shrink-0" />
                                <span>(028) 3838 3838</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail size={18} className="text-blue-500 shrink-0" />
                                <span>support@jobboard.vn</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Dòng bản quyền dưới cùng */}
                <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-sm text-slate-500">
                        © 2025 JobBoard. All rights reserved. Designed by You.
                    </p>
                    <div className="flex gap-6 text-sm text-slate-500">
                        <Link to="#" className="hover:text-white transition-colors">
                            Điều khoản sử dụng
                        </Link>
                        <Link to="#" className="hover:text-white transition-colors">
                            Chính sách bảo mật
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
