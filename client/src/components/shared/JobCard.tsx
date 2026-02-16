import { Link, useNavigate } from 'react-router-dom';
import { MapPin,Clock} from 'lucide-react';
import SaveJobButton from './SaveJobButton';
import { formatVNDText } from '../../utils/formatVNDText';

interface JobCardProps {
    job: {
        _id: string;
        title: string;
        employerId: {
            _id: string;
            name: string;
            companyProfile?: { logoUrl?: string; companyName: string; location: string };
        };
        salary: { from: number; to: number; currency: string };
        jobType: string;
        location: string;
        createdAt: string;
    };
}

function JobCard({ job }: JobCardProps) {
    const navigate = useNavigate();
    // Hàm tính thời gian đăng (VD: 2 ngày trước)
    const timeAgo = (dateString: string) => {
        const days = Math.floor(
            (new Date().getTime() - new Date(dateString).getTime()) / (1000 * 3600 * 24),
        );
        if (days === 0) return 'Hôm nay';
        return `${days} ngày trước`;
    };

    return (
        <div className="group bg-white rounded-xl border border-gray-200 hover:border-blue-300 p-5 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 relative">
            {/* 1. HEADER: Logo + Title */}
            <div className="flex gap-4 items-start">
                {/* Logo Box */}
                <div className="w-14 h-14 rounded-lg border border-gray-100 bg-white shadow-sm flex items-center justify-center overflow-hidden flex-shrink-0">
                    <img
                        src={
                            job.employerId.companyProfile?.logoUrl ||
                            'https://i0.wp.com/sbcf.fr/wp-content/uploads/2018/03/sbcf-default-avatar.png?ssl=1'
                        }
                        alt="Company Logo"
                        className="w-full h-full object-contain p-1"
                    />
                </div>

                {/* Title & Company */}
                <div className="flex-1 min-w-0">
                    {' '}
                    {/* min-w-0 giúp text truncate hoạt động */}
                    <Link to={`/jobs/${job._id}`}>
                        <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors truncate">
                            {job.title}
                        </h3>
                    </Link>
                    <p className="text-sm text-gray-500 font-medium truncate mt-1 hover:underline hover:cursor-pointer" onClick={() => navigate('/companies/' + job.employerId._id)}>
                        {job.employerId.name}
                    </p>
                </div>

                {/* Bookmark Button (Nút lưu) */}
                <SaveJobButton jobId={job._id} />
            </div>

            {/* 2. TAGS: Badges thông tin */}
            <div className="flex flex-wrap gap-2 mt-4">
                {/* Tag Loại việc làm */}
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                    {job.jobType}
                </span>

                {/* Tag Địa điểm */}
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200">
                    <MapPin size={12} /> {job.location}
                </span>

                {/* Tag Thời gian */}
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-50 text-orange-700 border border-orange-100">
                    <Clock size={12} /> {timeAgo(job.createdAt)}
                </span>
            </div>

            {/* 3. FOOTER: Lương & Button Apply */}
            <div className="flex items-center justify-between mt-5 pt-4 border-t border-gray-50">
                <div className="flex items-center gap-1 text-green-600 font-bold text-base">
                    {formatVNDText(job.salary.from)} - {formatVNDText(job.salary.to)} VND
                </div>

                <Link
                    to={`/jobs/${job._id}`}
                    className="text-sm font-medium text-gray-500 hover:text-blue-600 flex items-center gap-1 group/btn"
                >
                    Xem chi tiết
                    <span className="transition-transform group-hover/btn:translate-x-1">→</span>
                </Link>
            </div>

            {/* Badge "MỚI" nếu job đăng dưới 3 ngày */}
            {timeAgo(job.createdAt) === 'Hôm nay' || parseInt(timeAgo(job.createdAt)) < 3 ? (
                <div className="absolute top-0 right-0 -mt-2 -mr-2 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-sm z-10 animate-bounce">
                    HOT
                </div>
            ) : null}
        </div>
    );
}

export default JobCard;
