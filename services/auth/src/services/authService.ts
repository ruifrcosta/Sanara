import { ManagementClient, AuthenticationClient } from 'auth0';
import { config } from '../config';
import { AppError } from '../middlewares/errorHandler';
import { logger } from '../utils/logger';

const auth0 = new ManagementClient({
  domain: config.auth0.domain,
  clientId: config.auth0.clientId,
  clientSecret: config.auth0.clientSecret,
});

const auth0Authentication = new AuthenticationClient({
  domain: config.auth0.domain,
  clientId: config.auth0.clientId,
});

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
}

export class AuthService {
  async login(credentials: LoginCredentials) {
    try {
      const { email, password } = credentials;
      
      const response = await auth0Authentication.passwordGrant({
        username: email,
        password,
        scope: 'openid profile email',
      });

      return {
        accessToken: response.access_token,
        idToken: response.id_token,
        expiresIn: response.expires_in,
      };
    } catch (error) {
      logger.error('Login failed:', error);
      throw new AppError(401, 'Invalid credentials');
    }
  }

  async register(data: RegisterData) {
    try {
      const { email, password, name } = data;

      const user = await auth0.createUser({
        connection: 'Username-Password-Authentication',
        email,
        password,
        name,
        verify_email: true,
      });

      return {
        userId: user.user_id,
        email: user.email,
        name: user.name,
      };
    } catch (error) {
      logger.error('Registration failed:', error);
      throw new AppError(400, 'Registration failed');
    }
  }

  async getUserInfo(userId: string) {
    try {
      const user = await auth0.getUser({ id: userId });
      return {
        userId: user.user_id,
        email: user.email,
        name: user.name,
        picture: user.picture,
      };
    } catch (error) {
      logger.error('Get user info failed:', error);
      throw new AppError(404, 'User not found');
    }
  }

  async updateUserInfo(userId: string, data: Partial<RegisterData>) {
    try {
      const user = await auth0.updateUser({ id: userId }, data);
      return {
        userId: user.user_id,
        email: user.email,
        name: user.name,
      };
    } catch (error) {
      logger.error('Update user info failed:', error);
      throw new AppError(400, 'Update failed');
    }
  }
} 