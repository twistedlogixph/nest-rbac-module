//nest imports
import {
   Injectable,
   Logger,
   NestMiddleware,
   UnauthorizedException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

//express imports
import { Request, Response, NextFunction } from "express";

//local imports
import JwtVerify from "../lib/jwt.verify.class";
import { JwtVerifyConf, TokenAuth } from "../interface";

@Injectable()
export class AccessTokenMiddleware implements NestMiddleware {
   private readonly logger = new Logger(AccessTokenMiddleware.name);
   private jwtConfig: JwtVerifyConf;
   constructor(private readonly configService: ConfigService) {
      this.jwtConfig = configService.get("jwt");
      this.logger.log("AccessTokenMiddleware dependencies initialized");
   }

   use(req: Request, res: Response, next: NextFunction) {
      const { authorization } = req.headers;
      const authPattern = /^(bearer)[ ]+([^ ]+)[ ]*$/i;
      const accessToken = authPattern.exec(authorization);
      if (!accessToken) {
         throw new UnauthorizedException("Invalid AccessToken");
      }

      const jwtObj = new JwtVerify(this.jwtConfig);
      jwtObj.verify(
         accessToken[2],
         async (err, verifiedToken: { auth: TokenAuth }) => {
            if (err) {
               this.logger.error(err);
               return next(
                  new UnauthorizedException(
                     "You are unauthorized to access this resource.",
                     err?.message,
                  ),
               );
            }
            const { auth } = verifiedToken;
            process.env.APP_ID = auth.appId;
            req.auth = auth;
            next();
         },
      );
   }
}
