import { useForm } from 'react-hook-form';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import { useAuthStore } from '../store/useAuthStore';
import ButtonSpiner from '../components/shared/ButtonSpiner';
import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { notify } from '../utils/toast';


function Login() {
    const navigate = useNavigate();
    const location = useLocation();
    const [showPassword, setShowPassword] = useState(false);
    const { login } = useAuthStore();
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        setError,
    } = useForm();
    const fromLocation = (location.state as any)?.from?.pathname || '/';
    const onSubmit = async (data: any) => {
        try {
            const response = await axiosClient.post('/auth/login', data);
            login(response.data, response.data.token);
            console.log('Logged in user:', response.data);
            navigate(fromLocation, { replace: true });
        } catch (error: any) {
            console.error('Login Failed:', error);
            const message = error.response?.data?.message || 'Có lỗi xảy ra';
            setError('root', { message });
        }
    };

    const handleGoogleSuccess = async (credentialResponse: any) => {
        try {
            // credentialResponse.credential chính là cái Token từ Google
            const res = await axiosClient.post('/auth/google', {
                token: credentialResponse.credential,
            });
            login(res.data.user, res.data.token);

            notify.success('Đăng nhập Google thành công!');
            navigate('/'); // Hoặc chuyển hướng về trang trước đó
        } catch (error) {
            console.error(error);
            notify.error('Lỗi đăng nhập Google');
        }
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-center text-blue-600 mb-6">Đăng Nhập</h2>

                {/* Form bắt đầu */}
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {/* Email Input */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            {...register('email', {
                                required: 'Email là bắt buộc',
                                pattern: { value: /^\S+@\S+$/i, message: 'Email không hợp lệ' },
                            })}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            placeholder="admin@example.com"
                        />
                        {errors.email && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.email.message as string}
                            </p>
                        )}
                    </div>

                    {/* Password Input */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Mật khẩu</label>

                        <div className="relative mt-1">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                {...register('password', {
                                    required: 'Vui lòng nhập mật khẩu',
                                    minLength: { value: 6, message: 'Mật khẩu tối thiểu 6 ký tự' },
                                })}
                                className="block w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm 
                                focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                placeholder="••••••"
                            />

                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600"
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>

                        {errors.password && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.password.message as string}
                            </p>
                        )}
                    </div>

                    {/* Lỗi chung từ Server (nếu sai pass) */}
                    {errors.root && (
                        <div className="text-red-500 text-sm text-center bg-red-50 p-2 rounded">
                            {errors.root.message as string}
                        </div>
                    )}

                    {/* Button Submit */}
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none ${
                            isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                    >
                        {isSubmitting ? (
                            <>
                                {' '}
                                <ButtonSpiner />
                                <span className="ml-2"> Đang đăng nhập...</span>
                            </>
                        ) : (
                            'Đăng Nhập'
                        )}
                    </button>
                </form>
                <div className="mt-4">
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-gray-300" />
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="bg-white px-2 text-gray-500">Hoặc tiếp tục với</span>
                        </div>
                    </div>

                    <div className="mt-4 flex justify-center">
                        
                        <GoogleLogin
                            onSuccess={handleGoogleSuccess}
                            onError={() => {
                                notify.error('Đăng nhập thất bại');
                            }}
                            useOneTap 
                        />
                    </div>
                </div>
                <div className="text-sm mt-2 flex justify-center">
                    <Link
                        to="/forgot-password"
                        className="font-medium text-blue-600 hover:text-blue-500"
                    >
                        Quên mật khẩu?
                    </Link>
                </div>
                <p className="mt-4 text-center text-sm text-gray-600">
                    Chưa có tài khoản?{' '}
                    <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500">
                        Đăng ký ngay
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default Login;
