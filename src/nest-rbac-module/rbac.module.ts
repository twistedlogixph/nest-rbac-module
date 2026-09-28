import { DynamicModule, Global, Module } from "@nestjs/common";
import { AbilityFactory } from "./lib/ability.factory";
import { ConfigModule, ConfigService } from "@nestjs/config";
import config from "./config/config";
import { RbacGuard } from "./rbac.guard";
import { APP_GUARD } from "@nestjs/core";
import { RbacCache } from "./rbac.cache";
import cache from "./config/cache";
import { RedisCacheModule } from "@twistedlogixph/redis-cache-module";
import { RBAC_CACHE_CONFIG_KEY } from "./constants";

@Global()
@Module({
   imports: [],
   providers: [AbilityFactory, RbacCache],
   exports: [AbilityFactory],
})
export class RbacModule {
   static forRoot(): DynamicModule {
      return {
         module: RbacModule,
         imports: [
            ConfigModule.forRoot({
               load: [config, cache],
               isGlobal: true,
            }),
            RedisCacheModule.forRootAsync({
               name: "permission",
               imports: [ConfigModule],
               inject: [ConfigService],
               useFactory: (confSvc: ConfigService) => {
                  const redisConf = confSvc.getOrThrow(RBAC_CACHE_CONFIG_KEY);
                  return {
                     host: redisConf.host,
                     port: redisConf.port,
                     database: redisConf.db,
                     ttl: redisConf.ttl ?? 0,
                     authPass: redisConf.authPass,
                  };
               },
            }),
         ],
         providers: [
            AbilityFactory,
            {
               provide: APP_GUARD,
               useClass: RbacGuard,
            },
            RbacCache,
         ],
         exports: [AbilityFactory, RbacCache],
         global: true,
      };
   }
}
