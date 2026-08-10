import { InternalServerErrorException } from "@nestjs/common";
import { registerAs } from "@nestjs/config";
import { RBAC_CACHE_CONFIG_KEY } from "../constants";

require("dotenv").config();
//--- ENV Config Checking
const cacheHost = process.env.RBAC_CACHE_HOST;
const cacheDb = process.env.RBAC_CACHE_DBNUMBER;

if (!cacheHost) {
   throw new InternalServerErrorException(
      "Missing environment variable: RBAC_CACHE_HOST",
   );
}
if (!cacheDb) {
   throw new InternalServerErrorException(
      "Missing environment variable: RBAC_CACHE_DBNUMBER",
   );
}

export default registerAs(RBAC_CACHE_CONFIG_KEY, () => {
   const conf: any = {
      host: cacheHost,
      port: +process.env.RBAC_CACHE_PORT || 6379,
      ttl: process.env.RBAC_CACHE_TTL ? +process.env.RBAC_CACHE_TTL : 0,
      authPass: process.env.RBAC_CACHE_AUTHPASS,
      db: cacheDb,
   };
   return conf;
});
