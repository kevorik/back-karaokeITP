import { Schema } from "mongoose";
const UserSchema = new Schema(
  {
    nickName: String,
    firstName: String,
    lastName: String,
    active: Boolean,
    roleId: { type: Schema.Types.ObjectId, ref: "Role" },
    // birthDay: Date,
    password: String,
    gender: String,
    avatarUrl: String,
    email: String,
    create_date: Date,
    avatar_url: { type: Schema.Types.ObjectId, ref: "File" },
    recovery_code: String,
    lifeCycle_code: Date,
  },
  { collection: "users" }
);

export default UserSchema;
