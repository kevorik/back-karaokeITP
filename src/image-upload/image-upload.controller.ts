import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { ImageUploadService } from "./image-upload.service";
import { BufferedFile } from "src/minio-client/file.model";

@Controller("image-upload")
export class ImageUploadController {
  constructor(private imageUploadService: ImageUploadService) {}

  @Post()
  @UseInterceptors(FileInterceptor("file"))
  async uploadImage(@UploadedFile() file: BufferedFile) {
    const uploadImg = {
      url: "gfsdgsfdgdsfgfdgfd",
    };

    return;
  }
}
