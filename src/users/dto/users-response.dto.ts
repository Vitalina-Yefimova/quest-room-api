import { BaseResponseDto } from '../../common/dto/base-response.dto';
import { UsersResponse } from '../interfaces';

export class UsersResponseDto extends BaseResponseDto<UsersResponseDto> implements UsersResponse {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: 'USER' | 'ADMIN';
  verify: boolean;
  emailVerified: boolean;
  hasPassword?: boolean

  constructor(data: UsersResponse) {
    super(data)
  }
}