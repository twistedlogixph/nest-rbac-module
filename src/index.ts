import { RbacModule } from "./nest-rbac-module/rbac.module";
import { RbacMiddleware } from "./nest-rbac-module/rbac.middleware";
import { RbacGuard } from "./nest-rbac-module/rbac.guard";
import { Rbac } from "./nest-rbac-module/rbac.decorator";
import { RbacCache } from "./nest-rbac-module/rbac.cache";
import { AbilityFactory } from "./nest-rbac-module/ability.factory";
import {
   RBAC_METADATA_KEY,
   RBAC_CONFIG_KEY,
   RBAC_CACHE_CONFIG_KEY,
} from "./nest-rbac-module/constants";

import type {
   AppAbility,
   AppSubjects,
   RbacMetaData,
   RbacConfig,
   RoleCache,
} from "./nest-rbac-module/interface";

export {
   RbacModule,
   RbacMiddleware,
   RbacGuard,
   Rbac,
   RbacCache,
   AbilityFactory,
   RBAC_METADATA_KEY,
   RBAC_CONFIG_KEY,
   RBAC_CACHE_CONFIG_KEY,
};
export type { AppAbility, AppSubjects, RbacMetaData, RbacConfig, RoleCache };
