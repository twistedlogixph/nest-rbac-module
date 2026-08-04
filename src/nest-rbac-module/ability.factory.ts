import { Ability, AbilityBuilder, AbilityClass } from "@casl/ability";
import { Injectable } from "@nestjs/common";
import { AppActions, AppAbility, RbacConfig, RoleCache } from "./interface";
import { AppSubjects } from "src/nest-rbac-module/interface";
import { ConfigService } from "@nestjs/config";
import { RBAC_CONFIG_KEY } from "./constants";
@Injectable()
export class AbilityFactory {
   constructor(private readonly configService: ConfigService) {}
   defineAbility(role: RoleCache) {
      const { serviceName } =
         this.configService.get<RbacConfig>(RBAC_CONFIG_KEY);
      //define rules
      const { can: allow, build } = new AbilityBuilder(
         Ability as AbilityClass<AppAbility>,
      );

      if (role?.superadmin) {
         allow(AppActions.Manage, "all"); //grant full access to superadmin
      } else {
         //define abilities here...
         const { permissions } = role;

         const service = permissions[serviceName];

         Object.keys(service).forEach((subject: string) => {
            const entityPermission = service[subject];
            Object.keys(entityPermission).forEach((action: string) => {
               const hasAccess = entityPermission[action] as boolean;
               if (hasAccess) {
                  allow(action as AppActions, subject as AppSubjects);
               }
            });
         });
      }

      return build();
   }
}
