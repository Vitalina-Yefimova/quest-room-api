import { IsNumber, IsString } from 'class-validator';
import { FavoritesResponse } from '../interfaces';
import { BaseResponseDto } from '../../common/dto/base-response.dto';

export class FavoritesResponseDto extends BaseResponseDto<FavoritesResponseDto> implements FavoritesResponse {
  @IsString()
  id: string;

  @IsNumber()
  userId: string;

  @IsString()
  questId: string;
}

