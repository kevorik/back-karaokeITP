import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Res,
} from "@nestjs/common";
// import {  server } from 'config/server';
import { RolesService } from "./roles.service";
// import { server as serverConfig } from "../../config/server";
import IRole from "src/interfaces/role.interface";
import { ApiTags } from "@nestjs/swagger";

@Controller("/roles")
@ApiTags("Roles")
export class RolesController {
  constructor(private readonly roleService: RolesService) {}

  @Post("/createRole")
  async createProject(@Body() body: IRole) {
    return await this.roleService.createRole(body);
  }

  @Put("/updateRole/:id")
  async updateRole(@Body() body, @Param() id: string) {
    return await this.roleService.updateRole(body, id);
  }

  @Get("/getRoleById/:id")
  async getRoleById(@Param() id: string) {
    return await this.roleService.getRoleById(id);
  }

  @Get("/getListRole")
  async getListRole() {
    return await this.roleService.getListRole();
  }

  @Delete(":id")
  async deleteRole(@Param() id: string): Promise<IRole> {
    return await this.roleService.deleteRole(id);
    // return 'Remove ' + id
  }
}
