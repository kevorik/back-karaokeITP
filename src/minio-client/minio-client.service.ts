import { Injectable, Logger, HttpException, HttpStatus } from "@nestjs/common";
import { MinioService } from "nestjs-minio-client";
import * as crypto from "crypto";
import IFile from "src/interfaces/file.interface";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { BufferedFile } from "./file.model";
import { log } from "console";

@Injectable()
export class MinioClientService {
  constructor(
    @InjectModel("File") private readonly fileModel: Model<IFile>,
    private minio: MinioService
  ) {
    this.logger = new Logger("MinioService");
  }

  private readonly logger: Logger;
  private readonly bucketName = "karaoke-itp-bucket"; //process.env.MINIO_BUCKET_NAME;  karaoke-itp-bucket

  public get client() {
    return this.minio.client;
  }

  public async upload(
    file: BufferedFile,
    bucketName: string = this.bucketName
  ) {
    if (
      !(
        file.mimetype.includes("jpeg") ||
        file.mimetype.includes("png") ||
        file.mimetype.includes("jpg")
      )
    ) {
      throw new HttpException(
        "File type not supported",
        HttpStatus.BAD_REQUEST
      );
    }
    const timestamp = Date.now().toString();
    const hashedFileName = crypto
      .createHash("md5")
      .update(timestamp)
      .digest("hex");
    const extension = file.originalname.substring(
      file.originalname.lastIndexOf("."),
      file.originalname.length
    );
    const run = await this.minio.client.listBuckets();

    const metaData = {
      "Content-Type": file.mimetype,
    };

    const filePath = "avatars";
    const date = new Date();
    const fileName: string =
      date.getFullYear().toString() +
      "-" +
      ((date.getMonth() + 1).toString().length == 2
        ? (date.getMonth() + 1).toString()
        : "0" + (date.getMonth() + 1).toString()) +
      "-" +
      (date.getDate().toString().length == 2
        ? date.getDate().toString()
        : "0" + date.getDate().toString()) +
      " " +
      hashedFileName +
      extension;

    const createdObj = this.client.putObject(
      bucketName,
      `${filePath}/${fileName}`,
      file.buffer,
      file.size,
      metaData,
      function (err, res) {
        if (err) {
          console.log("err", err);

          throw new HttpException(
            "Error uploading file",
            HttpStatus.BAD_REQUEST
          );
        }
      }
    );

    let fileUri;

    try {
      fileUri = await this.client.presignedUrl(
        "GET",
        this.bucketName,
        `${filePath}/${fileName}`
      );

      let generateFile = {
        fileName: fileName,
        fileSize: file.size,
        url: fileUri,
        bucketName: this.bucketName,
      };

      const createdFile = await this.fileModel.create(generateFile);

      return createdFile._id;
    } catch (error) {
      throw new HttpException("File not found", HttpStatus.NOT_FOUND);
    }
  }
  async delete(file: IFile) {
    const filePath = "avatars";

    this.client.removeObject(
      file.bucketName,
      `${filePath}/${file.fileName}`,
      (err) => {
        console.log("errerrerrerr", err);

        if (err)
          throw new HttpException(
            "An error occured when deleting!",
            HttpStatus.BAD_REQUEST
          );
      }
    );
  }
}
