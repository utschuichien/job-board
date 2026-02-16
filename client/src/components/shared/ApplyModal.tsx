import { useForm } from 'react-hook-form';
import axiosClient from '../../api/axiosClient';
import { notify } from '../../utils/toast';


interface ApplyModalProps {
    isOpen: boolean;
    onClose: () => void;
    jobId: string;
    jobTitle: string;
}

function ApplyModal({ isOpen, onClose, jobId, jobTitle }: ApplyModalProps) {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm();

    if (!isOpen) return null;

    const onSubmit = async (data: any) => {
        try {
            // QUAN TRỌNG: Khi upload file, phải dùng FormData chứ không gửi JSON được
            const formData = new FormData();
            formData.append('cv', data.cv[0]); // 'cv' phải trùng với tên trong upload.single('cv') ở Backend

            await axiosClient.post(`/jobs/${jobId}/apply`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            notify.success('Nộp hồ sơ thành công! Chúc bạn may mắn');
            onClose(); 
        } catch (error: any) {
            notify.error(error.response?.data?.message || 'Lỗi khi nộp đơn');
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-xl">
                <h2 className="text-xl font-bold mb-4">
                    Ứng tuyển: <span className="text-blue-600">{jobTitle}</span>
                </h2>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Upload CV của bạn (PDF)
                        </label>
                        <input
                            type="file"
                            accept=".pdf,.doc,.docx"
                            {...register('cv', { required: 'Vui lòng chọn file CV' })}
                            className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100"
                        />
                        {errors.cv && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.cv.message as string}
                            </p>
                        )}
                    </div>

                    <div className="flex justify-end space-x-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-600 hover:text-gray-800"
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                        >
                            {isSubmitting ? 'Đang gửi...' : 'Nộp hồ sơ'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default ApplyModal;
