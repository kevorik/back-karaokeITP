import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { forwardRef, Module } from "@nestjs/common";
// import { database as config } from "../config/database";
import { UsersModule } from "./users/users.module";
import UserSchema from "./schemas/user.schema";
import RoleSchema from "./schemas/role.schema";
import { RolesModule } from "./roles/roles.module";
import { AuthModule } from "./auth/auth.module";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { MinioClientModule } from "./minio-client/minio-client.module";
import { ImageUploadModule } from "./image-upload/image-upload.module";
import FileSchema from "./schemas/file.schema";
import GeterateDBuri from "./db/generate.db.url";
import { MongooseModule } from "@nestjs/mongoose";

// const connStr = `mongodb://${config.username}:${config.password}@${config.host}:${config.port}/${config.db}?authSource=${config.db}`;

@Module({
  imports: [
    UsersModule,
    RolesModule,
    AuthModule,
    MinioClientModule,
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forFeature([
      { name: "User", schema: UserSchema },
      { name: "Role", schema: RoleSchema },
      { name: "File", schema: FileSchema },
    ]),
    MongooseModule.forRootAsync({
      // connectionName: "karaoke-itp",
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        uri: GeterateDBuri(config),
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }),
    }),

    ImageUploadModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
