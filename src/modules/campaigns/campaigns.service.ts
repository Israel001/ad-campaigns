import {
  BadRequestException,
  CACHE_MANAGER,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ImagesService } from '../images/images.service';
import {
  CampaignDto,
  CampaignQuery,
  CreateCampaignDto,
  UpdateCampaignDto,
} from './campaigns.dto';
import { Campaign } from './campaigns.entity';
import { Cache } from 'cache-manager';
import { ConfigService } from '@nestjs/config';
import { RedisConfig } from 'src/config/types/redis.config';
import { CacheKeys } from 'src/enums/cacheKeys';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/types';

@Injectable()
export class CampaignsService {
  private cacheTtl: number;
  public logger = new Logger(CampaignsService.name);

  constructor(
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    @InjectRepository(Campaign) public campaignRepository: Repository<Campaign>,
    @InjectMapper() private readonly mapper: Mapper,
    private readonly imageService: ImagesService,
    private readonly configService: ConfigService,
  ) {
    this.cacheTtl =
      this.configService.get<RedisConfig>('redisConfig').cacheExpiry;
  }

  async create(request: CreateCampaignDto) {
    const campaignModel = this.validateAndCreateModel(request);

    const campaign = await campaignModel.save();

    this.logger.debug(
      `Successfully created campaign with name: ${campaign.name}`,
    );

    if (request.images && request.images.length)
      await this.imageService.upload(request.images, campaign.id);

    this.cacheManager.reset();

    return campaign;
  }

  async fetch(_request: CampaignQuery) {
    // const { pagination = {} } = request;
    // const orderBy =
    //   pagination.orderBy && ['name', 'createdAt'].includes(pagination.orderBy)
    //     ? pagination.orderBy
    //     : 'createdAt';
    // const orderDir = pagination.orderDir || 'ASC';

    const cacheKey = `${CacheKeys.CAMPAIGN_DATA}`;
    const cachedCampaigns: string = await this.cacheManager.get(cacheKey);
    console.log('here', cacheKey, cachedCampaigns);
    if (cachedCampaigns) {
      this.logger.debug('Got campaigns from cache');
      return JSON.parse(cachedCampaigns);
    }

    const data = await this.campaignRepository.find();

    await this.cacheManager.set(cacheKey, JSON.stringify(data), this.cacheTtl);

    return data;

    // return data.sort((a, b) => {
    //   if (orderBy === "createdAt") {
    //     return orderDir === OrderDir.ASC ? a.createdAt.getTime() - b.createdAt.getTime() : b.createdAt.getTime() - a.createdAt.getTime()
    //   }
    //   return a.name.localeCompare(b.name)
    // });
  }

  async get(id: number) {
    const campaign = await this.campaignRepository.findOneBy({ id });
    const campaignDto = this.mapper.map(campaign, CampaignDto, Campaign);
    campaignDto.images = await campaign.images;
    return campaignDto;
  }

  async getImages(id: number) {
    return this.imageService.fetch(id);
  }

  async update(id: number, request: UpdateCampaignDto) {
    let campaign: Campaign;
    campaign = await this.campaignRepository.findOneBy({ id });
    if (!campaign) throw new NotFoundException('Campaign does not exist');

    const campaignModel = this.validateAndCreateModel(request);
    campaign = await this.campaignRepository.save({ id, ...campaignModel });

    this.logger.debug(`Successfully updated campaign with ID: ${id}`);

    if (request.images && request.images.length)
      await this.imageService.upload(request.images, campaign.id);

    if (request.imagesToDelete && request.imagesToDelete.length)
      this.imageService.delete(request.imagesToDelete, campaign.id);

    this.cacheManager.reset();

    return campaign;
  }

  private validateAndCreateModel(
    request: CreateCampaignDto | UpdateCampaignDto,
  ): Campaign {
    const from = request.from && new Date(request.from);
    const to = request.to && new Date(request.to);
    const totalBudget =
      request.totalBudget &&
      parseFloat(parseFloat(request.totalBudget).toFixed(2));
    const dailyBudget =
      request.dailyBudget &&
      parseFloat(parseFloat(request.dailyBudget).toFixed(2));

    if (from > to)
      throw new BadRequestException(
        'The `from` date cannot be greater than the `to` date',
      );
    if (dailyBudget > totalBudget)
      throw new BadRequestException(
        'The `dailyBudget` cannot be greater than the `totalBudget`',
      );

    return this.campaignRepository.create({
      name: request.name,
      from,
      to,
      totalBudget,
      dailyBudget,
    });
  }
}
