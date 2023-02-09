import { IsEnum, IsNumber, IsNumberString, IsOptional, IsString } from 'class-validator';

export enum OrderDir {
  ASC = 'ASC',
  DESC = 'DESC',
}

export class PaginationInput {
  @IsNumberString()
  @IsOptional()
  limit?: number;

  @IsNumberString()
  @IsOptional()
  page?: number;

  @IsString()
  @IsOptional()
  orderBy?: string = '';

  @IsEnum(OrderDir)
  @IsOptional()
  orderDir?: OrderDir;
}
