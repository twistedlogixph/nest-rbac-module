import { AbilityFactory } from "./lib/ability.factory";
import { ForbiddenError } from "@casl/ability";

import {
   Injectable,
   CanActivate,
   ExecutionContext,
   ForbiddenException,
   Logger,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { RbacMetaData } from "./interface";
import { RBAC_METADATA_KEY } from "./constants";

@Injectable()
export class RbacGuard implements CanActivate {
   private readonly logger = new Logger(RbacGuard.name);
   constructor(
      private reflector: Reflector,
      private readonly abilityFactory: AbilityFactory,
   ) {}

   async canActivate(context: ExecutionContext) {
      const requirement = this.reflector.get<RbacMetaData | boolean>(
         RBAC_METADATA_KEY,
         context.getHandler(),
      );
      if (typeof requirement == "boolean") {
         return requirement;
      }

      const ctx = context.switchToHttp();
      const req = ctx.getRequest();
      const { role } = req;
      if (!role) {
         throw new ForbiddenException(
            `Unable to retrieve permission settings. Please contact the system administrator.`,
         );
      }
      const ability = this.abilityFactory.defineAbility(role);
      try {
         ForbiddenError.from(ability).throwUnlessCan(
            requirement.action,
            requirement.resource,
         );
         return true;
      } catch (error) {
         if (error instanceof ForbiddenError) {
            this.logger.error(
               `Forbidden resource: resource: ${requirement.resource}, action: ${requirement.action}`,
            );
            throw new ForbiddenException(
               `Your role is not permitted to perform this action.`,
            );
         }
      }
      return false;
   }
}
