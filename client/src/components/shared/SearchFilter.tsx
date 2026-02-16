import { useForm } from 'react-hook-form';
import { VIETNAM_PROVINCES } from '../../data/provinces';
import { Search } from 'lucide-react';

interface SearchFilterProps {
    onSearch: (params: any) => void;
}

function SearchFilter({ onSearch }: SearchFilterProps) {
    const { register, handleSubmit } = useForm();

    const onSubmit = (data: any) => {
        // Truyền dữ liệu tìm kiếm ra ngoài cho Home.tsx xử lý
        onSearch(data);
    };

    return (
        <div className="bg-white p-4 rounded-lg shadow-sm border mb-6">
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="grid grid-cols-1 md:grid-cols-4 gap-4"
            >
                {/* Ô tìm kiếm từ khóa */}
                <div
                    className="md:col-span-2 flex items-center gap-2 border px-3 rounded-lg transition
    focus-within:border-blue-500    
    focus-within:ring-2
    focus-within:ring-blue-500"
                >
                    <Search className="text-gray-400" />
                    <input
                        {...register('search')}
                        placeholder="Tìm kiếm theo vị trí, kỹ năng..."
                        className="w-full  py-2 rounded-lg  outline-none"
                    />
                </div>

                {/* Dropdown Địa điểm */}
                <div>
                    <select
                        {...register('location')}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                    >
                        <option value="">Tất cả địa điểm</option>
                        {VIETNAM_PROVINCES.map((province) => (
                            <option key={province} value={province}>
                                {province}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Nút Tìm kiếm */}
                <div>
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition"
                    >
                        Tìm việc ngay
                    </button>
                </div>
            </form>
        </div>
    );
}

export default SearchFilter;
