import { Module } from "@nestjs/common";
import { MinioClientService } from "./minio-client.service";
import { MinioModule } from "nestjs-minio-client";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import FileSchema from "src/schemas/file.schema";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: "File", schema: FileSchema }]),
    MinioModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        endPoint: "localhost",
        port: 9000,
        useSSL: false, // If on localhost, keep it at false. If deployed on https, change to true
        // accessKey: "AKIAIOSFODNN7EXAMPLE",
        // secretKey: "wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY",
        accessKey: "minioadmin",
        secretKey: "minioadmin",
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [MinioClientService],
  exports: [MinioClientService],
})
export class MinioClientModule {}

// MINIO_ENDPOINT='localhost'
// MINIO_PORT=9000
// MINIO_ACCESS_KEY=AKIAIOSFODNN7EXAMPLE
// MINIO_SECRET_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY

// MINIO_BUCKET_NAME='test-bucket'??????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????//
