import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  OAuthUsersRequest,
  OAuthUsersResponse,
  UsersRequest,
  UsersResponse,
} from './interfaces';
import { Provider } from '@prisma/client';

@Injectable()
export class UsersDataService {
  constructor(private prisma: PrismaService) { }

  private baseSelect = {
    id: true,
    firstName: true,
    lastName: true,
    email: true,
    phone: true,
    password: true,
    role: true,
    verify: true,
    emailVerified: true,
    newEmail: true,
    authMethod: true,
  } as const;

  async getUser(where: {
    id?: number;
    email?: string;
    phone?: string;
    provider?: Provider;
    providerId?: string;
  }) {
    if (where.provider && where.providerId) {
      const oauthAccount = await this.prisma.oAuthAccount.findUnique({
        where: {
          provider_providerId: {
            provider: where.provider,
            providerId: where.providerId,
          },
        },
        include: { user: { select: this.baseSelect } },
      });
      return oauthAccount?.user ?? null;
    }

    const user = await this.prisma.users.findFirst({
      where: {
        OR: [
          { id: where.id },
          { email: where.email },
          { phone: where.phone },
        ],
      },
      select: this.baseSelect,
    });

    if (!user) return null;
    return user;
  }

  async createUser(user: UsersRequest, oauthProvider?: OAuthUsersRequest) {
    try {
      if (oauthProvider) {
        return await this.prisma.$transaction(async (tx) => {
          const created = await tx.users.create({
            data: { ...user, password: null, verify: true },
            select: this.baseSelect,
          });

          await tx.oAuthAccount.create({
            data: {
              provider: oauthProvider.provider,
              providerId: oauthProvider.providerId,
              userId: created.id,
            },
          });

          return {
            ...created,
            provider: oauthProvider.provider,
            providerId: oauthProvider.providerId,
          };
        });
      }

      return await this.prisma.users.create({
        data: user,
        select: this.baseSelect,
      });
    } catch (error) {
      if ((error as { code?: string }).code === 'P2002') {
        throw new BadRequestException('Invalid registration data');
      }
      throw error;
    }
  }

  async updateUser(id: number, data: Partial<Pick<UsersRequest,
    'firstName' | 'phone' | 'password' | 'lastName' | 'verify' | 'emailVerified' | 'email' | 'newEmail'>>) {
    try {
      return this.prisma.users.update({
        where: { id },
        data,
        select: this.baseSelect,
      });
    } catch (error) {
      if ((error as { code?: string }).code === 'P2002') {
        throw new BadRequestException('Invalid registration data');
      }
      throw error;
    }
  }
}
