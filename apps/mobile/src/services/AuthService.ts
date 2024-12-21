import axios, { AxiosRequestConfig } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = process.env.API_URL || 'http://localhost:3001';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData extends LoginCredentials {
  name: string;
  phone?: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

class AuthService {
  private static instance: AuthService;
  private token: string | null = null;

  private constructor() {}

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, credentials);
      const data = response.data as AuthResponse;
      
      await this.setToken(data.token);
      await this.setUser(data.user);
      
      return data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async register(data: RegisterData): Promise<AuthResponse> {
    try {
      const response = await axios.post(`${API_URL}/auth/register`, data);
      const authData = response.data as AuthResponse;
      
      await this.setToken(authData.token);
      await this.setUser(authData.user);
      
      return authData;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async logout(): Promise<void> {
    try {
      await AsyncStorage.multiRemove(['@auth_token', '@user_data']);
      this.token = null;
    } catch (error) {
      console.error('Error during logout:', error);
      throw new Error('Failed to logout');
    }
  }

  async refreshToken(): Promise<string> {
    try {
      const response = await axios.post(
        `${API_URL}/auth/refresh-token`,
        {},
        {
          headers: { Authorization: `Bearer ${this.token}` }
        }
      );
      const { token } = response.data;
      await this.setToken(token);
      return token;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async isAuthenticated(): Promise<boolean> {
    try {
      const token = await AsyncStorage.getItem('@auth_token');
      return !!token;
    } catch {
      return false;
    }
  }

  async getToken(): Promise<string | null> {
    if (!this.token) {
      this.token = await AsyncStorage.getItem('@auth_token');
    }
    return this.token;
  }

  async getUser(): Promise<any> {
    try {
      const userData = await AsyncStorage.getItem('@user_data');
      return userData ? JSON.parse(userData) : null;
    } catch {
      return null;
    }
  }

  private async setToken(token: string): Promise<void> {
    this.token = token;
    await AsyncStorage.setItem('@auth_token', token);
  }

  private async setUser(user: any): Promise<void> {
    await AsyncStorage.setItem('@user_data', JSON.stringify(user));
  }

  private handleError(error: any): Error {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message || error.message;
      return new Error(message);
    }
    return error;
  }

  private async refreshTokenIfNeeded(): Promise<void> {
    const token = await this.getToken();
    if (!token) return;

    const tokenExpiration = this.getTokenExpiration(token);
    const now = Date.now();

    if (tokenExpiration - now < 5 * 60 * 1000) { // 5 minutes
      await this.refreshToken();
    }
  }

  private getTokenExpiration(token: string): number {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000;
  }

  async request(config: AxiosRequestConfig): Promise<any> {
    await this.refreshTokenIfNeeded();
    return axios.request(config);
  }
}

export default AuthService.getInstance(); 