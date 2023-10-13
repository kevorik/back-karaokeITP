import { Document } from "mongoose";
export default class IFile extends Document {
  url: string;
  fileName: string;
  fileSize: number;
  bucketName: string;

  constructor(url, fileName, fileSize, bucketName) {
    super();
    this.url = url;
    fileName = fileName;
    fileSize = fileSize;
    this.bucketName = bucketName;
  }
}
