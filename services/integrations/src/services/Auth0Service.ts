import { ManagementClient, AuthenticationClient } from 'auth0';
import { Auth0Config, Auth0User, Auth0Token, Auth0Role, Auth0Permission } from '../types/auth0';
import { logger } from '../utils/logger';

export class Auth0Service {
  private management: ManagementClient;
  private authentication: AuthenticationClient;
  private config: Auth0Config;

  constructor(config: Auth0Config) {
    this.config = config;
    this.management = new ManagementClient({
      domain: config.domain,
      clientId: config.clientId,
      clientSecret: config.clientSecret,
    });
    this.authentication = new AuthenticationClient({
      domain: config.domain,
      clientId: config.clientId,
    });
  }

  // Autenticação
  async authenticate(email: string, password: string): Promise<Auth0Token> {
    try {
      const response = await this.authentication.passwordGrant({
        username: email,
        password,
        scope: this.config.scope,
        audience: this.config.audience,
      });

      return {
        access_token: response.access_token,
        id_token: response.id_token,
        token_type: response.token_type,
        expires_in: response.expires_in,
      };
    } catch (error) {
      logger.error('Error authenticating user:', error);
      throw error;
    }
  }

  // Gerenciamento de Usuários
  async createUser(userData: Partial<Auth0User>): Promise<Auth0User> {
    try {
      const user = await this.management.createUser({
        connection: this.config.connection,
        ...userData,
      });

      return user as Auth0User;
    } catch (error) {
      logger.error('Error creating user:', error);
      throw error;
    }
  }

  async updateUser(userId: string, userData: Partial<Auth0User>): Promise<Auth0User> {
    try {
      const user = await this.management.updateUser({ id: userId }, userData);
      return user as Auth0User;
    } catch (error) {
      logger.error('Error updating user:', error);
      throw error;
    }
  }

  async getUserById(userId: string): Promise<Auth0User> {
    try {
      const user = await this.management.getUser({ id: userId });
      return user as Auth0User;
    } catch (error) {
      logger.error('Error getting user:', error);
      throw error;
    }
  }

  async deleteUser(userId: string): Promise<void> {
    try {
      await this.management.deleteUser({ id: userId });
    } catch (error) {
      logger.error('Error deleting user:', error);
      throw error;
    }
  }

  // Gerenciamento de Roles
  async assignRoleToUser(userId: string, roles: string[]): Promise<void> {
    try {
      await this.management.assignRolestoUser({ id: userId }, { roles });
    } catch (error) {
      logger.error('Error assigning roles to user:', error);
      throw error;
    }
  }

  async getUserRoles(userId: string): Promise<Auth0Role[]> {
    try {
      const roles = await this.management.getUserRoles({ id: userId });
      return roles as Auth0Role[];
    } catch (error) {
      logger.error('Error getting user roles:', error);
      throw error;
    }
  }

  // Gerenciamento de Permissões
  async getUserPermissions(userId: string): Promise<Auth0Permission[]> {
    try {
      const permissions = await this.management.getUserPermissions({ id: userId });
      return permissions as Auth0Permission[];
    } catch (error) {
      logger.error('Error getting user permissions:', error);
      throw error;
    }
  }

  // Verificação de Token
  async verifyToken(token: string): Promise<boolean> {
    try {
      const decodedToken = await this.authentication.getProfile(token);
      return !!decodedToken;
    } catch (error) {
      logger.error('Error verifying token:', error);
      return false;
    }
  }

  // Refresh Token
  async refreshToken(refreshToken: string): Promise<Auth0Token> {
    try {
      const response = await this.authentication.refreshToken({
        refresh_token: refreshToken,
      });

      return {
        access_token: response.access_token,
        id_token: response.id_token,
        token_type: response.token_type,
        expires_in: response.expires_in,
      };
    } catch (error) {
      logger.error('Error refreshing token:', error);
      throw error;
    }
  }

  // Logout
  async logout(userId: string): Promise<void> {
    try {
      await this.management.blacklistToken({
        aud: this.config.clientId,
        sub: userId,
      });
    } catch (error) {
      logger.error('Error logging out user:', error);
      throw error;
    }
  }
} 