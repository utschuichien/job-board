import { Award, Briefcase, Building2, Code, FileText, Globe, Mail, MapPin, Pencil, User } from "lucide-react";

function ProfileView({ user, onEdit }: any) {
    return (
        <div className="space-y-8">
            {/* Header Info */}
            <div className="flex flex-col md:flex-row gap-6 items-center md:items-start pb-6 border-b border-gray-100">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg bg-gray-100 flex-shrink-0">
                    <img
                        src={
                            user?.avatar ||
                            user?.companyProfile?.logoUrl ||
                            'https://i0.wp.com/sbcf.fr/wp-content/uploads/2018/03/sbcf-default-avatar.png?ssl=1'
                        }
                        alt="Avatar"
                        className="w-full h-full object-cover"
                    />
                </div>
                <div className="text-center md:text-left flex-grow">
                    <h2 className="text-2xl font-bold text-gray-900 flex justify-start items-center gap-x-1.5">
                        <User className="-ml-[3px]" size={23} />
                        {user?.name}
                    </h2>
                    <p className="text-gray-500 flex items-center justify-center md:justify-start gap-2 mt-1">
                        <Mail size={16} /> {user?.email}
                    </p>

                    {user?.role === 'employer' && (
                        <div className="mt-3 flex flex-wrap gap-3 justify-center md:justify-start text-sm text-gray-600">
                            {user.companyProfile?.companyName && (
                                <span className="flex items-center gap-1 bg-blue-50 text-blue-700 px-3 py-1 rounded-full">
                                    <Building2 size={14} /> {user.companyProfile.companyName}
                                </span>
                            )}
                            {user.companyProfile?.location && (
                                <span className="flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-full">
                                    <MapPin size={14} /> {user.companyProfile.location}
                                </span>
                            )}
                            {user.companyProfile?.website && (
                                <a
                                    href={user.companyProfile.website}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex items-center gap-1 text-blue-600 hover:underline"
                                >
                                    <Globe size={14} /> Website 
                                </a>
                            )}
                        </div>
                    )}
                </div>

                {/* Nút Edit */}
                <button
                    onClick={onEdit}
                    className="flex items-center gap-2 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 shadow-sm font-medium transition"
                >
                    <Pencil size={16} /> Chỉnh sửa
                </button>
            </div>

            {/* Chi tiết */}
            <div className="grid grid-cols-1 gap-6">
                {user?.role === 'candidate' ? (
                    <>
                        <div className="bg-gray-50 p-6 rounded-xl">
                            <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                <FileText className="text-blue-600" size={20} /> Giới thiệu
                            </h3>
                            <p className="text-gray-600 whitespace-pre-line leading-relaxed">
                                {user.candidateProfile?.bio || 'Chưa cập nhật giới thiệu...'}
                            </p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-white border p-6 rounded-xl">
                                <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                    <Code className="text-green-600" size={20} /> Kỹ năng
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {user.candidateProfile?.skills &&
                                    user.candidateProfile.skills.length > 0 ? (
                                        user.candidateProfile.skills.map(
                                            (skill: string, index: number) => (
                                                <span
                                                    key={index}
                                                    className="bg-green-50 text-green-700 px-3 py-1 rounded-lg text-sm font-medium border border-green-100"
                                                >
                                                    {skill}
                                                </span>
                                            ),
                                        )
                                    ) : (
                                        <span className="text-gray-400 italic">Chưa cập nhật</span>
                                    )}
                                </div>
                            </div>
                            <div className="bg-white border p-6 rounded-xl">
                                <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                    <Award className="text-yellow-600" size={20} /> Kinh nghiệm
                                </h3>
                                <p className="text-2xl font-bold text-gray-900">
                                    {user.candidateProfile?.experience || 0}{' '}
                                    <span className="text-base font-normal text-gray-500">năm</span>
                                </p>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="bg-gray-50 p-6 rounded-xl">
                        <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                            <Briefcase className="text-blue-600" size={20} /> Về công ty
                        </h3>
                        <p className="text-gray-600 whitespace-pre-line leading-relaxed">
                            {user?.companyProfile?.description || 'Chưa cập nhật mô tả công ty...'}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ProfileView;