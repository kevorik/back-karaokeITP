import { RolesModule } from "./../roles/roles.module";
import { forwardRef, Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthGuard, PassportModule } from "@nestjs/passport";
import { LocalStrategy } from "./local.strategy";
import { UsersModule } from "src/users/users.module";
import { AuthController } from "./auth.controller";
import { jwtConstants } from "./constants";
import { JwtModule } from "@nestjs/jwt";
import { JwtStrategy } from "./jwt.strategy";
import { MongooseModule } from "@nestjs/mongoose";
import UserSchema from "src/schemas/user.schema";
import { JwtAuthGuard } from "./jwt-auth.guard";
import RoleSchema from "src/schemas/role.schema";
import { MailService } from "src/mail/mail.service";
@Module({
  controllers: [AuthController],
  imports: [
    UsersModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: "60d" },
    }),
    MongooseModule.forFeature([
      { name: "User", schema: UserSchema },
      { name: "Role", schema: RoleSchema },
    ]),
    PassportModule.register({
      defaultStrategy: "jwt",
    }),
    forwardRef(() => UsersModule),
  ],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    JwtAuthGuard,
    MailService,
  ],
  exports: [AuthService, JwtAuthGuard, JwtStrategy, PassportModule, JwtModule],
})
export class AuthModule {}
