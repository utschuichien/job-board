import { useForm } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import { notify as toast } from '../utils/toast';
import { ShieldCheck, RefreshCw } from 'lucide-react';
import ButtonSpiner from '../components/shared/ButtonSpiner';
import { useEffect, useState } from 'react';


function VerifyOTP() {
    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email; 
    const [countdown, setCountdown] = useState(60);
    const [isResending, setIsResending] = useState(false);

    const {
        register,
        handleSubmit,
        setError,
        formState: { isSubmitting, errors },
    } = useForm();


    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [countdown]);


    const handleResendOtp = async () => {
        if (countdown > 0) return; // Chặn nếu chưa hết giờ

        setIsResending(true);
        try {
            // Gọi lại API forgot-password để tạo mã mới
            await axiosClient.post('/auth/forgot-password', { email });

            toast.success('Mã mới đã được gửi vào email!');
            setCountdown(60); // Reset bộ đếm về 60s
        } catch (error: any) {
            toast.error('Không thể gửi lại mã. Vui lòng thử lại sau.');
        } finally {
            setIsResending(false);
        }
    };

    const onSubmit = async (data: any) => {
        try {
            // Gọi API kiểm tra xem OTP đúng chưa
            await axiosClient.post('/auth/verify-otp', {
                email: email,
                otp: data.otp,
            });

            toast.success('Xác thực thành công!');
            navigate('/reset-password', {
                state: { email: email, otp: data.otp },
            });
        } catch (error: any) {
            const message = error.response?.data?.message || 'Mã OTP không hợp lệ';

            setError('otp', {
                type: 'manual',
                message: message,
            });
        }
    };

    if (!email)
        return (
            <div className="text-center mt-10">Lỗi: Không tìm thấy email. Vui lòng thử lại.</div>
        );

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="mx-auto w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                    <ShieldCheck className="text-indigo-600" size={24} />
                </div>
                <h2 className="mt-4 text-center text-3xl font-extrabold text-gray-900">
                    Nhập mã xác thực
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                    Chúng tôi đã gửi mã 6 số đến <b>{email}</b>
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Mã OTP
                            </label>
                            <input
                                {...register('otp', { required: true, minLength: 6, maxLength: 6 })}
                                className="input-field text-center text-2xl font-bold tracking-[0.5em] h-14"
                                placeholder="000000"
                                maxLength={6}
                                autoFocus
                                onInput={(e) => {
                                    e.currentTarget.value = e.currentTarget.value.replace(
                                        /[^0-9]/g,
                                        '',
                                    );
                                }}
                            />
                            {errors.otp && (
                                <p className="mt-2 text-sm text-red-600 text-center font-medium ">
                                    {errors.otp.message as string}
                                </p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full btn-primary"
                        >
                            {isSubmitting ? (
                                <>
                                    {' '}
                                    <ButtonSpiner />
                                    <span className="ml-2"> Đang xác thực...</span>
                                </>
                            ) : (
                                'Xác thực'
                            )}
                        </button>
                        <div className="mt-6">
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-300" />
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-2 bg-white text-gray-500">
                                        Bạn chưa nhận được mã?
                                    </span>
                                </div>
                            </div>

                            <div className="mt-4 text-center">
                                <button
                                    type="button"
                                    onClick={handleResendOtp}
                                    disabled={countdown > 0 || isResending}
                                    className={`flex items-center justify-center gap-2 w-full text-sm font-medium transition-colors
                            ${
                                countdown > 0
                                    ? 'text-gray-400 cursor-not-allowed'
                                    : 'text-blue-600 hover:text-blue-500 hover:underline'
                            }
                        `}
                                >
                                    {isResending ? (
                                        <>
                                            {' '}
                                            <ButtonSpiner />
                                            <span className="ml-2"> Đang gửi lại...</span>
                                        </>
                                    ) : countdown > 0 ? (
                                        `Gửi lại sau ${countdown}s`
                                    ) : (
                                        <>
                                            <RefreshCw size={16} /> Gửi lại mã mới
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default VerifyOTP;
