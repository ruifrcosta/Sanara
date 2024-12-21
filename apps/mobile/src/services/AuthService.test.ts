import AuthService from './AuthService';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

jest.mock('axios');
jest.mock('@react-native-async-storage/async-storage');

const mockedAxios = axios as jest.Mocked<typeof axios>;
const mockedAsyncStorage = AsyncStorage as jest.Mocked<typeof AsyncStorage>;

describe('AuthService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('should login successfully', async () => {
      const mockResponse = {
        data: {
          token: 'test-token',
          user: {
            id: '1',
            name: 'Test User',
            email: 'test@example.com',
            role: 'user'
          }
        }
      };

      mockedAxios.post.mockResolvedValueOnce(mockResponse);

      const credentials = {
        email: 'test@example.com',
        password: 'password123'
      };

      const response = await AuthService.login(credentials);

      expect(response).toEqual(mockResponse.data);
      expect(mockedAxios.post).toHaveBeenCalledWith(
        expect.stringContaining('/auth/login'),
        credentials
      );
      expect(mockedAsyncStorage.setItem).toHaveBeenCalledWith(
        '@auth_token',
        'test-token'
      );
    });

    it('should handle login error', async () => {
      const errorMessage = 'Invalid credentials';
      mockedAxios.post.mockRejectedValueOnce(new Error(errorMessage));

      const credentials = {
        email: 'test@example.com',
        password: 'wrong-password'
      };

      await expect(AuthService.login(credentials)).rejects.toThrow(errorMessage);
    });
  });

  describe('logout', () => {
    it('should clear storage and reset token', async () => {
      await AuthService.logout();

      expect(mockedAsyncStorage.multiRemove).toHaveBeenCalledWith([
        '@auth_token',
        '@user_data'
      ]);

      const token = await AuthService.getToken();
      expect(token).toBeNull();
    });
  });

  describe('isAuthenticated', () => {
    it('should return true when token exists', async () => {
      mockedAsyncStorage.getItem.mockResolvedValueOnce('valid-token');

      const result = await AuthService.isAuthenticated();
      expect(result).toBe(true);
    });

    it('should return false when token does not exist', async () => {
      mockedAsyncStorage.getItem.mockResolvedValueOnce(null);

      const result = await AuthService.isAuthenticated();
      expect(result).toBe(false);
    });
  });
}); 