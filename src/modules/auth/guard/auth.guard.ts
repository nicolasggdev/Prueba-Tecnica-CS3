import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { NextFunction, Request, Response } from "express";
import { User } from "src/modules/users/entities/user.entity";
import { UsersService } from "src/modules/users/users.service";
import { Injectable, NestMiddleware, HttpException, HttpStatus } from "@nestjs/common";

interface CustomRequest extends Request {
  currentUser?: User;
}

@Injectable()
export class AuthGuard implements NestMiddleware {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UsersService,
    private readonly configService: ConfigService
  ) {}

  async use(req: CustomRequest, res: Response, next: NextFunction) {
    console.log("Validating existence of the token in the headers");

    let token: string | undefined;

    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }

    try {
      if (!token) {
        console.error("Invalid token");

        throw new HttpException("Invalid token", HttpStatus.UNAUTHORIZED);
      }

      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get("JWT_SECRET")
      });

      const user = await this.userService.findUserById(payload.userId);

      if (!user) {
        console.error("Invalid token");

        throw new HttpException("Invalid token", HttpStatus.UNAUTHORIZED);
      }

      console.log("Valid user. Next()");

      req.currentUser = user;

      next();
    } catch (error) {
      console.error(`Invalid token: ${error}`);

      throw new HttpException("Invalid token", HttpStatus.UNAUTHORIZED);
    }
  }
}
