import { Schema } from "mongoose";
const FileSchema = new Schema(
  {
    url: String,
    fileName: String,
    fileSize: Number,
    bucketName: String,
  },
  { collection: "files" }
);

export default FileSchema;
