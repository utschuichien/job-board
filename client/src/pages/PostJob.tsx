import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import { toast } from 'sonner';
import TiptapEditor from '../components/shared/TiptapEditor';
import { VIETNAM_PROVINCES } from '../data/provinces';
import VndInput from '../components/shared/VndInput';

function PostJob() {
    const navigate = useNavigate();
    const {
        control,
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors, isSubmitting },
    } = useForm();
    const description = watch('description');

    const onSubmit = async (data: any) => {
        try {
            // Format lại dữ liệu cho đúng cấu trúc Backend yêu cầu
            const payload = {
                ...data,
                // Backend đang chờ salary dạng object { from, to, currency }
                salary: {
                    from: Number(data.salaryFrom),
                    to: Number(data.salaryTo),
                    currency: 'VND', // Mặc định VND cho nhanh
                    negotiable: false,
                },
                // Chuyển requirements từ string (ngăn cách bởi dấu phẩy) sang mảng
                requirements: data.requirements.split(',').map((req: string) => req.trim()),
                deadline: new Date(data.deadline),
            };

            await axiosClient.post('/jobs', payload);

            toast.success('Đăng tin thành công! Hy vọng bạn sớm tìm được nhân tài 💎');
            navigate('/'); // Quay về trang chủ để xem thành quả
        } catch (error: any) {
            console.error(error);
            toast.error('Đăng tin thất bại. Vui lòng thử lại!');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-10">
            <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow">
                <h1 className="text-2xl font-bold text-gray-800 mb-6">Đăng Tin Tuyển Dụng Mới</h1>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* Tiêu đề */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Tiêu đề công việc
                        </label>
                        <input
                            {...register('title', { required: true })}
                            className="input-field w-full border p-2 rounded mt-1"
                            placeholder="Ví dụ: Senior React Developer"
                        />
                        {errors.title && (
                            <span className="text-red-500 text-sm">Cần có tiêu đề</span>
                        )}
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
                                <option value="Remote">Remote (Làm từ xa)</option>{' '}
                                {/* Thêm tùy chọn Remote */}
                                {VIETNAM_PROVINCES.map((province) => (
                                    <option key={province} value={province}>
                                        {province}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Level</label>
                            <select
                                {...register('level')}
                                className="w-full border p-2 rounded mt-1"
                            >
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
                        <select {...register('jobType')} className="w-full border p-2 rounded mt-1">
                            <option value="Full-time">Full-time</option>
                            <option value="Part-time">Part-time</option>
                            <option value="Remote">Remote</option>
                            <option value="Hybrid">Hybrid</option>
                        </select>
                    </div>

                    {/* Yêu cầu (Nhập nhanh) */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Kỹ năng yêu cầu (phân cách bằng dấu phẩy)
                        </label>
                        <input
                            {...register('requirements')}
                            className="w-full border p-2 rounded mt-1"
                            placeholder="React, Node.js, TypeScript"
                        />
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
                            value={description || ''}
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
                            className="w-full border p-2 rounded mt-1"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition"
                    >
                        {isSubmitting ? 'Đang đăng tin...' : 'Đăng Tin Ngay'}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default PostJob;
