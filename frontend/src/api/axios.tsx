import axios from 'axios';
import type {  UserProfile, UserProfileResponse } from '../types/UserType';
import type { Stall, StallResponse, StallsResponse } from '../types/StallType';
import type { ReservationResponse, ReservationsResponse } from '../types/ReservationType';
import type { ApiError } from '../types/Error';
import type { RegisterResponse, RegisterVendorData } from '../types/RegisterType';


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

    function handleError(error: any): never {
  if (error.response) {
    throw {
      status: error.response.status,
      message: error.response.data?.message || "Request failed",
    } as ApiError;
  }
  throw {
    status: 500,
    message: "Network error. Please check your connection.",
  } as ApiError;
}

const rememberUserContext = (user?: Partial<UserProfile>) => {
  if (!user) return;
  if (typeof user.id === "number") {
    sessionStorage.setItem("userId", String(user.id));
  }
  if (user.role) {
    sessionStorage.setItem("userRole", user.role);
  }
};

const getCachedUserId = (): number | null => {
  const cached = sessionStorage.getItem("userId");
  return cached ? Number(cached) : null;
};

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

    login: async (email: string, password: string, userType: 'vendor' | 'employee') => {
        try {
        const endpoint = userType === 'employee' ? '/auth/employee/login' : '/auth/login';
        const response = await api.post(endpoint, { email, password });
        if (response.data.token) {
            sessionStorage.setItem('authToken', response.data.token);
            sessionStorage.setItem('userRole', response.data.user?.role);
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

export const userAPI = {
  getProfile: async (): Promise<UserProfile> => {
    try {
      const response = await api.get<UserProfileResponse>("/users/profile");
      rememberUserContext(response.data.user);
      return response.data.user;
    } catch (error) {
      handleError(error);
    }
  },

  updateProfile: async (data: Partial<UserProfile>): Promise<UserProfile> => {
    try {
      const response = await api.put<UserProfileResponse>("/users/profile", data);
      rememberUserContext(response.data.user);
      return response.data.user;
    } catch (error) {
      handleError(error);
    }
  },
};

export const usersAPI = {
  getProfile: async (): Promise<UserProfileResponse> => {
    try {
      const res = await api.get<UserProfileResponse>("/users/profile");
      rememberUserContext(res.data.user);
      return res.data;
    } catch (e) {
      handleError(e);
    }
  },

  updateProfile: async (
    data: Partial<Pick<UserProfile, "businessName" | "contactPerson" | "phone" | "address">>
  ): Promise<UserProfileResponse> => {
    try {
      const res = await api.put<UserProfileResponse>("/users/profile", data);
      rememberUserContext(res.data.user);
      return res.data;
    } catch (e) {
      handleError(e);
    }
  },
};

export const stallsAPI = {
  getAll: async (): Promise<StallsResponse> => {
    try {
      const res = await api.get<StallsResponse>("/stalls");
      return res.data;
    } catch (e) {
      handleError(e);
    }
  },

  getAvailable: async (): Promise<StallsResponse> => {
    try {
      const res = await api.get<StallsResponse>("/stalls/available");
      return res.data;
    } catch (e) {
      handleError(e);
    }
  },

  getOne: async (id: number): Promise<StallResponse> => {
    try {
      const res = await api.get<StallResponse>(`/stalls/${id}`);
      return res.data;
    } catch (e) {
      handleError(e);
    }
  },

  update: async (id: number, data: Partial<Stall>): Promise<StallResponse> => {
    try {
      const res = await api.put<StallResponse>(`/stalls/${id}`, data);
      return res.data;
    } catch (e) {
      handleError(e);
    }
  },
};

async function ensureUserId(): Promise<number> {
  const cached = getCachedUserId();
  if (cached) {
    return cached;
  }
  const profile = await userAPI.getProfile();
  if (!profile) {
    throw {
      status: 401,
      message: "Unable to determine current user",
    } as ApiError;
  }
  return profile.id;
}

async function fetchReservationsForUser(userId: number): Promise<ReservationsResponse> {
  try {
    const res = await api.get<ReservationsResponse>(`/reservations/user/${userId}`);
    return res.data;
  } catch (e) {
    handleError(e);
  }
}

export const reservationsAPI = {
  create: async (stallId: number): Promise<ReservationResponse> => {
    try {
      const res = await api.post<ReservationResponse>("/reservations", { stallId });
      return res.data;
    } catch (e) {
      handleError(e);
    }
  },

  getForUser: fetchReservationsForUser,

  getMine: async (): Promise<ReservationsResponse> => {
    const userId = await ensureUserId();
    return fetchReservationsForUser(userId);
  },

  getAll: async (): Promise<ReservationsResponse> => {
    try {
      const res = await api.get<ReservationsResponse>("/reservations");
      return res.data;
    } catch (e) {
      handleError(e);
    }
  },

  cancel: async (reservationId: number): Promise<boolean> => {
    try {
      const res = await api.delete<{ success: boolean }>(`/reservations/${reservationId}`);
      return res.data.success;
    } catch (e) {
      handleError(e);
    }
  },

  updateGenres: async (reservationId: number, genres: string[]): Promise<ReservationResponse> => {
    try {
      const res = await api.patch<ReservationResponse>(`/reservations/${reservationId}/genres`, { genres });
      return res.data;
    } catch (e) {
      handleError(e);
    }
  },
};

export default api;