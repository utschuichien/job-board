import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuthStore } from '../store/useAuthStore';
import axiosClient from '../api/axiosClient';
import { notify } from '../utils/toast';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { profileSchema } from '../schemas/ProfileSchema';
import EditProfile from '../components/layout/EditProfile';
import ProfileView from '../components/layout/ProfileView';

type ProfileFormData = z.infer<typeof profileSchema>;

function Profile() {
    const { user, login } = useAuthStore();
    const [isEditing, setIsEditing] = useState(false);

    const form = useForm<ProfileFormData>({
        defaultValues: {
            name: '',
            avatar: null,
            bio: '',
            skills: '',
            experience: 0,
            companyName: '',
            website: '',
            location: '',
            description: '',
        },
        resolver: zodResolver(profileSchema),
        mode: 'onBlur',
    });
    const { reset } = form;

    useEffect(() => {
        if (user) {
            reset({
                name: user.name || '',
                bio: user.candidateProfile?.bio || '',
                skills: user.candidateProfile?.skills?.join(', ') || '',
                experience: user.candidateProfile?.experience || 0,
                companyName: user.companyProfile?.companyName || '',
                website: user.companyProfile?.website || '',
                location: user.companyProfile?.location || '',
                description: user.companyProfile?.description || '',
            });
        }
         
    }, [user, reset]);
    useEffect(() => {   
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    });

    const onSubmit = async (data: any) => {
        try {
            const formData = new FormData();
            formData.append('name', data.name);
            if (data.avatar && data.avatar[0]) formData.append('avatar', data.avatar[0]);

            if (user?.role === 'candidate') {
                formData.append('bio', data.bio);
                formData.append('skills', data.skills);
                formData.append('experience', data.experience);
            } else {
                formData.append('companyName', data.companyName);
                formData.append('website', data.website);
                formData.append('location', data.location);
                formData.append('description', data.description);
            }

            const res = await axiosClient.put('/users/profile', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            login(res.data, res.data.token);
            notify.success('Cập nhật hồ sơ thành công!');
            setIsEditing(false);
        } catch (error) {
            notify.error('Lỗi cập nhật.');
        }
    };


    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Background Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 h-48 w-full relative"></div>

            <div className="max-w-4xl mx-auto px-4 -mt-20 relative z-20">
                <div className="bg-white rounded-xl shadow-xl overflow-hidden min-h-[400px]">
                    <div className="p-8">

                        {isEditing ? (
                            <EditProfile
                                form={form}
                                user={user}
                                onCancel={() => setIsEditing(false)}
                                onSubmit={onSubmit}
                            />
                        ) : (
                            <ProfileView user={user} onEdit={() => setIsEditing(true)} />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Profile;
