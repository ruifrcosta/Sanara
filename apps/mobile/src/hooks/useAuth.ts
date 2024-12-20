import { useState, useEffect, useCallback } from 'react';
import AuthService, { 
  LoginCredentials, 
  RegisterData, 
  AuthResponse 
} from '../services/AuthService';

interface AuthState {
  isAuthenticated: boolean;
  user: any | null;
  isLoading: boolean;
}

export const useAuth = () => {
  const [state, setState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    isLoading: true,
  });

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const isAuthenticated = await AuthService.isAuthenticated();
      if (isAuthenticated) {
        const user = await AuthService.getUser();
        setState({
          isAuthenticated: true,
          user,
          isLoading: false,
        });
      } else {
        setState({
          isAuthenticated: false,
          user: null,
          isLoading: false,
        });
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
      setState({
        isAuthenticated: false,
        user: null,
        isLoading: false,
      });
    }
  };

  const login = useCallback(async (credentials: LoginCredentials) => {
    try {
      const response = await AuthService.login(credentials);
      setState({
        isAuthenticated: true,
        user: response.user,
        isLoading: false,
      });
      return response;
    } catch (error) {
      setState({
        isAuthenticated: false,
        user: null,
        isLoading: false,
      });
      throw error;
    }
  }, []);

  const register = useCallback(async (data: RegisterData) => {
    try {
      const response = await AuthService.register(data);
      setState({
        isAuthenticated: true,
        user: response.user,
        isLoading: false,
      });
      return response;
    } catch (error) {
      setState({
        isAuthenticated: false,
        user: null,
        isLoading: false,
      });
      throw error;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await AuthService.logout();
      setState({
        isAuthenticated: false,
        user: null,
        isLoading: false,
      });
    } catch (error) {
      console.error('Error during logout:', error);
      throw error;
    }
  }, []);

  const refreshAuth = useCallback(async () => {
    try {
      const token = await AuthService.refreshToken();
      const user = await AuthService.getUser();
      setState({
        isAuthenticated: true,
        user,
        isLoading: false,
      });
      return token;
    } catch (error) {
      setState({
        isAuthenticated: false,
        user: null,
        isLoading: false,
      });
      throw error;
    }
  }, []);

  return {
    ...state,
    login,
    register,
    logout,
    refreshAuth,
    checkAuthStatus,
  };
}; 