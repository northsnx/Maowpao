import axios from 'axios';
import { API_BASE_URL } from './apiPaths';

const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
    },
    timeout: 10000, // เพิ่ม timeout 10 วินาที เผื่อ server ช้า
});

// เพิ่ม token อัตโนมัติทุก request
axiosInstance.interceptors.request.use(
    (config) => {
        const accessToken = localStorage.getItem('accessToken');
        if (accessToken) {
            config.headers['Authorization'] = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// จัดการ response
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            // token หมดอายุหรือไม่ถูกต้อง
            if (error.response.status === 401) {
                console.warn('Unauthorized. Redirecting to login.');
                localStorage.removeItem('accessToken'); // ลบ token เก่า
                window.location.href = '/login';
            } else if (error.response.status >= 500) {
                console.error('Server error occurred. Please try again later.');
            }
        } else if (error.code === 'ECONNABORTED') {
            console.error('Request timed out. Please try again.');
        } else {
            console.error('Network error or request cancelled', error.message);
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
