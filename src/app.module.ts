import { Module } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";
import { AppGateway } from "./gateway/gateway";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthModule } from "./modules/auth/auth.module";
import { UsersModule } from "./modules/users/users.module";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { InvoicesModule } from "./modules/invoices/invoices.module";
import { ThrottlerModule, ThrottlerGuard } from "@nestjs/throttler";
import { ConceptsModule } from "./modules/concepts/concepts.module";
import { InvoiceDetailsModule } from "./modules/invoice-details/invoice-details.module";
import { ThirdPartyInvoicedsModule } from "./modules/third-party-invoiceds/third-party-invoiceds.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: "config.env"
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 1 * 60 * 1000, // * 1 minute
        limit: 100
      }
    ]),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        type: "mysql",
        host: configService.get<string>("DB_HOST"),
        port: configService.get<number>("DB_PORT"),
        username: configService.get<string>("DB_USERNAME"),
        password: configService.get<string>("DB_PASSWORD"),
        database: configService.get<string>("DB_DATABASE"),
        autoLoadEntities: true,
        synchronize: true
      }),
      inject: [ConfigService]
    }),
    ThirdPartyInvoicedsModule,
    InvoiceDetailsModule,
    InvoicesModule,
    ConceptsModule,
    UsersModule,
    AuthModule
  ],
  controllers: [],
  providers: [
    AppGateway,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard
    }
  ]
})
export class AppModule {}
