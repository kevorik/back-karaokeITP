import { Document } from "mongoose";
export default class IRole extends Document {
  name: string;
  active: boolean;
  access_page: [String];
}
