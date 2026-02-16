import { useEffect, useState } from 'react';
import axiosClient from '../api/axiosClient';
import { FileText } from 'lucide-react';

function MyApplications() {
    const [applications, setApplications] = useState<any[]>([]);

    useEffect(() => {
        axiosClient
            .get('/users/my-applications')
            .then((res) => setApplications(res.data))
            .catch((err) => console.error(err));
    }, []);

    const getStatusBadge = (status: string) => {
        const styles: any = {
            pending: 'bg-yellow-100 text-yellow-800',
            interview: 'bg-blue-100 text-blue-800',
            hired: 'bg-green-100 text-green-800',
            rejected: 'bg-red-100 text-red-800',
        };
        return (
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${styles[status]}`}>
                {status.toUpperCase()}
            </span>
        );
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-5xl mx-auto py-10 px-4">
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-blue-600 rounded-lg">
                            <FileText className="w-6 h-6 text-white" />
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900">Lịch sử ứng tuyển</h1>
                    </div>
                    <p className="text-gray-600 ">
                        Theo dõi tiến trình các đơn ứng tuyển của bạn
                    </p>
                </div>

                <div className="bg-white shadow rounded-lg overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    Công việc
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    Công ty
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    Ngày nộp
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    Trạng thái
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {applications.map((app) => (
                                <tr key={app._id}>
                                    <td className="px-6 py-4 font-medium text-blue-600">
                                        {app.jobId?.title}
                                    </td>
                                    <td className="px-6 py-4">
                                        {app.jobId?.employerId?.companyProfile?.companyName ||
                                            'N/A'}
                                    </td>
                                    <td className="px-6 py-4 text-gray-500">
                                        {new Date(app.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4">{getStatusBadge(app.status)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {applications.length === 0 && (
                        <p className="p-6 text-center text-gray-500">
                            Bạn chưa ứng tuyển công việc nào.
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default MyApplications;
