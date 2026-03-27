import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import configuration, { configValidationSchema } from './config/configuration';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { SessionsModule } from './sessions/sessions.module';
import { MoodsModule } from './moods/moods.module';
import { ResourcesModule } from './resources/resources.module';
import { PostsModule } from './posts/posts.module';
import { VictoriesModule } from './victories/victories.module';
import { ChatModule } from './chat/chat.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { HealthModule } from './health/health.module';
import { AppCacheModule } from './cache/cache.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      validationSchema: configValidationSchema,
    }),
    AppCacheModule,
    // Global rate limiting: 100 req / 60 s per IP
    ThrottlerModule.forRoot([
      {
        name: 'default',
        ttl: 60_000,
        limit: 100,
      },
    ]),
    DatabaseModule,
    AuthModule,
    SessionsModule,
    MoodsModule,
    ResourcesModule,
    PostsModule,
    VictoriesModule,
    ChatModule,
    AnalyticsModule,
    HealthModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
