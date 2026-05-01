import { useCallback, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { authApi } from '../api/authApi';
import { toast } from 'sonner';

export const useAuth = () => {
  const { user, accessToken, isLoading, error, isAuthenticated, setIsLoading, setError, login, logout } =
    useAuthStore();

  /**
   * Register user
   */
  const register = useCallback(
    async (name: string, email: string, password: string) => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await authApi.register({ name, email, password });
        login(data.user, data.accessToken);
        toast.success('Registration successful!');
        return data;
      } catch (err: any) {
        const message = err.response?.data?.message || 'Registration failed';
        setError(message);
        toast.error(message);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [login, setError, setIsLoading]
  );

  /**
   * Login user
   */
  const loginUser = useCallback(
    async (email: string, password: string) => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await authApi.login({ email, password });
        login(data.user, data.accessToken);
        toast.success('Login successful!');
        return data;
      } catch (err: any) {
        const message = err.response?.data?.message || 'Login failed';
        setError(message);
        toast.error(message);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [login, setError, setIsLoading]
  );

  /**
   * Logout user
   */
  const logoutUser = useCallback(async () => {
    setIsLoading(true);
    try {
      await authApi.logout();
      logout();
      toast.success('Logged out successfully');
    } catch (err: any) {
      const message = 'Logout failed';
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  }, [logout, setError, setIsLoading]);

  /**
   * Verify email
   */
  const verifyEmail = useCallback(
    async (token: string) => {
      setIsLoading(true);
      setError(null);
      try {
        await authApi.verifyEmail(token);
        toast.success('Email verified successfully!');
      } catch (err: any) {
        const message = err.response?.data?.message || 'Email verification failed';
        setError(message);
        toast.error(message);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [setError, setIsLoading]
  );

  /**
   * Forgot password
   */
  const forgotPassword = useCallback(
    async (email: string) => {
      setIsLoading(true);
      setError(null);
      try {
        await authApi.forgotPassword(email);
        toast.success('Password reset link sent to your email');
      } catch (err: any) {
        const message = err.response?.data?.message || 'Password reset failed';
        setError(message);
        toast.error(message);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [setError, setIsLoading]
  );

  /**
   * Reset password
   */
  const resetPassword = useCallback(
    async (token: string, newPassword: string) => {
      setIsLoading(true);
      setError(null);
      try {
        await authApi.resetPassword(token, newPassword);
        toast.success('Password reset successfully!');
      } catch (err: any) {
        const message = err.response?.data?.message || 'Password reset failed';
        setError(message);
        toast.error(message);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [setError, setIsLoading]
  );

  /**
   * Refresh token on app mount
   */
  useEffect(() => {
    const refreshOnMount = async () => {
      try {
        const data = await authApi.refreshToken();
        const { accessToken } = useAuthStore.getState();
        useAuthStore.getState().setAccessToken(data.accessToken);
      } catch (err) {
        // Token refresh failed, user is logged out
        useAuthStore.getState().logout();
      }
    };

    refreshOnMount();
  }, []);

  return {
    user,
    accessToken,
    isLoading,
    error,
    isAuthenticated,
    register,
    login: loginUser,
    logout: logoutUser,
    verifyEmail,
    forgotPassword,
    resetPassword,
  };
};

export default useAuth;
