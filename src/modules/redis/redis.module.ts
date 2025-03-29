// redis.module.ts
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RedisService } from './redis.service';
import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { Redis } from 'ioredis';

import * as redisStore from 'cache-manager-ioredis';

@Module({
  imports: [
    ConfigModule,
    CacheModule.registerAsync({
      useFactory: async (configService: ConfigService) => ({
        store: redisStore,
        host: configService.get('REDIS_HOST'),
        port: configService.get('REDIS_PORT'),
        db: configService.get('REDIS_DB'),
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [
    RedisService,
    {
      provide: 'REDIS_CLIENT',
      useFactory: (configService: ConfigService) => {
        return new Redis({
          host: configService.get('REDIS_HOST'),
          port: configService.get('REDIS_PORT'),
          db: configService.get('REDIS_DB'),
        });
      },
      inject: [ConfigService],
    },
  ],
  exports: [RedisService, 'REDIS_CLIENT'],
})
export class RedisModule { }
