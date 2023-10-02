import helmet from "helmet";
import * as morgan from "morgan";
import { AppModule } from "./app.module";
import { NestFactory } from "@nestjs/core";
import { ConfigService } from "@nestjs/config";
import { ValidationPipe } from "@nestjs/common";
import { LoggerService } from "./utils/services/logger.services";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new LoggerService()
  });

  const port = app.get(ConfigService).get("PORT");

  const version = app.get(ConfigService).get("API_VERSION");

  app.use(morgan("dev"));

  app.enableCors({
    origin: "*",
    methods: ["GET", "POST", "PATCH", "DELETE"]
  });

  app.use(helmet());

  app.setGlobalPrefix(version);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true
      }
    })
  );

  const config = new DocumentBuilder()
    .setTitle("CS3 Test")
    .setDescription("The CS3 API")
    .setVersion("1.0")
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("docs", app, document);

  await app.listen(port || 3001);

  console.log(`Application running on: ${await app.getUrl()}`);
}
bootstrap();
