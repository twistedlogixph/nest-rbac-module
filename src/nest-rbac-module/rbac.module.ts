import { DynamicModule, Global, Module } from "@nestjs/common";
import { AbilityFactory } from "./ability.factory";
import { ConfigModule } from "@nestjs/config";
import config from "./config/config";
import { RbacGuard } from "./rbac.guard";
import { APP_GUARD } from "@nestjs/core";
import { RbacCache } from "./rbac.cache";
import { RedisCacheModule } from "@twistedlogixph/redis-cache-module";
import cache from "./config/cache";

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
            RedisCacheModule.forRoot(
               {
                  host: cache().host,
                  port: cache().port,
                  authPass: cache().authPass,
                  ttl: cache().ttl,
                  db: cache().db,
               },
               config().cacheConnectionName,
            ),
         ],
         providers: [
            AbilityFactory,
            {
               provide: APP_GUARD,
               useClass: RbacGuard,
            },
            RbacCache,
         ],
         exports: [AbilityFactory],
         global: true,
      };
   }
}
