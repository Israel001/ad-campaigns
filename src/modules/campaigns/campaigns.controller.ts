import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { CampaignImagesValidationInterceptor } from 'src/lib/interceptors/campaign-images-validation-interceptor';
import {
  CampaignQuery,
  CreateCampaignDto,
  UpdateCampaignDto,
} from './campaigns.dto';
import { CampaignsService } from './campaigns.service';

@Controller('campaigns')
export class CampaignsController {
  constructor(private readonly campaignService: CampaignsService) {}

  @Post()
  @UseInterceptors(
    FilesInterceptor('images', null, {
      fileFilter: (_req, file, cb) =>
        file.mimetype.includes('image')
          ? cb(null, true)
          : cb(new BadRequestException('Only images are allowed'), false),
    }),
    new CampaignImagesValidationInterceptor(),
  )
  async create(@Body() body: CreateCampaignDto) {
    return this.campaignService.create(body);
  }

  @Get()
  async fetch(@Query() query: CampaignQuery) {
    return this.campaignService.fetch(query);
  }

  @Get(':id')
  async get(@Param('id', ParseIntPipe) id: number) {
    return this.campaignService.get(id);
  }

  @Get(':id/images')
  async getImages(@Param('id', ParseIntPipe) id: number) {
    return this.campaignService.getImages(id);
  }

  @Put(':id')
  @UseInterceptors(
    FilesInterceptor('images', null, {
      fileFilter: (_req, file, cb) =>
        file.mimetype.includes('image')
          ? cb(null, true)
          : cb(new BadRequestException('Only images are allowed'), false),
    }),
    new CampaignImagesValidationInterceptor(),
  )
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateCampaignDto,
  ) {
    return this.campaignService.update(id, body);
  }
}
