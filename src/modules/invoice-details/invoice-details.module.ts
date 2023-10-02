import { forwardRef, Module, NestModule, MiddlewareConsumer, RequestMethod } from "@nestjs/common";
import { InvoiceDetailsService } from "./invoice-details.service";
import { InvoiceDetailsController } from "./invoice-details.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { InvoiceDetail } from "./entities/invoice-detail.entity";
import { AuthGuard } from "src/modules/auth/guard/auth.guard";
import { UsersModule } from "src/modules/users/users.module";
import { ValidateInvoiceDetailsMiddleware } from "./middlewares/validate-invoice-details.middleware";
import { ConceptsModule } from "src/modules/concepts/concepts.module";
import { ConceptsService } from "src/modules/concepts/concepts.service";
import { InvoicesModule } from "src/modules/invoices/invoices.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([InvoiceDetail]),
    UsersModule,
    ConceptsModule,
    forwardRef(() => InvoicesModule)
  ],
  controllers: [InvoiceDetailsController],
  providers: [InvoiceDetailsService, ConceptsService],
  exports: [TypeOrmModule]
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
