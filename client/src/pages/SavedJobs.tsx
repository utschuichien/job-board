import { useEffect, useState } from 'react';
import axiosClient from '../api/axiosClient';
import SaveJobButton from '../components/shared/SaveJobButton';
import { Link } from 'react-router-dom';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import { ArrowLeft, Bookmark, DollarSign, MapPin } from 'lucide-react';

function SavedJobs() {
    const [jobs, setJobs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axiosClient
            .get('/users/saved-jobs')
            .then((res) => {
                setJobs(res.data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    // Hàm xóa job khỏi danh sách (khi user bỏ tim ở trang này)
    const removeJobFromList = (jobId: string) => {
        setJobs((prev) => prev.filter((job) => job._id !== jobId));
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {loading ? (
                <LoadingSpinner />
            ) : (
                <div className="max-w-5xl mx-auto py-10 px-4">
                    <div className="mb-8">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-blue-600 rounded-lg">
                                <Bookmark className="w-6 h-6 text-white fill-white " />
                            </div>
                            <h1 className="text-3xl font-bold text-gray-900">Công việc đã lưu</h1>
                        </div>
                        <p className="text-gray-600">
                            Danh sách công việc đã lưu của bạn
                        </p>
                    </div>
                    <div className="inline-block mb-6">
                        <Link to="/" className="flex items-end justify-center hover:text-blue-600">
                            <ArrowLeft className="mr-2 translate-y-[1px]" />
                            Quay lại danh sách công việc
                        </Link>
                    </div>
                    {jobs.length === 0 ? (
                        <div className="text-center py-20 bg-white rounded-lg shadow-sm">
                            <p className="text-gray-500 mb-4">Bạn chưa lưu công việc nào.</p>
                            <Link to="/" className="btn-primary inline-block">
                                Tìm việc ngay
                            </Link>
                        </div>
                    ) : (
                        <div className="grid gap-4">
                            {jobs.map((job) => (
                                <div
                                    key={job._id}
                                    className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex justify-between items-start"
                                >
                                    <div>
                                        <h3 className="text-xl font-bold text-blue-600">
                                            <Link to={`/jobs/${job._id}`}>{job.title}</Link>
                                        </h3>
                                        <p className="text-gray-600 font-medium mt-1">
                                            {job.employerId?.companyProfile?.companyName ||
                                                job.employerId?.name}
                                        </p>
                                        <div className="flex gap-3 mt-2 text-sm text-gray-500">
                                            <span className="bg-gray-100 px-2 py-1 flex justify-center items-center gap-1.5">
                                                {' '}
                                                <MapPin className="w-4 h-4" />
                                                {job.location}
                                            </span>
                                            <span className="bg-gray-100 px-2 py-1 flex justify-center items-center gap-1.5">
                                                <DollarSign className="w-4 h-4" />
                                                {job.salary.from} - {job.salary.to}{' '}
                                                {job.salary.currency}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Vì trang này là danh sách đã lưu, nên SaveJobButton sẽ luôn đỏ. 
                      Tuy nhiên, ta có thể custom logic để khi bấm vào nó sẽ biến mất khỏi danh sách */}
                                    <div onClick={() => removeJobFromList(job._id)}>
                                        <SaveJobButton jobId={job._id} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default SavedJobs;
