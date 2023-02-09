import { AutoMap } from '@automapper/classes';
import { Type } from 'class-transformer';
import {
  IsNumberString,
  IsOptional,
  IsString,
  Length,
  ValidateNested,
} from 'class-validator';
import { PaginationInput } from 'src/base/dto';
import { IsValidDate } from 'src/tools/date-validator';
import { Image } from '../images/images.entity';

export class CampaignImage {
  buffer: Buffer;
  mimetype: string;
}

export class CampaignDto {
  @AutoMap()
  name: string;

  @AutoMap()
  from: Date;

  @AutoMap()
  to: Date;

  @AutoMap()
  totalBudget: number;

  @AutoMap()
  dailyBudget: number;

  images?: Image[];
}

export class UpdateCampaignDto {
  @IsString()
  @Length(1, 50)
  @IsOptional()
  name: string;

  @IsValidDate()
  @IsOptional()
  from: Date;

  @IsValidDate()
  @IsOptional()
  to: Date;

  @IsNumberString()
  @IsOptional()
  totalBudget: string;

  @IsNumberString()
  @IsOptional()
  dailyBudget: string;

  images: CampaignImage[];

  @IsString({ each: true })
  @IsOptional()
  imagesToDelete: string[];
}

export class CreateCampaignDto {
  @IsString()
  @Length(1, 50)
  name: string;

  @IsValidDate()
  from: Date;

  @IsValidDate()
  to: Date;

  @IsNumberString()
  totalBudget: string;

  @IsNumberString()
  dailyBudget: string;

  images: CampaignImage[];
}

export class CampaignQuery {
  @ValidateNested()
  @Type(() => PaginationInput)
  @IsOptional()
  pagination?: PaginationInput;
}
