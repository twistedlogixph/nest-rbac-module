import { Ability } from "@casl/ability";

export enum AppActions {
   Manage = "manage",
   Create = "create",
   Read = "read",
   Update = "update",
   Delete = "delete",
}

declare global {
   namespace Express {
      interface Request {
         role: RoleCache;
      }
   }
}

type AppSubjects = "all";
type AppAbility = Ability<[AppActions, AppSubjects]>;

/* define subjects of different services here...*/
interface RbacMetaData<T = AppSubjects> {
   serviceName?: string;
   action: AppActions;
   resource: T;
}

interface RbacConfig {
   serviceName: string;
   cacheKey: string;
   cacheConnectionName: string;
}

interface RoleCache {
   id: number;
   name: string;
   permissions: any;
   createdAt: Date;
   updatedAt: Date;
   superadmin: boolean;
   navSections: any;
   isIntegration: boolean;
   deletedAt?: Date;
}

export type { AppAbility, AppSubjects, RbacMetaData, RbacConfig, RoleCache };
