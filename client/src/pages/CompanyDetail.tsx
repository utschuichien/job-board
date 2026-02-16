import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import { Globe, MapPin, Mail, Building2, ExternalLink, ArrowLeft } from 'lucide-react';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import { formatVNDText } from '../utils/formatVNDText';

interface Company {
    _id: string;
    name: string;
    email: string;
    companyProfile: {
        companyName?: string;
        website?: string;
        location?: string;
        description?: string;
        logoUrl?: string;
    };
}

interface Job {
    _id: string;
    title: string;
    location: string;
    salary: { from: number; to: number };
    jobType: string;
    createdAt: string;
}

function CompanyDetail() {
    const { id } = useParams();
    const [company, setCompany] = useState<Company | null>(null);
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Gọi song song 2 API cho nhanh
                const [companyRes, jobsRes] = await Promise.all([
                    axiosClient.get(`/users/companies/${id}`),
                    axiosClient.get(`/jobs/employer/${id}`),
                ]);

                setCompany(companyRes.data);
                setJobs(jobsRes.data);
            } catch (error) {
                console.error('Lỗi tải dữ liệu', error);
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchData();
    }, [id]);

    if (loading) return <LoadingSpinner />;
    if (!company) return <div className="text-center py-20">Không tìm thấy công ty</div>;

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* HEADER BANNER */}
            <div className="bg-slate-900 text-white py-16">
                <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center gap-8">
                    {/* Logo */}
                    <div className="w-32 h-32 bg-white rounded-xl flex items-center justify-center p-2 shadow-lg shrink-0">
                        <img
                            src={
                                company.companyProfile?.logoUrl ||
                                'https://i0.wp.com/sbcf.fr/wp-content/uploads/2018/03/sbcf-default-avatar.png?ssl=1'
                            }
                            alt="Logo"
                            className="max-w-full max-h-full object-contain"
                        />
                    </div>

                    {/* Info */}
                    <div className="text-center md:text-left flex-grow">
                        <h1 className="text-3xl font-bold mb-2">
                            {company.companyProfile?.companyName || company.name}
                        </h1>

                        <div className="flex flex-wrap justify-center md:justify-start gap-4 text-slate-300 text-sm mt-4">
                            {company.companyProfile?.location && (
                                <span className="flex items-center gap-1">
                                    <MapPin size={16} /> {company.companyProfile.location}
                                </span>
                            )}
                            {company.companyProfile?.website && (
                                <a
                                    href={company.companyProfile.website}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex items-center gap-1 hover:text-white hover:underline"
                                >
                                    <Globe size={16} /> Website
                                </a>
                            )}
                            <span className="flex items-center gap-1">
                                <Mail size={16} /> {company.email}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* CONTENT GRID */}
            <div className="max-w-6xl mx-auto px-4 mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* LEFT: Giới thiệu */}
                <div className="lg:col-span-2 space-y-8">
                    {/* About Section */}
                    <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <Building2 className="text-blue-600" /> Về chúng tôi
                        </h2>
                        <div className="prose text-gray-600 whitespace-pre-line leading-relaxed">
                            {company.companyProfile?.description ||
                                'Công ty chưa cập nhật mô tả...'}
                        </div>
                    </div>

                    {/* Jobs Section */}
                    <div className="bg-white p-6 rounded-xl border">
                        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                            Việc làm đang tuyển ({jobs.length})
                        </h2>

                        {jobs.length > 0 ? (
                            <div className="grid gap-4">
                                {jobs.map((job) => (
                                    <div
                                        key={job._id}
                                        className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition group"
                                    >
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <Link
                                                    to={`/jobs/${job._id}`}
                                                    className="text-lg font-bold text-gray-800 group-hover:text-blue-600 transition"
                                                >
                                                    {job.title}
                                                </Link>
                                                <div className="flex gap-3 text-sm text-gray-500 mt-2">
                                                    <span className="bg-gray-100 px-2 py-1 rounded">
                                                        {job.jobType}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <MapPin size={14} /> {job.location}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-emerald-600 font-bold">
                                                    {formatVNDText(job.salary.from)} -{' '}
                                                    {formatVNDText(job.salary.to)} VND
                                                </p>
                                                <p className="text-xs text-gray-400 mt-1">
                                                    {new Date(job.createdAt).toLocaleDateString()} 
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500 italic">
                                Hiện tại chưa có vị trí nào đang mở.
                            </p>
                        )}
                    </div>
                </div>

                {/* RIGHT: Sidebar Info (Có thể thêm thông tin khác sau này) */}
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 sticky top-24">
                        <h3 className="font-semibold text-gray-800 mb-4">Thông tin liên hệ</h3>

                        <div className="space-y-4 text-sm text-gray-600">
                            <p className="flex items-start gap-3">
                                <MapPin size={18} className="text-gray-400 shrink-0 mt-0.5" />
                                <span>{company.companyProfile?.location || 'Chưa cập nhật'}</span>
                            </p>
                            {company.companyProfile?.website && (
                                <a
                                    href={company.companyProfile?.website}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex items-start gap-3 hover:text-blue-600"
                                >
                                    <Globe size={18} className="text-gray-400 shrink-0 mt-0.5" />
                                    <span className="truncate">
                                        {company.companyProfile?.website}
                                    </span>
                                    <ExternalLink size={14} className="mt-0.5" />
                                </a>
                            )}
                            <p className="flex items-center gap-3">
                                <Mail size={18} className="text-gray-400 shrink-0" />
                                <a href={`mailto:${company.email}`} className="hover:text-blue-600">
                                    {company.email}
                                </a>
                            </p>
                        </div>

                        <div className="mt-6 pt-6 border-t border-gray-100">
                            <Link
                                to="/"
                                className="btn-secondary w-full flex items-center justify-center gap-2 bg-blue-600 text-white hover:bg-blue-700"
                            >
                                <ArrowLeft size={16} /> Quay lại tìm việc
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CompanyDetail;
