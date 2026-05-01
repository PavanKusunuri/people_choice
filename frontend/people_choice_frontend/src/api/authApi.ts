import axiosInstance from '../lib/axios';

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    role: 'user' | 'critic' | 'admin';
    isVerified: boolean;
    createdAt: string;
  };
  accessToken: string;
}

export interface RefreshResponse {
  accessToken: string;
}

export const authApi = {
  /**
   * Register a new user
   */
  register: async (payload: RegisterPayload): Promise<AuthResponse> => {
    const response = await axiosInstance.post<{
      data: AuthResponse;
    }>('/auth/register', payload);
    return response.data.data;
  },

  /**
   * Login user
   */
  login: async (payload: LoginPayload): Promise<AuthResponse> => {
    const response = await axiosInstance.post<{
      data: AuthResponse;
    }>('/auth/login', payload);
    return response.data.data;
  },

  /**
   * Logout user
   */
  logout: async (): Promise<void> => {
    await axiosInstance.post('/auth/logout');
  },

  /**
   * Refresh access token
   */
  refreshToken: async (): Promise<RefreshResponse> => {
    const response = await axiosInstance.post<{
      data: RefreshResponse;
    }>('/auth/refresh');
    return response.data.data;
  },

  /**
   * Verify email with token
   */
  verifyEmail: async (token: string): Promise<void> => {
    await axiosInstance.post('/auth/verify-email', { token });
  },

  /**
   * Request password reset
   */
  forgotPassword: async (email: string): Promise<void> => {
    await axiosInstance.post('/auth/forgot-password', { email });
  },

  /**
   * Reset password with token
   */
  resetPassword: async (token: string, newPassword: string): Promise<void> => {
    await axiosInstance.post('/auth/reset-password', {
      token,
      newPassword,
    });
  },
};

export default authApi;
