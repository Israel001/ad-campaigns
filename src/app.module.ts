import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { RedisConfiguration } from './config/configuration';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as ormconfig from './config/ormconfig';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { AddCorrelationIdInterceptor } from './lib/interceptors/add-correlation-id-interceptor';
import { TimeoutInterceptor } from './lib/interceptors/timeout.interceptor';
import { RequestLoggerMiddleware } from './middleware/request-logger.middleware';
import { CampaignsModule } from './modules/campaigns/campaigns.module';
import { AutomapperModule } from '@automapper/nestjs';
import { classes } from '@automapper/classes';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    AutomapperModule.forRoot({
      options: [{ name: 'classMapper', pluginInitializer: classes }],
      singular: true
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'images')
    }),
    ConfigModule.forRoot({
      load: [RedisConfiguration],
    }),
    TypeOrmModule.forRoot(ormconfig),
    CampaignsModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: AddCorrelationIdInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TimeoutInterceptor,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(RequestLoggerMiddleware).forRoutes('*');
  }
}
