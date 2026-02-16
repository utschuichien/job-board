import { useForm } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import { notify as toast } from '../utils/toast';
import { Lock } from 'lucide-react';
import ButtonSpiner from '../components/shared/ButtonSpiner';

function ResetPassword() {
    const navigate = useNavigate();
    const location = useLocation();
    // Lấy dữ liệu được truyền sang từ VerifyOTP
    const { email, otp } = location.state || {};

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors, isSubmitting },
    } = useForm();
    const password = watch('password');

    const onSubmit = async (data: any) => {
        try {
            // Gửi request đổi pass (Backend sẽ check OTP lại 1 lần nữa cho chắc)
            await axiosClient.post('/auth/reset-password', {
                email,
                otp,
                password: data.password,
            });

            toast.success('Đổi mật khẩu thành công! Đăng nhập ngay.');
            navigate('/login');
        } catch (error: any) {
            toast.error('Lỗi khi đổi mật khẩu.');
        }
    };

    if (!email || !otp)
        return <div className="text-center mt-10">Phiên làm việc hết hạn. Vui lòng làm lại.</div>;

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <Lock className="text-green-600" size={24} />
                </div>
                <h2 className="mt-4 text-center text-3xl font-extrabold text-gray-900">
                    Tạo mật khẩu mới
                </h2>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Mật khẩu mới
                            </label>
                            <input
                                type="password"
                                {...register('password', {
                                    required: 'Nhập mật khẩu',
                                    minLength: { value: 6, message: 'Tối thiểu 6 ký tự' },
                                })}
                                className="input-field"
                            />
                            {errors.password && (
                                <p className="text-red-500 text-xs mt-1">
                                    {errors.password.message as string}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Nhập lại mật khẩu
                            </label>
                            <input
                                type="password"
                                {...register('confirmPassword', {
                                    required: true,
                                    validate: (val) => val === password || 'Mật khẩu không khớp',
                                })}
                                className="input-field"
                            />
                            {errors.confirmPassword && (
                                <p className="text-red-500 text-xs mt-1">
                                    {errors.confirmPassword.message as string}
                                </p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full btn-primary bg-green-600 hover:bg-green-700"
                        >
                            {isSubmitting ? (
                                <>
                                    {' '}
                                    <ButtonSpiner />
                                    <span className="ml-2"> Đang lưu...</span>
                                </>
                            ) : (
                                'Lưu mật khẩu'
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default ResetPassword;
