import { JwtVerifyConf } from "../interface";

/* eslint-disable @typescript-eslint/no-var-requires */
const jsonwebtoken = require("jsonwebtoken");

class JwtVerify {
   private config: JwtVerifyConf;
   constructor(config: JwtVerifyConf) {
      this.config = config;
   }

   public verify(token, next) {
      const verifyOptions = {
         ignoreExpiration: false,
         audience: this.config.aud,
         issuer: this.config.iss,
         subject: this.config.sub,
      };
      jsonwebtoken.verify(token, this.config.publicKey, verifyOptions, next);
   }
}

export default JwtVerify;
