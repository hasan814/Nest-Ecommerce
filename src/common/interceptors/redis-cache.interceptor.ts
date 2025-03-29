
import { ExecutionContext, CallHandler } from '@nestjs/common';
import { Injectable, NestInterceptor } from '@nestjs/common';
import { Observable, of } from 'rxjs';
import { RedisService } from 'src/modules/redis/redis.service';
import { tap } from 'rxjs/operators';

@Injectable()
export class RedisCacheInterceptor implements NestInterceptor {
  constructor(private readonly redisService: RedisService) { }

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    const req = context.switchToHttp().getRequest();
    if (req.method !== 'GET') return next.handle();
    const key = req.originalUrl;
    const cachedResponse = await this.redisService.get(key);
    if (cachedResponse) return of(cachedResponse);
    return next.handle().pipe(
      tap(async (data) => {
        await this.redisService.set(key, data, 3600);
      }),
    );
  }
}
