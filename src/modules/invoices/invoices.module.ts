import { TypeOrmModule } from "@nestjs/typeorm";
import { Invoice } from "./entities/invoice.entity";
import { InvoicesService } from "./invoices.service";
import { InvoicesController } from "./invoices.controller";
import { UsersModule } from "src/modules/users/users.module";
import { AuthGuard } from "src/modules/auth/guard/auth.guard";
import { UsersService } from "src/modules/users/users.service";
import { ConceptsModule } from "src/modules/concepts/concepts.module";
import { ConceptsService } from "src/modules/concepts/concepts.service";
import { ValidateInvoicesMiddleware } from "./middlewares/validate-invoices.middleware";
import { InvoiceDetailsModule } from "src/modules/invoice-details/invoice-details.module";
import { InvoiceDetailsService } from "src/modules/invoice-details/invoice-details.service";
import { forwardRef, Module, NestModule, MiddlewareConsumer, RequestMethod } from "@nestjs/common";
import { ValidateInvoicesByNumberMiddleware } from "./middlewares/validate-invoices-by-number.middleware";
import { ThirdPartyInvoicedsModule } from "src/modules/third-party-invoiceds/third-party-invoiceds.module";
import { ThirdPartyInvoicedsService } from "src/modules/third-party-invoiceds/third-party-invoiceds.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([Invoice]),
    ThirdPartyInvoicedsModule,
    UsersModule,
    ConceptsModule,
    forwardRef(() => InvoiceDetailsModule)
  ],
  controllers: [InvoicesController],
  providers: [
    InvoicesService,
    ThirdPartyInvoicedsService,
    UsersService,
    ConceptsService,
    InvoiceDetailsService
  ],
  exports: [TypeOrmModule, InvoicesService]
})
export class InvoicesModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthGuard)
      .forRoutes(InvoicesController)
      .apply(ValidateInvoicesMiddleware)
      .forRoutes(
        {
          path: "invoices/:id",
          method: RequestMethod.GET
        },
        {
          path: "invoices/:id",
          method: RequestMethod.PATCH
        },
        {
          path: "invoices/:id",
          method: RequestMethod.DELETE
        }
      )
      .apply(ValidateInvoicesByNumberMiddleware)
      .forRoutes({
        path: "invoices",
        method: RequestMethod.POST
      });
  }
}
