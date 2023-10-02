import { TypeOrmModule } from "@nestjs/typeorm";
import { AppGateway } from "src/gateway/gateway";
import { UsersModule } from "src/modules/users/users.module";
import { AuthGuard } from "src/modules/auth/guard/auth.guard";
import { ThirdPartyInvoiced } from "./entities/third-party-invoiced.entity";
import { ThirdPartyInvoicedsService } from "./third-party-invoiceds.service";
import { ThirdPartyInvoicedsController } from "./third-party-invoiceds.controller";
import { Module, NestModule, MiddlewareConsumer, RequestMethod } from "@nestjs/common";
import { ValidateThirdPartyInvoicedsMiddleware } from "./middlewares/validate-third-party-invoiceds.middleware";
import { ValidateNameThirdPartyInvoicedsMiddleware } from "./middlewares/validate-name-third-party-invoiceds.middleware";

@Module({
  imports: [TypeOrmModule.forFeature([ThirdPartyInvoiced]), UsersModule],
  controllers: [ThirdPartyInvoicedsController],
  providers: [ThirdPartyInvoicedsService, AppGateway],
  exports: [TypeOrmModule, AppGateway]
})
export class ThirdPartyInvoicedsModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthGuard)
      .forRoutes(ThirdPartyInvoicedsController)
      .apply(ValidateThirdPartyInvoicedsMiddleware)
      .forRoutes(
        {
          path: "third-party-invoiceds/withInvoices/:id",
          method: RequestMethod.GET
        },
        {
          path: "third-party-invoiceds/:id",
          method: RequestMethod.GET
        },
        {
          path: "third-party-invoiceds/:id",
          method: RequestMethod.PATCH
        },
        {
          path: "third-party-invoiceds/:id",
          method: RequestMethod.DELETE
        }
      )
      .apply(ValidateNameThirdPartyInvoicedsMiddleware)
      .forRoutes(
        {
          path: "third-party-invoiceds",
          method: RequestMethod.POST
        },
        {
          path: "third-party-invoiceds/:id",
          method: RequestMethod.PATCH
        }
      );
  }
}
