import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
// import { server as serverConfig } from "../config/server";
// import bodyParser from "body-parser";
// import SERVER_PORT from "environment"
import { ConfigService } from "@nestjs/config";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.setGlobalPrefix("/api/v1");
  const swaggerOpts = new DocumentBuilder()
    .setTitle("ITP Admin API")
    .setVersion("1.0")
    .build();
  const document = SwaggerModule.createDocument(app, swaggerOpts);
  SwaggerModule.setup("api/v1", app, document);
  app.enableCors({
    allowedHeaders:
      "X-Requested-With, Origin, Authorization, Content-Type, Accept",
    exposedHeaders: "Authorization",
    methods: "GET, POST, PUT, PATCH, HEAD, DELETE",
    origin: "*",
  });
  // app.use(bodyParser.urlencoded({ extended: true }));
  // app.use(bodyParser.json());
  await app.listen(app.get(ConfigService).get("SERVER_PORT"));
}
bootstrap();
