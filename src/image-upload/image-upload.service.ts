import { Injectable } from "@nestjs/common";
import { MinioClientService } from "src/minio-client/minio-client.service";
import { BufferedFile } from "src/minio-client/file.model";

@Injectable()
export class ImageUploadService {
  constructor() {}
}
