import { Request, Response, NextFunction } from "express";
import {
   Injectable,
   Logger,
   NestMiddleware,
   UnauthorizedException,
} from "@nestjs/common";
import { RbacCache } from "../rbac.cache";
import { RbacConfig, RoleCache, TokenAuth } from "../interface";
import { ConfigService } from "@nestjs/config";
import { RBAC_CONFIG_KEY } from "../constants";

/**
 * wraps all request with this middleware to identity role of currently logged-in user
 */
@Injectable()
export class RbacMiddleware implements NestMiddleware {
   private readonly logger = new Logger(RbacMiddleware.name);
   constructor(
      private readonly rbacCache: RbacCache,
      private readonly configService: ConfigService,
   ) {
      this.logger.log("RbacMiddleware dependencies initialized");
   }
   async use(req: Request, res: Response, next: NextFunction) {
      const { auth } = req;
      if (!auth) {
         return next(
            new UnauthorizedException(
               "You are unauthorized to access this resource.",
            ),
         );
      }

      const { integrationScopes } =
         this.configService.get<RbacConfig>(RBAC_CONFIG_KEY);

      const { customParams, scope } = auth as TokenAuth;
      let role: RoleCache;
      if ((integrationScopes || []).includes(scope)) {
         role = await this.rbacCache.getByRoleIntegrationScope(scope);
      } else {
         role = await this.rbacCache.getByRoleId(customParams?.roleId);
      }
      req.role = role;
      next();
   }
}
