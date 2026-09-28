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
         auth: TokenAuth;
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
   integrationScopes?: string[];
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
   integrationScope: string;
   deletedAt?: Date;
}

interface TokenPayload {
   roleId: number;
}
interface TokenAuth {
   userid: string | number;
   scope: string;
   appId: string;
   customParams: TokenPayload;
}

interface JwtVerifyConf {
   publicKey: string;
   iss: string;
   sub: string;
   aud: string;
}

export type {
   AppAbility,
   AppSubjects,
   RbacMetaData,
   RbacConfig,
   RoleCache,
   TokenPayload,
   TokenAuth,
   JwtVerifyConf,
};
