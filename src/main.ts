import { RedisCacheInterceptor } from './common/interceptors/redis-cache.interceptor'; // <-- Import RedisCacheInterceptor
import { HttpExceptionFilter } from './common/decorators/http-exception.filter'; // <-- Import HttpExceptionFilter
import { swaggerConfigInit } from './config/swagger.config';
import { ValidationPipe } from '@nestjs/common';
import { RedisService } from './modules/redis/redis.service';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  swaggerConfigInit(app);

  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new HttpExceptionFilter());

  const redisService = app.get(RedisService);
  app.useGlobalInterceptors(new RedisCacheInterceptor(redisService));

  const { PORT = 3000 } = process.env;
  await app.listen(PORT);

  console.log(`🚀 Server is running on http://localhost:${PORT}`);
  console.log(`📚 Swagger Docs available at http://localhost:${PORT}/swagger`);
}

bootstrap();
