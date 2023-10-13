import { MailService } from "./../mail/mail.service";
import { MailerService } from "@nestjs-modules/mailer";
import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { JwtAuthGuard } from "./jwt-auth.guard";
// import { server as serverConfig } from "../../config/server";

@Controller("/auth")
export class AuthController {
  constructor(
    private authService: AuthService,
    private mailService: MailService
  ) {}

  @Post("login")
  async login(@Body() body) {
    return this.authService.login(body);
  }
  @Post("register")
  async register(@Body() body) {
    return this.authService.registerUser(body);
  }
  @Get("validatetoken")
  // @UseGuards(JwtAuthGuard)
  async validateToken(): Promise<any> {
    return Promise.resolve({ status: true });
  }
  @Post("forgot")
  async forgot(@Body() body, @Param() id: string) {
    return this.authService.forgotPassword(body, id);
  }
  @Post("reset/:recovery_code")
  async resetPassword(@Body() body, @Param() recovery_code: string) {
    return "Success";
  }
  // @Post("forgots")
  // async forgots(@Body("email") email: string) {
  //   return this.authService.forgotPasswords(email);
  // }
}
