import { IsNumber, IsDate, IsString, IsOptional, IsEnum } from 'class-validator';
import { BaseResponseDto } from '../../common/dto/base-response.dto';
import { OrdersResponse, OrderStatus } from '../interfaces';

export class OrdersResponseDto extends BaseResponseDto<OrdersResponseDto> implements OrdersResponse {

  @IsNumber()
  id: number;

  @IsNumber()
  userId: number;

  @IsOptional()
  @IsString()
  questId: string;

  @IsDate()
  date: Date;

  @IsNumber()
  participants: number;

  @IsNumber()
  price: number;

  @IsEnum(OrderStatus)
  status: OrderStatus;

  @IsDate()
  createdAt: Date;

  @IsDate()
  updatedAt: Date;
}
