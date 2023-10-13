import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { AuthGuard, AuthModuleOptions } from "@nestjs/passport";
import { AuthService } from "./auth.service";
import { JwtService } from "@nestjs/jwt";
import { Request, Response } from "express";
import * as moment from "moment";
@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    protected readonly options: AuthModuleOptions,
    private readonly auth: AuthService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const authGuard = new (AuthGuard("jwt"))(this.options);
    const res = authGuard.canActivate(context);

    return (res as Promise<boolean>).then((result) => {
      const token = this.generateToken(context, result);

      if (!this.auth.user) {
        this.auth.user = (request as any).user;
      }

      if (token) {
        const response: Response = context.switchToHttp().getResponse();

        response.setHeader("Authorization", `Bearer ${token}`);
      }

      return result;
    });
  }

  private generateToken(context: ExecutionContext, result: boolean): string {
    const request: Request = context.switchToHttp().getRequest();
    const authHeader = request.get("Authorization");
    let token = null;

    if (authHeader) {
      const [oldToken] = authHeader.split(" ");
      const data: any = this.jwtService.decode(oldToken);

      const exp = moment(parseInt(`${data}000`, 10));
      const curDate = moment();
      const diff = Math.floor(exp.diff(curDate) / 1000);

      if (diff > 0 && diff < 300 && result) {
        const payload = { user: (request as any).user };

        token = this.jwtService.sign(payload, { expiresIn: "60m" });
      }
    }

    return token;
  }
}
