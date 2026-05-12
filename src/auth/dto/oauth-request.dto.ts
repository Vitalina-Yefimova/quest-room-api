import { Provider } from '@prisma/client';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { OAuthLoginRequest } from '../interfaces';

export class OAuthRequestDto implements OAuthLoginRequest {
  @IsNotEmpty()
  @IsEnum(Provider)
  provider: Provider;

  @IsString()
  @IsNotEmpty()
  providerId: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsOptional()
  givenName?: string | null;

  @IsString()
  @IsOptional()
  familyName?: string | null;
}
