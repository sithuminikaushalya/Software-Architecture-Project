import axios from 'axios';
import type { ApiError, RegisterResponse, RegisterVendorData } from '../types/UserType';

const API_BASE_URL = "http://localhost:4000/api";

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});
    api.interceptors.request.use(
    (config) => {
        const token = sessionStorage.getItem('authToken');
        if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

    api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
        sessionStorage.removeItem('authToken');
        window.location.href = '/';
        }
        return Promise.reject(error);
    }
    );

export const authAPI = {
    registerVendor: async (data: RegisterVendorData): Promise<RegisterResponse> => {
        try {
        const response = await api.post<RegisterResponse>('/auth/register', data);
        return response.data;
        } catch (error: any) {
        if (error.response) {
            const backendMessage = error.response.data?.message || error.response.data?.error || 'Registration failed';
            throw {
            status: error.response.status,
            message: backendMessage,
            details: error.response.data?.errors 
            } as ApiError;
        }
        throw {
            status: 500,
            message: 'Network error. Please check your connection.',
        } as ApiError;
        }
    },

        login: async (email: string, password: string) => {
        try {
        const response = await api.post('/auth/login', { email, password });
        if (response.data.token) {
            sessionStorage.setItem('authToken', response.data.token);
        }
        return response.data;
        } catch (error: any) {
        if (error.response) {
            throw {
            status: error.response.status,
            message: error.response.data?.message || 'Login failed',
            } as ApiError;
        }
        throw {
            status: 500,
            message: 'Network error. Please check your connection.',
        } as ApiError;
        }
    },
};

export default api;