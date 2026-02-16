import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import { toast } from 'sonner';
import ButtonSpinner from '../components/shared/ButtonSpiner';

function Register() {
    const navigate = useNavigate();

    // 1. Khai báo form với các field cần thiết
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        setError,
        watch,
    } = useForm();

    // Theo dõi giá trị password để làm chức năng "Nhập lại mật khẩu" (Optional)
    const password = watch('password');

    const onSubmit = async (data: any) => {
        try {
            // Xóa field confirmPassword trước khi gửi lên Server (Server không cần cái này)
            const { confirmPassword, ...registerData } = data;

            await axiosClient.post('/auth/register', registerData);

           toast.success('Đăng ký thành công! Hãy đăng nhập nhé 🚀', {
                style: {
                    background: 'green',
                    color: 'white',
                }
           });
            navigate('/login'); // Chuyển hướng sang trang Login
        } catch (error: any) {
            console.error('Register Failed:', error);
            const message = error.response?.data?.message || 'Đăng ký thất bại';
            setError('root', { message });
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 py-10">
            <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-center text-blue-600 mb-6">
                    Tạo Tài Khoản Mới
                </h2>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {/* 1. Họ và tên */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Họ và Tên</label>
                        <input
                            {...register('name', {
                                required: 'Vui lòng nhập họ tên',
                                minLength: { value: 2, message: 'Tên quá ngắn' },
                            })}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Nguyễn Văn A"
                        />
                        {errors.name && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.name.message as string}
                            </p>
                        )}
                    </div>

                    {/* 2. Email */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            {...register('email', {
                                required: 'Vui lòng nhập Email',
                                pattern: { value: /^\S+@\S+$/i, message: 'Email không hợp lệ' },
                            })}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            placeholder="email@example.com"
                        />
                        {errors.email && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.email.message as string}
                            </p>
                        )}
                    </div>

                    {/* 3. Mật khẩu */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Mật khẩu</label>
                        <input
                            type="password"
                            {...register('password', {
                                required: 'Vui lòng nhập mật khẩu',
                                minLength: { value: 6, message: 'Tối thiểu 6 ký tự' },
                            })}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        />
                        {errors.password && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.password.message as string}
                            </p>
                        )}
                    </div>

                    {/* 4. Nhập lại mật khẩu */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Xác nhận mật khẩu
                        </label>
                        <input
                            type="password"
                            {...register('confirmPassword', {
                                required: 'Vui lòng nhập lại mật khẩu',
                                validate: (value) => value === password || 'Mật khẩu không khớp',
                            })}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        />
                        {errors.confirmPassword && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.confirmPassword.message as string}
                            </p>
                        )}
                    </div>

                    {/* 5. Chọn vai trò (Role) - Quan trọng */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Bạn là ai?
                        </label>
                        <div className="flex space-x-4">
                            <label className="flex items-center space-x-2 cursor-pointer border p-3 rounded-lg w-1/2 has-[:checked]:border-blue-500 has-[:checked]:bg-blue-50">
                                <input
                                    type="radio"
                                    value="candidate"
                                    {...register('role')}
                                    defaultChecked
                                    className="text-blue-600 focus:ring-blue-500"
                                />
                                <span className="text-sm font-medium">Ứng viên</span>
                            </label>

                            <label className="flex items-center space-x-2 cursor-pointer border p-3 rounded-lg w-1/2 has-[:checked]:border-blue-500 has-[:checked]:bg-blue-50">
                                <input
                                    type="radio"
                                    value="employer"
                                    {...register('role')}
                                    className="text-blue-600 focus:ring-blue-500"
                                />
                                <span className="text-sm font-medium">Nhà tuyển dụng</span>
                            </label>
                        </div>
                    </div>

                    {/* Lỗi từ Server */}
                    {errors.root && (
                        <div className="text-red-500 text-sm text-center bg-red-50 p-2 rounded">
                            {errors.root.message as string}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none disabled:opacity-50"
                    >
                        {isSubmitting ? (
                            <>
                                {' '}
                                <ButtonSpinner />
                                <span className="ml-2"> Đang đăng ký...</span>
                            </>
                        ) : (
                            'Đăng Ký'
                        )}
                    </button>
                </form>

                <p className="mt-4 text-center text-sm text-gray-600">
                    Đã có tài khoản?{' '}
                    <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
                        Đăng nhập ngay
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default Register;
