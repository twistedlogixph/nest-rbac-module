import { DynamicModule, Global, Module } from "@nestjs/common";
import { AbilityFactory } from "./lib/ability.factory";
import { ConfigModule } from "@nestjs/config";
import config from "./config/config";
import { RbacGuard } from "./rbac.guard";
import { APP_GUARD } from "@nestjs/core";
import { RbacCache } from "./rbac.cache";
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
