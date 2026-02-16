import { Bookmark } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import axiosClient from '../../api/axiosClient';
import { notify } from '../../utils/toast';

interface SaveJobButtonProps {
    jobId: string;
}

function SaveJobButton({ jobId }: SaveJobButtonProps) {
    const { user, updateUser } = useAuthStore();

    // Kiểm tra xem job này có nằm trong danh sách đã lưu của user không
    // (Cần ép kiểu user.savedJobs về mảng string để so sánh an toàn)
    const isSaved = user?.savedJobs?.includes(jobId);

    const handleToggle = async (e: React.MouseEvent) => {
        e.stopPropagation(); // Ngăn chặn click lan ra ngoài (để không bị nhảy vào trang chi tiết)

        if (!user) {
            notify.warning("Vui lòng đăng nhập để sử dụng tính năng này");
            return;
        }

        try {
            // Gọi API Toggle
            await axiosClient.post(`/users/saved-jobs/${jobId}`);

            // Cập nhật Store ngay lập tức để giao diện đổi màu (Optimistic UI)
            let newSavedJobs = user.savedJobs ? [...user.savedJobs] : [];

            if (isSaved) {
                newSavedJobs = newSavedJobs.filter((id) => id !== jobId); // Xóa ID ra
                notify.success('Đã bỏ lưu');
            } else {
                newSavedJobs.push(jobId); // Thêm ID vào
                notify.success('Đã lưu vào danh sách yêu thích');
            }
            updateUser({ ...user, savedJobs: newSavedJobs });
        } catch (error) {
            notify.error('Lỗi kết nối');
        }
    };

    return (
        <button
            onClick={handleToggle}
            className={`p-2 rounded-full transition-colors hover:bg-red-50 ${
                isSaved ? 'text-red-500 bg-red-50' : 'text-gray-400'
            }`}
            title={isSaved ? 'Bỏ lưu' : 'Lưu công việc này'}
        >
            <Bookmark size={20} fill={isSaved ? 'currentColor' : 'none'} />
        </button>
    );
}

export default SaveJobButton;
