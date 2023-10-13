import {
  BadRequestException,
  Injectable,
  UnprocessableEntityException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { identity } from "rxjs";
import IRole from "src/interfaces/role.interface";
export type Role = any;
@Injectable()
export class RolesService {
  constructor(@InjectModel("Role") private readonly roleModel: Model<IRole>) {}

  async findOne(name: string): Promise<Role | undefined> {
    const result = await this.roleModel.find({ name: name }).exec();
    return result;
    // return this.users.find(user => user.username === username);
  }

  async getByLogin(name: string): Promise<IRole> {
    return this.roleModel.findOne({ name }).exec();
  }

  async createRole(body): Promise<IRole> {
    const role = {
      ...body.payload,
      // active: true,
    };

    return this.roleModel.create(role);
  }

  async getListRole(): Promise<IRole[]> {
    return this.roleModel.find({}).exec();
  }

  updateRole(body, updId) {
    try {
      console.log("bbbbbbbbbbbbbbbbbbody", body);
      console.log("updddddddd", updId);

      const role = {
        ...body,
      };

      return this.roleModel.findByIdAndUpdate(updId.id, body);
    } catch (error) {
      console.log("error", error);
    }
  }

  getRoleById(id) {
    if (id.id === "create-role") {
      const role = {
        Name: "",
        active: true,
      };

      return role;
    }

    return this.roleModel.findById(id.id);
  }

  async deleteRole(deleteRole: any): Promise<IRole> {
    try {
      return this.roleModel.findByIdAndRemove(deleteRole.id);
    } catch (error) {
      console.log("error", error);
    }
  }
}
