import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import { notify } from '../utils/toast';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import { VIETNAM_PROVINCES } from '../data/provinces';
import TiptapEditor from '../components/shared/TiptapEditor';
import VndInput from '../components/shared/VndInput';

function EditJob() {
    const { id } = useParams();
    const navigate = useNavigate();
    const {
        control,
        register,
        handleSubmit,
        reset,
        setValue,
        watch,
        formState: { isSubmitting, errors},
    } = useForm();
    const [loading, setLoading] = useState(true);
    const descriptionContent = watch('description');

    // 1. Load dữ liệu cũ lên Form
    useEffect(() => {
        axiosClient
            .get(`/jobs/${id}`)
            .then((res) => {
                const job = res.data;
                reset({
                    title: job.title,
                    location: job.location,
                    level: job.level,
                    salaryFrom: job.salary.from,
                    salaryTo: job.salary.to,
                    jobType: job.jobType,
                    requirements: job.requirements.join(', '), // Chuyển mảng thành chuỗi để hiển thị
                    description: job.description,
                    deadline: job.deadline ? job.deadline.split('T')[0] : '', // Format ngày YYYY-MM-DD
                });
                setLoading(false);
            })
            .catch(() => {
                notify.error('Không tìm thấy job');
                navigate('/employer/dashboard');
            });
    }, [id, reset, navigate]);

    // 2. Xử lý khi bấm Lưu
    const onSubmit = async (data: any) => {
        try {
            const payload = {
                ...data,
                salary: {
                    from: Number(data.salaryFrom),
                    to: Number(data.salaryTo),
                    currency: 'VND',
                    negotiable: false,
                },
                requirements: data.requirements.split(',').map((req: string) => req.trim()),
                deadline: new Date(data.deadline),
            };

            await axiosClient.put(`/jobs/${id}`, payload);

            notify.success('Cập nhật thành công!');
            navigate('/employer/dashboard');
        } catch (error: any) {
            notify.error('Lỗi khi cập nhật job');
        }
    };

    if (loading) return <LoadingSpinner />;

    return (
        <div className="min-h-screen bg-gray-50 pb-10">
            <div className="max-w-3xl mx-auto mt-10 bg-white p-8 rounded-lg shadow">
                <h1 className="text-2xl font-bold text-gray-800 mb-6">Chỉnh sửa tin tuyển dụng</h1>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* Tiêu đề */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Tiêu đề công việc
                        </label>
                        <input
                            {...register('title', { required: true })}
                            className="input-field mt-1"
                        />
                    </div>

                    {/* Địa điểm & Level */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Địa điểm
                            </label>
                            <select
                                {...register('location', { required: true })}
                                className="input-field mt-1 cursor-pointer"
                            >
                                <option value="">Chọn tỉnh thành</option>
                                <option value="Remote">Remote (Làm từ xa)</option>
                                {VIETNAM_PROVINCES.map((province) => (
                                    <option key={province} value={province}>
                                        {province}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Level</label>
                            <select {...register('level')} className="input-field mt-1">
                                <option value="Intern">Intern</option>
                                <option value="Junior">Junior</option>
                                <option value="Middle">Middle</option>
                                <option value="Senior">Senior</option>
                                <option value="Lead">Lead</option>
                            </select>
                        </div>
                    </div>

                    {/* Lương */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Lương từ (VND)
                            </label>
                            {/* <input
                                type="number"
                                {...register('salaryFrom', { required: true })}
                                className="input-field mt-1"
                            /> */}
                            <VndInput name="salaryFrom" control={control} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Đến (VND)
                            </label>
                            <VndInput name="salaryTo" control={control} />
                        </div>
                    </div>

                    {/* Loại hình */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Loại hình</label>
                        <select {...register('jobType')} className="input-field mt-1">
                            <option value="Full-time">Full-time</option>
                            <option value="Part-time">Part-time</option>
                            <option value="Remote">Remote</option>
                            <option value="Hybrid">Hybrid</option>
                        </select>
                    </div>

                    {/* Yêu cầu */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Kỹ năng yêu cầu (phân cách bằng dấu phẩy)
                        </label>
                        <input {...register('requirements')} className="input-field mt-1" />
                    </div>

                    {/* Mô tả */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Mô tả chi tiết
                        </label>
                        <input
                            type="hidden"
                            {...register('description', { required: 'Vui lòng nhập mô tả' })}
                        />

                        <TiptapEditor
                            // Truyền giá trị hiện tại vào (lúc đầu là undefined, sau khi API về sẽ là HTML)
                            value={descriptionContent || ''}
                            // Khi sửa nội dung -> cập nhật lại form
                            onChange={(val) =>
                                setValue('description', val, { shouldValidate: true })
                            }
                            error={errors.description?.message as string}
                        />
                    </div>

                    {/* Deadline */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Hạn nộp hồ sơ
                        </label>
                        <input
                            type="date"
                            {...register('deadline', { required: true })}
                            className="input-field mt-1"
                        />
                    </div>

                    {/* Nút Action */}
                    <div className="flex gap-4 pt-4 border-t">
                        <button
                            type="button"
                            onClick={() => navigate('/employer/dashboard')}
                            className="w-1/3 btn-secondary" // Dùng class btn-secondary từ file index.css
                        >
                            Hủy bỏ
                        </button>
                        <button type="submit" disabled={isSubmitting} className="w-2/3 btn-primary">
                            {isSubmitting ? 'Đang lưu...' : 'Lưu Thay Đổi'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default EditJob;
