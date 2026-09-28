import { InternalServerErrorException } from "@nestjs/common";
import { registerAs } from "@nestjs/config";
import { RBAC_CONFIG_KEY } from "../constants";
import { RbacConfig } from "../interface";
require("dotenv").config();
//--- ENV Config Checking
const rbacServiceName = process.env.RBAC_SERVICE_NAME;
const cacheKey = process.env.RBAC_ROLE_KEY;
const cacheConnectionName = process.env.RBAC_CACHE_CONNECTION_NAME;
const integrationScopes = process.env.RBAC_INTEGRATION_SCOPES;
if (!rbacServiceName) {
   throw new InternalServerErrorException(
      "Missing environment variable: RBAC_SERVICE_NAME",
   );
}
if (!cacheKey) {
   throw new InternalServerErrorException(
      "Missing environment variable: RBAC_ROLE_KEY",
   );
}
if (!cacheConnectionName) {
   throw new InternalServerErrorException(
      "Missing environment variable: RBAC_CACHE_CONNECTION_NAME",
   );
}
if (!integrationScopes) {
   throw new InternalServerErrorException(
      "Missing environment variable: RBAC_INTEGRATION_SCOPES",
   );
}
export default registerAs(RBAC_CONFIG_KEY, () => {
   const conf: RbacConfig = {
      serviceName: rbacServiceName,
      cacheKey,
      cacheConnectionName,
      integrationScopes: integrationScopes.split(","),
   };
   return conf;
});
