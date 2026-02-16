import { useForm } from 'react-hook-form';
import { Link, useNavigate} from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import { notify } from '../utils/toast';
import { Mail, ArrowLeft, KeyRound } from 'lucide-react';


function ForgotPassword() {
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm();

    const onSubmit = async (data: any) => {
        try {
            await axiosClient.post('/auth/forgot-password', data);
            notify.success('Email đã được gửi! Hãy kiểm tra hộp thư của bạn.');
            navigate('/verify-otp', { state: { email: data.email } });
        } catch (error: any) {
            notify.error(error.response?.data?.message || 'Không thể gửi email. Vui lòng thử lại.');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <KeyRound className="text-blue-600" size={24} />
                </div>
                <h2 className="mt-4 text-center text-3xl font-extrabold text-gray-900">
                    Quên mật khẩu?
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                    Đừng lo, chuyện này xảy ra thường xuyên mà. <br />
                    Nhập email của bạn để chúng tôi gửi link đặt lại mật khẩu.
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-gray-100">
                    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                        <div>
                            <label
                                htmlFor="email"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Địa chỉ Email
                            </label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    {...register('email', {
                                        required: 'Vui lòng nhập email',
                                        pattern: {
                                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                            message: 'Email không hợp lệ',
                                        },
                                    })}
                                    className="input-field pl-10"
                                    placeholder="name@example.com"
                                />
                            </div>
                            {errors.email && (
                                <p className="text-red-500 text-xs mt-1">
                                    {errors.email.message as string}
                                </p>
                            )}
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                            >
                                {isSubmitting ? 'Đang gửi...' : 'Gửi OTP đặt lại mật khẩu'}
                            </button>
                        </div>
                    </form>

                    <div className="mt-6">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white text-gray-500">Hoặc</span>
                            </div>
                        </div>

                        <div className="mt-6 flex justify-center">
                            <Link
                                to="/login"
                                className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition"
                            >
                                <ArrowLeft size={16} /> Quay lại đăng nhập
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ForgotPassword;
