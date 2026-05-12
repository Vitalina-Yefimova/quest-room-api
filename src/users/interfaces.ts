import { Provider } from '@prisma/client';

export interface UsersRequest {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string | null;
  phone?: string | null;
  verify?: boolean;
  emailVerified?: boolean;
  newEmail?: string;
  authMethod: 'email' | 'phone' | Provider;
}

export interface UsersResponse {
  id: number;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  role: 'USER' | 'ADMIN';
  verify: boolean;
  emailVerified?: boolean;
  hasPassword?: boolean;
}

export interface OAuthUsersRequest {
  provider: Provider;
  providerId: string;
}

export interface OAuthUsersResponse extends UsersResponse {
  provider: Provider;
  providerId: string;
}
