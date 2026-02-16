import axios from 'axios';

const axiosClient = axios.create({
    baseURL: import.meta.env.REACT_APP_API_URL || 'http://localhost:5000/api', 
    headers: {
        'Content-Type': 'application/json',
    },
});

// Tự động thêm Token vào mỗi request nếu có (để sau này dùng cho các route bảo mật)
axiosClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default axiosClient;
