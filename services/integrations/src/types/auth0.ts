import { ManagementClient, AuthenticationClient } from 'auth0';

export interface Auth0Config {
  domain: string;
  clientId: string;
  clientSecret: string;
  audience: string;
  scope: string;
  connection: string;
}

export interface Auth0User {
  user_id: string;
  email: string;
  email_verified: boolean;
  name: string;
  picture?: string;
  user_metadata?: Record<string, any>;
  app_metadata?: Record<string, any>;
}

export interface Auth0Token {
  access_token: string;
  id_token: string;
  token_type: string;
  expires_in: number;
}

export interface Auth0Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
}

export interface Auth0Permission {
  resource_server_identifier: string;
  permission_name: string;
  description: string;
}

export interface Auth0Clients {
  management: ManagementClient;
  authentication: AuthenticationClient;
} 