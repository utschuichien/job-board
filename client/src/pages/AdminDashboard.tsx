import { useEffect, useState } from 'react';
import axiosClient from '../api/axiosClient';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import { Users, Briefcase, FileText, Trash2 } from 'lucide-react';
import { notify } from '../utils/toast';
import ConfirmModal from '../components/shared/ConfirmModal';
import { useSearchParams } from 'react-router-dom';

function AdminDashboard() {
    const [stats, setStats] = useState({ totalUsers: 0, totalJobs: 0, totalApplications: 0 });
    const [users, setUsers] = useState<any[]>([]);
    const [jobs, setJobs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'users' | 'jobs'>('users');
    const [searchParams, setSearchParams] = useSearchParams();
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    // State cho Modal Xóa
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [deleteType, setDeleteType] = useState<'user' | 'job' | null>(null);

    useEffect(() => {
        const currentPage = Number(searchParams.get('page')) || 1;
        setPage(currentPage);
        fetchData(currentPage);
    }, [searchParams, activeTab]);

    const fetchData = async (currentPage: number) => {
        try {
            const [statsRes, usersRes, jobsRes] = await Promise.all([
                axiosClient.get('/admin/stats'),
                axiosClient.get(`/admin/users?page=${currentPage || 1}`),
                axiosClient.get(`/admin/jobs?page=${currentPage || 1}`),
            ]);
            setStats(statsRes.data);
            setUsers(usersRes.data.users);
            setJobs(jobsRes.data.jobs);
           
            setTotalPages(activeTab === 'users' ? usersRes.data.pagination.totalPages : jobsRes.data.pagination.totalPages);
            setLoading(false);
        } catch (error) {
            notify.error('Lỗi tải dữ liệu Admin');
        }
    };
    const handlePageChange = (page: number) => {
        setSearchParams({ page: page.toString() });
    };

    const handleDeleteClick = (id: string, type: 'user' | 'job') => {
        setDeleteId(id);
        setDeleteType(type);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!deleteId || !deleteType) return;
        try {
            if (deleteType === 'user') {
                await axiosClient.delete(`/admin/users/${deleteId}`);
                setUsers((prev) => prev.filter((u) => u._id !== deleteId));
                setStats((prev) => ({ ...prev, totalUsers: prev.totalUsers - 1 }));
                notify.success('Đã xóa người dùng');
            } else {
                await axiosClient.delete(`/admin/jobs/${deleteId}`);
                setJobs((prev) => prev.filter((j) => j._id !== deleteId));
                setStats((prev) => ({ ...prev, totalJobs: prev.totalJobs - 1 }));
                notify.success('Đã xóa công việc');
            }
        } catch (error) {
            notify.error('Lỗi khi xóa');
        } finally {
            setIsDeleteModalOpen(false);
        }
    };

    if (loading) return <LoadingSpinner />;

    return (
        <div className="min-h-screen bg-gray-50 pb-10">
            <div className="max-w-7xl mx-auto px-4 py-8">
                <h1 className="text-2xl font-bold text-gray-800 mb-6">🛡️ Admin Dashboard</h1>

                {/* 1. STATS CARDS */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex items-center gap-4">
                        <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
                            <Users size={24} />
                        </div>
                        <div>
                            <p className="text-gray-500 text-sm">Tổng User</p>
                            <p className="text-2xl font-bold text-gray-800">{stats.totalUsers}</p>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex items-center gap-4">
                        <div className="p-3 bg-green-100 text-green-600 rounded-lg">
                            <Briefcase size={24} />
                        </div>
                        <div>
                            <p className="text-gray-500 text-sm">Tổng Job</p>
                            <p className="text-2xl font-bold text-gray-800">{stats.totalJobs}</p>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex items-center gap-4">
                        <div className="p-3 bg-purple-100 text-purple-600 rounded-lg">
                            <FileText size={24} />
                        </div>
                        <div>
                            <p className="text-gray-500 text-sm">Đơn đã ứng tuyển</p>
                            <p className="text-2xl font-bold text-gray-800">
                                {stats.totalApplications}
                            </p>
                        </div>
                    </div>
                </div>

                {/* 2. TABS & TABLE */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    {/* Tab Header */}
                    <div className="flex border-b border-gray-200">
                        <button
                            onClick={() => {
                                setActiveTab('users');
                                setSearchParams({});
                            }}
                            className={`px-6 py-4 font-medium text-sm transition ${
                                activeTab === 'users'
                                    ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                                    : 'text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            Quản lý Users
                        </button>
                        <button
                            onClick={() => {
                                setActiveTab('jobs');
                                setSearchParams({});
                            }}
                            className={`px-6 py-4 font-medium text-sm transition ${
                                activeTab === 'jobs'
                                    ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                                    : 'text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            Quản lý Jobs
                        </button>
                    </div>

                    {/* Tab Content */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            {/* --- TAB USERS --- */}
                            {activeTab === 'users' && (
                                <>
                                    <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-semibold">
                                        <tr>
                                            <th className="px-6 py-4">Họ tên</th>
                                            <th className="px-6 py-4">Email</th>
                                            <th className="px-6 py-4">Vai trò</th>
                                            <th className="px-6 py-4 text-center">Hành động</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100 text-sm">
                                        {users.map((u) => (
                                            <tr key={u._id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 font-medium">{u.name}</td>
                                                <td className="px-6 py-4 text-gray-500">
                                                    {u.email}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span
                                                        className={`px-2 py-1 rounded-full text-xs font-bold ${
                                                            u.role === 'employer'
                                                                ? 'bg-purple-100 text-purple-700'
                                                                : 'bg-gray-100 text-gray-700'
                                                        }`}
                                                    >
                                                        {u.role === 'employer'
                                                            ? 'Nhà tuyển dụng'
                                                            : 'Ứng viên '}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <button
                                                        onClick={() =>
                                                            handleDeleteClick(u._id, 'user')
                                                        }
                                                        className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-full transition"
                                                        title="Xóa User"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </>
                            )}

                            {/* --- TAB JOBS --- */}
                            {activeTab === 'jobs' && (
                                <>
                                    <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-semibold">
                                        <tr>
                                            <th className="px-6 py-4">Tiêu đề</th>
                                            <th className="px-6 py-4">Công ty</th>
                                            <th className="px-6 py-4">Ngày đăng</th>
                                            <th className="px-6 py-4 text-center">Hành động</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100 text-sm">
                                        {jobs.map((j) => (
                                            <tr key={j._id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 font-medium text-blue-600">
                                                    {j.title}
                                                </td>
                                                <td className="px-6 py-4 text-gray-500">
                                                    {j.employerId?.name || 'Unknown'}
                                                </td>
                                                <td className="px-6 py-4 text-gray-500">
                                                    {new Date(j.createdAt).toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <button
                                                        onClick={() =>
                                                            handleDeleteClick(j._id, 'job')
                                                        }
                                                        className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-full transition"
                                                        title="Xóa Job"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </>
                            )}
                        </table>
                    </div>
                </div>
                <div className="flex justify-center mt-10">
                    {totalPages > 1 && (
                        <div className="flex justify-center items-center space-x-2 mt-8  ">
                            {/* Nút Previous */}
                            <button
                                onClick={() => {
                                    handlePageChange(page - 1);
                                }}
                                disabled={page === 1}
                                className={`px-4 py-2 border rounded ${
                                    page === 1
                                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                        : 'bg-white hover:bg-gray-50 text-blue-600'
                                }`}
                            >
                                Trước
                            </button>

                            {/* Hiển thị số trang */}
                            <span className="text-gray-600 font-medium px-4  border rounded py-2">
                                Trang {page} / {totalPages}
                            </span>

                            {/* Nút Next */}
                            <button
                                onClick={() => {
                                    handlePageChange(page + 1);
                                }}
                                disabled={page === totalPages}
                                className={`px-4 py-2 border rounded ${
                                    page === totalPages
                                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                        : 'bg-white hover:bg-gray-50 text-blue-600'
                                }`}
                            >
                                Sau
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal Xóa */}
            <ConfirmModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={confirmDelete}
                title={`Xóa ${deleteType === 'user' ? 'Người dùng' : 'Công việc'}?`}
                message="Hành động này không thể hoàn tác. Bạn có chắc chắn không?"
            />
        </div>
    );
}

export default AdminDashboard;
