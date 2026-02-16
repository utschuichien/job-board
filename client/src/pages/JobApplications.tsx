import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import {
    ArrowLeft,
    Mail,
    Calendar,
    Download,
    Eye,

} from 'lucide-react';
import { notify } from '../utils/toast';

interface Application {
    _id: string;
    candidateId: {
        _id: string;
        name: string;
        email: string;
        avatar?: string;
    };
    cvUrl: string;
    status: 'pending' | 'interview' | 'hired' | 'rejected';
    createdAt: string;
}

function JobApplications() {
    const { jobId } = useParams();
    const navigate = useNavigate();
    const [applications, setApplications] = useState<Application[]>([]);
    const [loading, setLoading] = useState(true);
    const [jobTitle, setJobTitle] = useState('');

    useEffect(() => {
        fetchApplications();
    }, [jobId]);

    const fetchApplications = async () => {
        try {
            // Gọi API lấy danh sách ứng viên
            // Lưu ý: Backend cần trả về cả thông tin job (để lấy title) hoặc gọi 2 API
            const res = await axiosClient.get(`/jobs/${jobId}/applications`);

            // Giả sử API trả về mảng applications trực tiếp
            setApplications(res.data);

            // Nếu muốn lấy title job, bạn có thể gọi thêm API getJobDetail hoặc backend trả về kèm
            // Tạm thời mình set cứng hoặc lấy từ item đầu tiên nếu backend populate
            const jobRes = await axiosClient.get(`/jobs/${jobId}`);
            if (jobRes.data) {setJobTitle(jobRes.data.title);
            }
            setLoading(false);
        } catch (error) {
            console.error(error);
            notify.error('Không thể tải danh sách ứng viên');
            setLoading(false);
        }
    };

    // Hàm cập nhật trạng thái
    const handleStatusChange = async (appId: string, newStatus: string) => {
        try {
            await axiosClient.patch(`/jobs/application/${appId}/status`, { status: newStatus });

            // Cập nhật giao diện ngay lập tức (Optimistic UI)
            setApplications((prev) =>
                prev.map((app) => (app._id === appId ? { ...app, status: newStatus as any } : app)),
            );

            notify.success('Đã cập nhật trạng thái hồ sơ');
        } catch (error) {
            notify.error('Lỗi cập nhật trạng thái');
        }
    };

    // Helper chọn màu cho trạng thái
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'hired':
                return 'bg-green-100 text-green-700 border-green-200';
            case 'rejected':
                return 'bg-red-100 text-red-700 border-red-200';
            case 'interview':
                return 'bg-blue-100 text-blue-700 border-blue-200';
            default:
                return 'bg-yellow-100 text-yellow-700 border-yellow-200';
        }
    };

    if (loading) return <LoadingSpinner />;

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* HEADER */}
                <div className="mb-8">
                    <button
                        onClick={() => navigate('/employer/dashboard')}
                        className="flex items-center text-gray-500 hover:text-blue-600 mb-4 transition"
                    >
                        <ArrowLeft size={18} className="mr-1" /> Quay lại
                    </button>
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800">Danh sách ứng viên</h1>
                            <p className="text-gray-500 text-sm mt-1">
                                Đang xem hồ sơ cho vị trí:{' '}
                                <span className="font-semibold text-blue-600">
                                    {jobTitle || 'Công việc này'}
                                </span>
                            </p>
                        </div>
                        <div className="bg-white px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-600">
                            Tổng hồ sơ:{' '}
                            <span className="text-gray-900 font-bold">{applications.length}</span>
                        </div>
                    </div>
                </div>

                {/* CONTENT */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    {applications.length === 0 ? (
                        <div className="text-center py-16">
                            <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Mail className="text-gray-400" size={32} />
                            </div>
                            <h3 className="text-lg font-bold text-gray-800">
                                Chưa có ứng viên nào
                            </h3>
                            <p className="text-gray-500 mt-2">
                                Hãy kiên nhẫn, hồ sơ sẽ sớm được gửi đến thôi!
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-gray-50 text-xs uppercase text-gray-500 font-semibold border-b border-gray-200">
                                    <tr>
                                        <th className="px-6 py-4">Ứng viên</th>
                                        <th className="px-6 py-4">Liên hệ</th>
                                        <th className="px-6 py-4">Ngày nộp</th>
                                        <th className="px-6 py-4">CV Đính kèm</th>
                                        <th className="px-6 py-4">Trạng thái</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 text-sm">
                                    {applications.map((app) => (
                                        <tr
                                            key={app._id}
                                            className="hover:bg-gray-50 transition group"
                                        >
                                            {/* Cột 1: Info */}
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <img
                                                        src={
                                                            app.candidateId.avatar ||
                                                            'https://i0.wp.com/sbcf.fr/wp-content/uploads/2018/03/sbcf-default-avatar.png?ssl=1'
                                                        }
                                                        alt="Avatar"
                                                        className="w-10 h-10 rounded-full object-cover border border-gray-200"
                                                    />
                                                    <div>
                                                        <p className="font-bold text-gray-900">
                                                            {app.candidateId.name}
                                                        </p>
                                                        <p className="text-xs text-gray-500">
                                                            ID: {app.candidateId._id.slice(-6)}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Cột 2: Email */}
                                            <td className="px-6 py-4 text-gray-600">
                                                <div className="flex items-center gap-2">
                                                    <Mail size={14} className="text-gray-400" />
                                                    {app.candidateId.email}
                                                </div>
                                            </td>

                                            {/* Cột 3: Ngày nộp */}
                                            <td className="px-6 py-4 text-gray-600">
                                                <div className="flex items-center gap-2">
                                                    <Calendar size={14} className="text-gray-400" />
                                                    {new Date(app.createdAt).toLocaleDateString(
                                                        'vi-VN',
                                                    )}
                                                </div>
                                            </td>

                                            {/* Cột 4: CV */}
                                            <td className="px-6 py-4">
                                                <div className="flex gap-2">
                                                    <a
                                                        href={app.cvUrl}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 text-xs font-bold transition"
                                                        title="Xem CV"
                                                    >
                                                        <Eye size={14} /> Xem PDF
                                                    </a>
                                                    <a
                                                        href={app.cvUrl}
                                                        download
                                                        className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition"
                                                        title="Tải về"
                                                    >
                                                        <Download size={16} />
                                                    </a>
                                                </div>
                                            </td>

                                            {/* Cột 5: Trạng thái (Dropdown) */}
                                            <td className="px-6 py-4">
                                                <div className="relative">
                                                    <select
                                                        value={app.status}
                                                        onChange={(e) =>
                                                            handleStatusChange(
                                                                app._id,
                                                                e.target.value,
                                                            )
                                                        }
                                                        className={`
                                                    appearance-none pl-3 pr-8 py-1.5 rounded-full text-xs font-bold border cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-300
                                                    ${getStatusColor(app.status)}
                                                `}
                                                    >
                                                        <option value="pending">⏳ Đang chờ</option>
                                                        <option value="interview">
                                                            🗣️ Phỏng vấn
                                                        </option>
                                                        <option value="hired">✅ Đã tuyển</option>
                                                        <option value="rejected">❌ Từ chối</option>
                                                    </select>
                                                    {/* Custom arrow icon fake */}
                                                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none opacity-50">
                                                        <svg
                                                            width="10"
                                                            height="6"
                                                            viewBox="0 0 10 6"
                                                            fill="currentColor"
                                                        >
                                                            <path
                                                                d="M1 1L5 5L9 1"
                                                                stroke="currentColor"
                                                                strokeWidth="1.5"
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                            />
                                                        </svg>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default JobApplications;
