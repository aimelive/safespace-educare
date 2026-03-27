import { CacheModule } from "@nestjs/cache-manager";
import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { redisStore } from "cache-manager-redis-yet";

@Module({
  imports: [
    CacheModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const store = configService.get<string>("cache.store") ?? "memory";
        const ttlMs = configService.get<number>("cache.ttlMs") ?? 60000;
        const ttlSeconds = Math.ceil(ttlMs / 1000);

        if (store === "redis") {
          const redisUrl = configService.get<string>("cache.redisUrl");
          if (!redisUrl) {
            throw new Error(
              "CACHE_REDIS_URL is required when CACHE_STORE=redis",
            );
          }
          return {
            store: await redisStore({ url: redisUrl, ttl: ttlSeconds }),
          };
        }

        return {
          ttl: ttlSeconds,
          max: 1000,
        };
      },
    }),
  ],
})
export class AppCacheModule {}
