import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { JwtModule } from "@nestjs/jwt/dist";
import { AuthController } from "./auth.controller";
import { UsersModule } from "src/modules/users/users.module";

@Module({
  imports: [
    JwtModule.register({
      global: true
    }),
    UsersModule
  ],
  controllers: [AuthController],
  providers: [AuthService]
})
export class AuthModule {}
