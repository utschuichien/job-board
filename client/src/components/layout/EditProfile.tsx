import { Camera, X } from 'lucide-react';
import type { UseFormReturn } from 'react-hook-form';
import type { profileSchema } from '../../schemas/ProfileSchema';
import type z from 'zod';

type EditProfileForm = z.infer<typeof profileSchema>;

interface Props {
    form: UseFormReturn<EditProfileForm>;
    user: any;
    onSubmit: (data: EditProfileForm) => void;
    onCancel: () => void;
}

function EditProfile({ form, user, onSubmit, onCancel }: Props) {
    const {
        register,
        handleSubmit,
        formState: { isSubmitting, errors },
    } = form;
    
    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6 animate-in fade-in duration-300"
        >
            <div className="flex justify-between items-center pb-4 border-b">
                <h3 className="text-lg font-bold text-gray-800">Chỉnh sửa thông tin</h3>
                <button
                    type="button"
                    onClick={onCancel}
                    className="text-gray-500 hover:text-red-500"
                >
                    <X size={24} />
                </button>
            </div>

            {/* Avatar Upload */}
            <div className="flex flex-col items-center">
                <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200 mb-2 border-2 border-blue-100 relative group">
                    <img
                        src={
                            user?.avatar ||
                            user?.companyProfile?.logoUrl ||
                            'https://i0.wp.com/sbcf.fr/wp-content/uploads/2018/03/sbcf-default-avatar.png?ssl=1'
                        }
                        className="w-full h-full object-cover"
                    />
                    <label className="absolute inset-0 flex items-center justify-center bg-black/40 cursor-pointer">
                        <Camera className="w-8 h-8 text-white" />
                        <input
                            type="file"
                            accept="image/*"
                            {...register('avatar')}
                            className="hidden"
                        />
                    </label>
                </div>
                <span className="text-xs text-gray-500">Nhấp vào ảnh để thay đổi</span>
            </div>

            {/* Common Fields */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Họ và tên</label>
                <input
                    {...register('name')}
                    className="input-field border border-gray-300 rounded-md px-3 py-2"
                />
                {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>}
            </div>

            {/* Role Specific Fields */}
            {user?.role === 'candidate' ? (
                <>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Kỹ năng
                            </label>
                            <input
                                {...register('skills')}
                                className="input-field"
                                placeholder="React, Node..."
                            />
                            {errors.skills && (
                                <p className="mt-1 text-sm text-red-500">{errors.skills.message}</p>
                            )}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Kinh nghiệm (năm)
                            </label>
                            <input
                                type="number"
                                {...register('experience', { valueAsNumber: true })}
                                className="input-field"
                            />
                            {errors.experience && (
                                <p className="mt-1 text-sm text-red-500">
                                    {errors.experience.message}
                                </p>
                            )}
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                        <textarea {...register('bio')} rows={4} className="input-field"></textarea>
                    </div>
                </>
            ) : (
                <>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Tên công ty
                            </label>
                            <input {...register('companyName')} className="input-field" />
                            {errors.companyName && (
                                <p className="mt-1 text-sm text-red-500">
                                    {errors.companyName.message}
                                </p>
                            )}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Website
                            </label>
                            <input {...register('website')} className="input-field" />
                            {errors.website && (
                                <p className="mt-1 text-sm text-red-500">
                                    {errors.website.message}
                                </p>
                            )}
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Địa chỉ
                        </label>
                        <input {...register('location')} className="input-field" />
                        {errors.location && (
                            <p className="mt-1 text-sm text-red-500">{errors.location.message}</p>
                        )}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Mô tả
                        </label>
                        <textarea
                            {...register('description')}
                            rows={4}
                            className="input-field"
                        ></textarea>
                        {errors.description && (
                            <p className="mt-1 text-sm text-red-500">
                                {errors.description.message}
                            </p>
                        )}
                    </div>
                </>
            )}

            <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-4 py-2 border rounded-lg  hover:bg-red-700 bg-red-600 text-white"
                >
                    Hủy bỏ
                </button>
                <button type="submit" disabled={isSubmitting} className="btn-primary">
                    {isSubmitting ? 'Đang lưu...' : 'Lưu thay đổi'}
                </button>
            </div>
        </form>
    );
}

export default EditProfile;
