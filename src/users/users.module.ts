import { MinioClientService } from "./../minio-client/minio-client.service";
import { Module } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { MongooseModule } from "@nestjs/mongoose";
import { AuthModuleOptions } from "@nestjs/passport";
import { AuthService } from "src/auth/auth.service";
import RoleSchema from "src/schemas/role.schema";
import UserSchema from "src/schemas/user.schema";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";
import { MinioClientModule } from "src/minio-client/minio-client.module";
import FileSchema from "src/schemas/file.schema";
import { MailService } from "src/mail/mail.service";

@Module({
  providers: [
    UsersService,
    JwtService,
    AuthModuleOptions,
    AuthService,
    MailService,
  ],
  controllers: [UsersController],
  exports: [UsersService],
  imports: [
    MinioClientModule,
    MongooseModule.forFeature([
      { name: "User", schema: UserSchema },
      { name: "Role", schema: RoleSchema },
      { name: "File", schema: FileSchema },
    ]),
  ],
})
export class UsersModule {}
