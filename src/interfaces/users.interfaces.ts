import { Document } from "mongoose";
import IFile from "./file.interface";
import IRole from "./role.interface";
export default class IUser extends Document {
  nickName: string;
  firstName: string;
  lastName: string;
  active: boolean;
  roleId: IRole;
  password: string;
  gender: "female" | "male";
  email: string;
  create_date: string;
  avatar_url: IFile;
  recovery_code: string;
  lifeCycle_code: Date;
}
