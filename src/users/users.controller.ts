import {
  ArgumentMetadata,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
// import {  server } from 'config/server';
import { UsersService } from "./users.service";
// import { server as serverConfig } from "../../config/server";
import IUser from "src/interfaces/users.interfaces";
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiProperty,
  ApiTags,
} from "@nestjs/swagger";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { Request } from "express";
import { RolesController } from "src/roles/roles.controller";
import { UserRole } from "src/enums/user-roles.enum";
import { Roles } from "src/decorators/roles.decorator";
import { FileInterceptor } from "@nestjs/platform-express";
import { BufferedFile } from "src/minio-client/file.model";

class FileUploadDto {
  @ApiProperty({ type: "string", format: "binary" })
  file: any;
}

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller("/users")
@ApiTags("Users")
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Post("/createUser")
  // @UseGuards(JwtAuthGuard)
  @Roles(UserRole.Admin)
  async createProject(@Body() body: IUser) {
    return await this.userService.createUser(body);
  }

  @Put("/updateUser/:id")
  // @UseGuards(JwtAuthGuard)
  async updateUser(@Body() body, @Param() id: string) {
    return await this.userService.updateUser(body, id);
  }

  @Get("/getUserById/:id")
  async getUserById(@Param() paramId: { id: string }) {
    return await this.userService.getUserById(paramId);
  }

  @Get("/getListUsers")
  @Roles(UserRole.Admin, UserRole.Moderator)
  // @UseGuards(JwtAuthGuard)
  async getListUsers(@Req() req: Request) {
    return await this.userService.getListUsers(req);
  }

  @Delete(":id")
  // @UseGuards(JwtAuthGuard)
  async deleteUser(@Param() id: string): Promise<IUser> {
    return await this.userService.deleteUser(id);
    // return 'Remove ' + id
  }
  @Put("/updateActive/:id")
  async updateById(@Body() body, @Param() id: string) {
    return await this.userService.updateById(body, id);
  }

  @Post("/uploadAvatar/:id")
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    description: "List of cats",
    type: FileUploadDto,
  })
  @UseInterceptors(FileInterceptor("image"))
  async uploadAvatar(@UploadedFile() file: BufferedFile, @Param() id: string) {
    try {
      console.log("id", id);
      console.log("file", file);

      return await this.userService.uploadAvatar(file, id);
    } catch (error) {
      console.log("erorr", error);
    }
  }
  @Delete("/delete/:id")
  // @UseGuards(JwtAuthGuard)
  async deleteAvatar(@Param() id: string): Promise<IUser> {
    return await this.userService.deleteUser(id);
    // return 'Remove ' + id
  }
}
