import { useEffect, useState } from 'react';
import axiosClient from '../api/axiosClient';
import SearchFilter from '../components/shared/SearchFilter';
import JobSkeleton from '../components/shared/JobSkeleton';
import JobCard from '../components/shared/JobCard';

interface Job {
    _id: string;
    title: string;
    employerId: {
        _id: string;
        name: string;
        companyProfile?: { companyName: string; location: string };
    };
    salary: { from: number; to: number; currency: string };
    jobType: string;
    location: string;
    createdAt: string;
}

function Home() {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);

    // const { isAuthenticated } = useAuthStore(); // Lấy trạng thái đăng nhập
   // const navigate = useNavigate();

    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [filterParams, setFilterParams] = useState({
        search: '',
        location: '',
        // jobType: '' (nếu muốn thêm)
    });

    // Gọi API lấy danh sách Job
    useEffect(() => {
        // Tạo Query String từ object filterParams
        const query = new URLSearchParams({
            page: page.toString(),
            limit: '5',
            ...filterParams, // Bung hết các tham số tìm kiếm vào đây
        }).toString();
        // console.log(query)
        axiosClient
            .get(`/jobs?${query}`)
            .then((res) => {
                setJobs(res.data.jobs);
                setTotalPages(res.data.pagination.totalPages);
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setLoading(false);
            });
    }, [page, filterParams]);
    // Hàm nhận dữ liệu từ SearchFilter khi user bấm nút
    const handleSearch = (data: any) => {
        setFilterParams(data);
        setPage(1);
    };
    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    }, [page]);

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setPage(newPage);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <div className="bg-blue-600 text-white py-16 text-center">
                <h1 className="text-4xl font-bold mb-4">Tìm kiếm công việc IT mơ ước</h1>
                <p className="text-lg">Hàng ngàn việc làm React, Node, TypeScript đang chờ bạn.</p>
            </div>

            {/* Job List */}
            <div className="max-w-5xl mx-auto px-4 py-10">
                <SearchFilter onSearch={handleSearch} />
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Việc làm mới nhất</h2>

                {loading ? (
                    <div className="grid gap-4 mt-8">
                        {[...Array(6)].map((_, i) => (
                            <JobSkeleton key={i} />
                        ))}
                    </div>
                ) : jobs.length === 0 ? (
                    <div className="text-center border-2 border-dashed border-gray-300 p-10 rounded-lg">
                        <p className="text-gray-500 mb-2">Chưa có công việc nào được đăng.</p>
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {jobs.map((job) => (
                            <JobCard job={job} key={job._id} />
                        ))}
                    </div>
                )}
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
    );
}

export default Home;
