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

   toKey(roleId: number | string): string {
      return `${this.config.cacheKey}-${roleId}`;
   }

   async getByRoleId(roleId: number): Promise<RoleCache> {
      const key = this.toKey(roleId);
      const role = await this.permissionCacheService.get(key);
      return role as RoleCache;
   }
}
