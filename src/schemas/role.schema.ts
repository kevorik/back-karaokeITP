import { Schema } from "mongoose";

const RoleSchema = new Schema(
  {
    name: String,
    active: Boolean,
    access_page: [String],
  },
  { collection: "roles" }
);

export default RoleSchema;
