import { Navigate, Outlet, useLocation } from 'react-router-dom'
import LoadingSpinner from './LoadingSpinner';
import { useAuthStore } from '../../store/useAuthStore';

// Định nghĩa props: cho phép truyền vào danh sách role được phép truy cập
interface ProtectedRouteProps {
  allowedRoles?: string[]; // Ví dụ: ['employer'] hoặc ['candidate', 'admin']
}

const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
 const { user, isAuthenticated, loading } = useAuthStore(); 
  const location = useLocation();

  // 1. Nếu đang tải thông tin user (ví dụ F5 trang), hiện loading xoay xoay
  // Nếu không có cái này, user sẽ bị đá về Login oan uổng khi vừa F5
  if (loading) {
    return <LoadingSpinner />;
  }

  // 2. Nếu chưa đăng nhập -> Đá về trang Login
  if (!isAuthenticated || !user) {
      // state={{ from: location }} giúp nhớ trang họ muốn vào
      // Để sau khi login xong, ta redirect họ quay lại đúng trang đó
      return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 3. Nếu đã đăng nhập nhưng Role không khớp (Ví dụ: Candidate cố vào trang Employer)
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Đá về trang 403 hoặc trang chủ
    return <Navigate to="/" replace />; 
  }

  // 4. Nếu thỏa mãn tất cả -> Cho phép hiển thị các Route con bên trong
  return <Outlet />;
};

export default ProtectedRoute;