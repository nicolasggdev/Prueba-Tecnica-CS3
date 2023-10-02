import { Module } from "@nestjs/common";
import { User } from "./entities/user.entity";
import { UsersService } from "./users.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AppGateway } from "src/gateway/gateway";

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [],
  providers: [UsersService, AppGateway],
  exports: [TypeOrmModule, UsersService, AppGateway]
})
export class UsersModule {}
