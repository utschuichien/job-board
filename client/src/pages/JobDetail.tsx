import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import parse from 'html-react-parser'; // Parser HTML từ Editor
import LoadingSpinner from '../components/shared/LoadingSpinner';
import {
    MapPin,
    DollarSign,
    Clock,
    Briefcase,
    Calendar,
    Building2,
    Share2,
    Flag,
    ArrowLeft,
} from 'lucide-react';
import ApplyModal from '../components/shared/ApplyModal';
import { formatVNDText } from '../utils/formatVNDText';

function JobDetail() {
    const { id } = useParams();
    const [job, setJob] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        axiosClient
            .get(`/jobs/${id}`)
            .then((res) => {
                setJob(res.data);
                setLoading(false);
            })
            .catch((err) => console.error(err));
    }, [id]);

    if (loading) return <LoadingSpinner />;
    if (!job) return <div className="text-center py-20">Không tìm thấy công việc</div>;

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* 1. HEADER BANNER (Màu nền phía trên) */}
            <div className="bg-white border-b border-gray-200 sticky top-2 z-10 shadow-sm">
                <div className="max-w-6xl mx-auto px-4 py-6">
                    <Link
                        to="/"
                        className="text-gray-500 hover:text-blue-600 items-center gap-2 text-sm mb-4 inline-flex"
                    >
                        <ArrowLeft size={16} /> Quay lại tìm việc
                    </Link>

                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            {/* Logo Công ty */}
                            <div className="w-16 h-16 rounded-lg border border-gray-100 bg-white p-1 shadow-sm">
                                <img
                                    src={
                                        job.employerId.companyProfile?.logoUrl ||
                                        'https://i0.wp.com/sbcf.fr/wp-content/uploads/2018/03/sbcf-default-avatar.png?ssl=1'
                                    }
                                    className="w-full h-full object-contain"
                                    alt="Logo"
                                />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">{job.title}</h1>
                                <Link
                                    to={`/companies/${job.employerId._id}`}
                                    className="text-gray-600 hover:text-blue-600 font-medium"
                                >
                                    {job.employerId.companyProfile?.companyName ||
                                        job.employerId.name}
                                </Link>
                            </div>
                        </div>

                        {/* Nút hành động nhanh trên Header */}
                        <div className="flex gap-3">
                            <button
                                className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-600"
                                title="Chia sẻ"
                            >
                                <Share2 size={20} />
                            </button>
                            <button
                                onClick={() => setIsModalOpen(true)}
                                className="px-6 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 shadow-md transition transform hover:scale-105"
                            >
                                Ứng tuyển ngay
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. MAIN CONTENT (Grid 2 cột) */}
            <div className="max-w-6xl mx-auto px-4 mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* --- CỘT TRÁI (Chi tiết - Chiếm 2 phần) --- */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Box Thông tin chung */}
                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm grid grid-cols-2 md:grid-cols-3 gap-6">
                        <div>
                            <p className="text-gray-500 text-sm flex items-center gap-1 mb-1">
                                <DollarSign size={14} /> Mức lương
                            </p>
                            <p className="font-bold text-green-600">
                                {formatVNDText(job.salary.from)} - {formatVNDText(job.salary.to)} VND
                            </p>
                        </div>
                        <div>
                            <p className="text-gray-500 text-sm flex items-center gap-1 mb-1">
                                <MapPin size={14} /> Địa điểm
                            </p>
                            <p className="font-semibold text-gray-800">{job.location}</p>
                        </div>
                        <div>
                            <p className="text-gray-500 text-sm flex items-center gap-1 mb-1">
                                <Briefcase size={14} /> Kinh nghiệm
                            </p>
                            <p className="font-semibold text-gray-800">1 - 3 năm</p>{' '}
                            {/* Hardcode tạm hoặc thêm field */}
                        </div>
                    </div>

                    {/* Box Nội dung HTML (Editor) */}
                    <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
                        <h2 className="text-xl font-bold text-gray-800 mb-6 border-l-4 border-blue-600 pl-3">
                            Chi tiết công việc
                        </h2>

                        {/* Class prose của Tailwind giúp format HTML đẹp tự động */}
                        <div
                            className="prose max-w-none text-gray-600  whitespace-pre-line  leading-relaxed prose prose-sm
                                                  [&_ol]:list-decimal [&_ol]:pl-6
                                                [&_ul]:list-disc [&_ul]:pl-6"
                        >
                            {parse(job.description)}
                        </div>
                    </div>

                    {/* Box Cách ứng tuyển */}
                    <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
                        <h3 className="font-bold text-blue-800 mb-2">Cách thức ứng tuyển</h3>
                        <p className="text-blue-600 text-sm mb-4">
                            Ứng viên nộp hồ sơ trực tuyến bằng cách bấm{' '}
                            <strong>Ứng tuyển ngay</strong> bên dưới.
                        </p>
                        <p className="text-xs text-blue-400">
                            Hạn nộp hồ sơ:{' '}
                            {new Date(
                                new Date(job.createdAt).getTime() + 30 * 24 * 60 * 60 * 1000,
                            ).toLocaleDateString()}
                        </p>
                    </div>
                </div>

                {/* --- CỘT PHẢI (Sidebar Sticky - Chiếm 1 phần) --- */}
                <div className="space-y-6">
                    {/* Card Tóm tắt công ty (Sticky) */}
                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm sticky top-44">
                        <div className="flex items-center gap-3 mb-4">
                            <Building2 className="text-gray-400" />
                            <span className="font-bold text-gray-700">Thông tin công ty</span>
                        </div>

                        <h3 className="font-bold text-lg mb-2">
                            {job.employerId.companyProfile?.companyName || job.employerId.name}
                        </h3>

                        <p className="text-sm text-gray-500 mb-6 line-clamp-3">
                            {job.employerId.companyProfile?.description ||
                                'Công ty chưa cập nhật mô tả...'}
                        </p>

                        <Link
                            to={`/companies/${job.employerId._id}`}
                            className="block w-full py-2 text-center border border-blue-600 text-blue-600 font-medium rounded-lg hover:bg-blue-50 transition mb-3"
                        >
                            Xem trang công ty
                        </Link>

                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="block w-full py-3 text-center bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 shadow-lg transition transform hover:scale-105"
                        >
                            Ứng tuyển ngay
                        </button>

                        {/* Các tag nhỏ bên dưới */}
                        <div className=" pt-6 border-t border-gray-100 space-y-3">
                            <div className="flex items-center gap-3 text-sm text-gray-600">
                                <Clock size={16} className="text-gray-400" />
                                <span>Loại hình: {job.jobType}</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-gray-600">
                                <Calendar size={16} className="text-gray-400" />
                                <span>
                                    Ngày đăng: {new Date(job.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-gray-600 cursor-pointer hover:text-red-500">
                                <Flag size={16} className="text-gray-400" />
                                <span>Báo cáo tin tuyển dụng</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal Ứng tuyển */}
            <ApplyModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                jobId={job._id}
                jobTitle={job.title}
            />
        </div>
    );
}

export default JobDetail;
