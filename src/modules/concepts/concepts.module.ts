import { TypeOrmModule } from "@nestjs/typeorm";
import { Concept } from "./entities/concept.entity";
import { ConceptsService } from "./concepts.service";
import { ConceptsController } from "./concepts.controller";
import { UsersModule } from "src/modules/users/users.module";
import { AuthGuard } from "src/modules/auth/guard/auth.guard";
import { Module, MiddlewareConsumer, NestModule, RequestMethod } from "@nestjs/common";
import { ValidateConceptsMiddleware } from "./middlewares/validate-concepts.middleware";

@Module({
  imports: [TypeOrmModule.forFeature([Concept]), UsersModule],
  controllers: [ConceptsController],
  providers: [ConceptsService],
  exports: [TypeOrmModule]
})
export class ConceptsModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthGuard)
      .forRoutes(ConceptsController)
      .apply(ValidateConceptsMiddleware)
      .forRoutes(
        {
          path: "concepts/:id",
          method: RequestMethod.GET
        },
        {
          path: "concepts/:id",
          method: RequestMethod.PATCH
        },
        {
          path: "concepts/:id",
          method: RequestMethod.DELETE
        }
      );
  }
}
