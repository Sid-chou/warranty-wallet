import axios from 'axios';

// Use environment variable for deployed backend, fallback to localhost for development
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add JWT token
api.interceptors.request.use(
    (config) => {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        if (user.token) {
            config.headers.Authorization = `Bearer ${user.token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// Auth APIs
export const authAPI = {
    signup: (data) => api.post('/auth/signup', data),
    login: (data) => api.post('/auth/login', data),
};
// Warranty APIs
export const warrantyAPI = {
    scanBill: (file) => {
        const formData = new FormData();
        formData.append('file', file);
        return api.post('/warranties/scan', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    },
    getAllWarranties: () => api.get('/warranties'),
    getActiveWarranties: () => api.get('/warranties/active'),
    getExpiredWarranties: () => api.get('/warranties/expired'),
    deleteWarranty: (id) => api.delete(`/warranties/${id}`),
};

export default api;
