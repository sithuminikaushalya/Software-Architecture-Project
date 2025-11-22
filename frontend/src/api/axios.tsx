import axios from 'axios';

const API_BASE_URL = "http://localhost:4000/api";

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});


export interface RegisterVendorData {
    email: string;
    password: string;
    businessName: string;
    contactPerson: string;
    phone: string;
    address: string;
}

export interface RegisterResponse {
    id: string;
    email: string;
    businessName: string;
    contactPerson: string;
    phone: string;
    address: string;
    role: string;
}

    export interface ApiError {
    status: number;
    message: string;
    }

export const authAPI = {
    registerVendor: async (data: RegisterVendorData): Promise<RegisterResponse> => {
        try {
        const response = await api.post<RegisterResponse>('/auth/register', data);
        return response.data;
        } catch (error: any) {
        if (error.response) {
            const backendMessage = error.response.data?.message || 
                                    error.response.data?.error ||
                                    'Registration failed';
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
}