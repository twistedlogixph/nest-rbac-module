import { Request, Response, NextFunction } from "express";
import {
   Injectable,
   Logger,
   NestMiddleware,
   UnauthorizedException,
} from "@nestjs/common";
import { RbacCache } from "./rbac.cache";

/**
 * wraps all request with this middleware to identity role of currently logged-in user
 */
@Injectable()
export class RbacMiddleware implements NestMiddleware {
   private readonly logger = new Logger(RbacMiddleware.name);
   constructor(private readonly rbacCache: RbacCache) {
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
      const { customParams } = auth;
      const role = await this.rbacCache.getByRoleId(customParams?.roleId);
      req.role = role;
      next();
   }
}
