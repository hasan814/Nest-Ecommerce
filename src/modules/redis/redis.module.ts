import { RedisService } from './redis.service';
import { Module } from '@nestjs/common';
import { Redis } from 'ioredis';

@Module({
  providers: [
    RedisService,
    {
      provide: 'REDIS_CLIENT',
      useValue: new Redis({
        host: 'localhost',
        port: 6379,
        db: 0,
      }),
    },
  ],
  exports: [RedisService],
})
export class RedisModule { }
