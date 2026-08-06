import { Inject, Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { getRedisCacheServiceToken } from "@twistedlogixph/redis-cache-module";
import { RbacConfig, RoleCache } from "./interface";
import { RBAC_CONFIG_KEY } from "./constants";

@Injectable()
export class RbacCache {
   private logger = new Logger(RbacCache.name);
   public config: RbacConfig;
   constructor(
      private readonly configService: ConfigService,
      @Inject(getRedisCacheServiceToken("permission"))
      private readonly permissionCacheService: any,
   ) {
      this.config = this.configService.get<RbacConfig>(RBAC_CONFIG_KEY);
   }

   toKey(roleId: number | string): string {
      return `${this.config.cacheKey}-${roleId}`;
   }

   async getByRoleId(roleId: number): Promise<RoleCache> {
      const key = this.toKey(roleId);
      const role = await this.permissionCacheService.get(key);
      // if (!role) {
      //    this.logger.error(`Role with ID ${roleId} not found in cache.`);
      //    throw new Error(
      //       `Unable to retrieve role and permission settings. Please contact the system administrator.`,
      //    );
      // }
      return role;
   }
}
