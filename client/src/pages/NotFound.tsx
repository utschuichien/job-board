import { Link } from 'react-router-dom';

function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
            <h1 className="text-9xl font-bold text-blue-100">404</h1>
            <h2 className="text-2xl font-bold text-gray-800 mt-4">Trang không tồn tại</h2>
            <p className="text-gray-500 mt-2 mb-8">
                Đường dẫn bạn truy cập có thể bị hỏng hoặc đã bị xóa.
            </p>
            <Link to="/" className="btn-primary">
                Trở về trang chủ
            </Link>
        </div>
    );
}

export default NotFound;
