import { CacheModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RedisConfiguration } from 'src/config/configuration';
import * as redisStore from 'cache-manager-redis-store';
import { RedisConfig } from 'src/config/types/redis.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Campaign } from './campaigns.entity';
import { CampaignsController } from './campaigns.controller';
import { CampaignsService } from './campaigns.service';
import { ImagesModule } from '../images/images.module';
import { AutomapperModule } from '@automapper/nestjs';
import { classes } from '@automapper/classes';
import { CampaignProfile } from './campaigns.profile';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [RedisConfiguration],
    }),
    AutomapperModule.forRoot({
      options: [{ name: 'classMapper', pluginInitializer: classes }],
      singular: true,
    }),
    CacheModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        name: 'redis',
        store: redisStore as any,
        host: configService.get<RedisConfig>('redisConfig').redisHost,
        port: configService.get<RedisConfig>('redisConfig').redisPort,
      }),
    }),
    TypeOrmModule.forFeature([Campaign]),
    ImagesModule,
  ],
  controllers: [CampaignsController],
  providers: [CampaignsService, CampaignProfile],
})
export class CampaignsModule {}
