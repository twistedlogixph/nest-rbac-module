import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { RbacConfig, RoleCache } from "./interface";
import { RBAC_CONFIG_KEY } from "./constants";
import {
   InjectRedisCacheService,
   RedisCacheService,
} from "@twistedlogixph/redis-cache-module";

@Injectable()
export class RbacCache {
   public config: RbacConfig;
   constructor(
      private readonly configService: ConfigService,
      @InjectRedisCacheService("permission")
      private readonly permissionCacheService: RedisCacheService,
   ) {
      this.config = this.configService.get<RbacConfig>(RBAC_CONFIG_KEY);
   }

   toKey(param: number | string): string {
      return `${this.config.cacheKey}-${param}`;
   }

   async getByRoleId(roleId: number): Promise<RoleCache> {
      const key = this.toKey(roleId);
      const role = await this.permissionCacheService.get(key);
      return role as RoleCache;
   }

   async getByRoleIntegrationScope(
      integrationScope: string,
   ): Promise<RoleCache> {
      const key = this.toKey(integrationScope);
      const role = await this.permissionCacheService.get(key);
      return role as RoleCache;
   }
}
