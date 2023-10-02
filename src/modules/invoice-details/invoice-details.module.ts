import { TypeOrmModule } from "@nestjs/typeorm";
import { AppGateway } from "src/gateway/gateway";
import { UsersModule } from "src/modules/users/users.module";
import { AuthGuard } from "src/modules/auth/guard/auth.guard";
import { InvoiceDetail } from "./entities/invoice-detail.entity";
import { InvoiceDetailsService } from "./invoice-details.service";
import { ConceptsModule } from "src/modules/concepts/concepts.module";
import { InvoicesModule } from "src/modules/invoices/invoices.module";
import { ConceptsService } from "src/modules/concepts/concepts.service";
import { InvoiceDetailsController } from "./invoice-details.controller";
import { forwardRef, Module, NestModule, MiddlewareConsumer, RequestMethod } from "@nestjs/common";
import { ValidateInvoiceDetailsMiddleware } from "./middlewares/validate-invoice-details.middleware";

@Module({
  imports: [
    TypeOrmModule.forFeature([InvoiceDetail]),
    UsersModule,
    ConceptsModule,
    forwardRef(() => InvoicesModule)
  ],
  controllers: [InvoiceDetailsController],
  providers: [InvoiceDetailsService, ConceptsService, AppGateway],
  exports: [TypeOrmModule, AppGateway]
})
export class InvoiceDetailsModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthGuard)
      .forRoutes(InvoiceDetailsController)
      .apply(ValidateInvoiceDetailsMiddleware)
      .forRoutes(
        {
          path: "invoice-details/:id",
          method: RequestMethod.GET
        },
        {
          path: "invoice-details/:id",
          method: RequestMethod.PATCH
        },
        {
          path: "invoice-details/:id",
          method: RequestMethod.DELETE
        }
      );
  }
}
