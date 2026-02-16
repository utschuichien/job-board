import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Users, Briefcase, Eye, Search,Edit, Trash2 } from 'lucide-react';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import axiosClient from '../api/axiosClient';
import { notify } from '../utils/toast';
import ConfirmModal from '../components/shared/ConfirmModal';

function EmployerDashboard() {
    const [jobs, setJobs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'open' | 'closed'>('open');

    // State cho Modal Xóa
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selectedJobId, setSelectedJobId] = useState<string | null>(null);

    useEffect(() => {
        fetchJobs();
    }, []);

    const fetchJobs = async () => {
        try {
            // Gọi API lấy danh sách job
            const res = await axiosClient.get('/jobs/my-jobs');
            // FIX: Theo code cũ của bạn thì dữ liệu nằm trong res.data.jobs
            setJobs(res.data.jobs || []);
            setLoading(false);
        } catch (error) {
            console.error(error);
            notify.error('Lỗi tải danh sách công việc');
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!selectedJobId) return;
        try {
            await axiosClient.delete(`/jobs/${selectedJobId}`);
            // Cập nhật lại UI sau khi xóa
            setJobs((prev) => prev.filter((job) => job._id !== selectedJobId));
            notify.success('Đã xóa tin tuyển dụng');
            setIsDeleteOpen(false);
        } catch (error) {
            notify.error('Lỗi khi xóa');
        }
    };

    // Tính toán số liệu thống kê từ danh sách jobs hiện có
    const stats = {
        totalJobs: jobs.length,
        // Giả sử backend chưa trả về applicationCount, ta tạm để 0 hoặc tính sau
        // Nếu backend trả về field 'applicationCount' trong job object thì dùng:
        // jobs.reduce((acc, job) => acc + (job.applicationCount || 0), 0)
        activeJobs: jobs.length,
        totalApplications: jobs.length * 0, // Placeholder
        totalViews: 0, // Placeholder
    };

    if (loading) return <LoadingSpinner />;

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* 1. HEADER */}
                <div className="flex flex-col md:flex-row justify-between items-end md:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">Tổng quan tuyển dụng</h1>
                        <p className="text-gray-500 text-sm mt-1">
                            Quản lý tin đăng và ứng viên của bạn
                        </p>
                    </div>
                    <Link
                        to="/post-job"
                        className="btn-primary flex items-center gap-2 shadow-lg shadow-blue-200"
                    >
                        <Plus size={20} /> Đăng tin mới
                    </Link>
                </div>

                {/* 2. STATS CARDS */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <StatsCard
                        icon={<Briefcase size={24} />}
                        label="Tin đang hiển thị"
                        value={stats.activeJobs}
                        color="bg-blue-50 text-blue-600"
                    />
                    <StatsCard
                        icon={<Users size={24} />}
                        label="Hồ sơ ứng tuyển"
                        value={stats.totalApplications} // Bạn cần update API để lấy số thật
                        color="bg-purple-50 text-purple-600"
                    />
                    <StatsCard
                        icon={<Eye size={24} />}
                        label="Lượt xem tin"
                        value={stats.totalViews}
                        color="bg-green-50 text-green-600"
                    />
                    <StatsCard
                        icon={<Search size={24} />}
                        label="Tin đã đóng"
                        value={0}
                        color="bg-gray-100 text-gray-600"
                    />
                </div>

                {/* 3. TABLE */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    {/* Tabs Lọc */}
                    <div className="border-b border-gray-200 px-6 py-4 flex items-center gap-6">
                        <button
                            onClick={() => setFilter('open')}
                            className={`text-sm font-semibold pb-4 -mb-4 border-b-2 transition ${
                                filter === 'open'
                                    ? 'border-blue-600 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            Đang tuyển dụng ({jobs.length})
                        </button>
                        <button
                            onClick={() => setFilter('closed')}
                            className={`text-sm font-semibold pb-4 -mb-4 border-b-2 transition ${
                                filter === 'closed'
                                    ? 'border-blue-600 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            Đã đóng (0)
                        </button>
                    </div>

                    {/* Nội dung bảng */}
                    <div className="overflow-x-auto">
                        {jobs.length === 0 ? (
                            <div className="text-center py-12">
                                <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <Briefcase className="text-gray-400" />
                                </div>
                                <p className="text-gray-500">Bạn chưa đăng tin tuyển dụng nào.</p>
                                <Link
                                    to="/post-job"
                                    className="text-blue-600 font-medium mt-2 block hover:underline"
                                >
                                    Đăng ngay
                                </Link>
                            </div>
                        ) : (
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-gray-50 text-xs uppercase text-gray-500 font-semibold">
                                    <tr>
                                        <th className="px-6 py-4">Vị trí tuyển dụng</th>
                                        <th className="px-6 py-4">Ngày đăng</th>
                                        <th className="px-6 py-4 text-center">Ứng viên</th>
                                        <th className="px-6 py-4 text-center">Trạng thái</th>
                                        <th className="px-6 py-4 text-right">Hành động</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 text-sm">
                                    {jobs.map((job) => (
                                        <tr
                                            key={job._id}
                                            className="hover:bg-gray-50 transition group"
                                        >
                                            {/* Cột 1: Tên Job */}
                                            <td className="px-6 py-4">
                                                <Link
                                                    to={`/jobs/${job._id}`}
                                                    className="font-bold text-gray-800 hover:text-blue-600 block mb-1"
                                                >
                                                    {job.title}
                                                </Link>
                                                <div className="flex items-center gap-2 text-gray-500 text-xs">
                                                    <span className="bg-gray-100 px-2 py-0.5 rounded text-gray-600">
                                                        {job.jobType}
                                                    </span>
                                                    <span>• {job.location}</span>
                                                </div>
                                            </td>

                                            {/* Cột 2: Ngày đăng */}
                                            <td className="px-6 py-4 text-gray-500">
                                                {new Date(job.createdAt).toLocaleDateString(
                                                    'vi-VN',
                                                )}
                                            </td>

                                            {/* Cột 3: Nút xem Ứng viên (LINK SANG TRANG MỚI) */}
                                            <td className="px-6 py-4 text-center">
                                                <Link
                                                    to={`/employer/jobs/${job._id}/applications`}
                                                    className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 rounded-full font-bold text-xs hover:bg-blue-100 transition"
                                                >
                                                    <Users size={14} /> Xem hồ sơ
                                                </Link>
                                            </td>

                                            {/* Cột 4: Trạng thái */}
                                            <td className="px-6 py-4 text-center">
                                                <span className="px-2 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700 border border-green-200">
                                                    Active
                                                </span>
                                            </td>

                                            {/* Cột 5: Hành động (Sửa/Xóa) */}
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <Link
                                                        to={`/jobs/edit/${job._id}`}
                                                        className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                                                        title="Sửa"
                                                    >
                                                        <Edit size={18} />
                                                    </Link>
                                                    <button
                                                        onClick={() => {
                                                            setSelectedJobId(job._id);
                                                            setIsDeleteOpen(true);
                                                        }}
                                                        className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                                                        title="Xóa"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </div>

            {/* Modal Xóa */}
            <ConfirmModal
                isOpen={isDeleteOpen}
                onClose={() => setIsDeleteOpen(false)}
                onConfirm={handleDelete}
                title="Xóa tin tuyển dụng?"
                message="Hành động này sẽ xóa tin tuyển dụng và toàn bộ hồ sơ ứng tuyển liên quan. Bạn không thể hoàn tác."
            />
        </div>
    );
}

// Component phụ để hiển thị Card thống kê
function StatsCard({ icon, label, value, color }: any) {
    return (
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4 hover:shadow-md transition">
            <div className={`p-3 rounded-lg ${color}`}>{icon}</div>
            <div>
                <p className="text-sm text-gray-500 font-medium">{label}</p>
                <p className="text-2xl font-bold text-gray-800">{value}</p>
            </div>
        </div>
    );
}

export default EmployerDashboard;