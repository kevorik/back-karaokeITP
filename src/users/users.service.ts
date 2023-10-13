import { ImageUploadController } from "./../image-upload/image-upload.controller";
import { PassportModule } from "@nestjs/passport";
import { log } from "console";
import { MinioClientService } from "src/minio-client/minio-client.service";
import {
  ConsoleLogger,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { identity } from "rxjs";
import IUser from "src/interfaces/users.interfaces";
import { UserRole } from "src/enums/user-roles.enum";
import { hashPassword } from "src/utils/hash-password";
import { BufferedFile } from "src/minio-client/file.model";
import IFile from "src/interfaces/file.interface";
import { compareSync } from "bcrypt";
// import { MailerService } from "@nestjs-modules/mailer";

@Injectable()
export class UsersService {
  constructor(
    @InjectModel("User") private readonly userModel: Model<IUser>,
    private minioClientService: MinioClientService,
    @InjectModel("File") private readonly fileModel: Model<IFile> // private readonly mailerService: MailerService
  ) {}

  async getByLogin(nickName: string): Promise<IUser> {
    const user = await this.userModel.findOne({ nickName }).exec();
    return user;
  }

  async uploadAvatar(file: BufferedFile, userId: any) {
    const uploaded_image = await this.minioClientService.upload(file);

    let { id } = userId;

    const fuser = await this.userModel
      .findOne({ _id: id })
      .populate("avatar_url");

    if (
      !fuser.avatar_url &&
      fuser.avatar_url !== null &&
      fuser.avatar_url !== undefined
    ) {
      const user = await this.userModel.findByIdAndUpdate(
        id,
        {
          avatar_url: uploaded_image,
        },
        { new: true }
      );

      return {
        user,
        message: "Image upload successful",
      };
    } else {
      const user = await this.userModel.findByIdAndUpdate(
        id,
        {
          avatar_url: uploaded_image,
        },
        { new: true }
      );

      const oldFile = await this.fileModel.findOne({
        _id: fuser.avatar_url.id,
      });

      const deleteAvatarMinio = await this.minioClientService.delete(oldFile);

      const deleteFile = await this.fileModel.findByIdAndRemove(oldFile._id);

      return {
        deleteAvatarMinio,
        deleteFile,
        user,
        message: "Image error ",
      };
    }
  }

  async deleteAvatar(userId: any) {
    const { id } = userId;
    const user = await this.userModel
      .findOne({ _id: id })
      .populate("avatar_url");
    const avatar = await this.fileModel.findOne({
      _id: user.avatar_url._id,
    });
    console.log("avatar", avatar);

    if (user.avatar_url) {
      const deleteFile = await this.fileModel.findByIdAndRemove(avatar._id);
      return deleteFile;
    }
  }

  async createUser(body): Promise<any> {
    const password = body.payload.password;
    const avatar = body.payload.avatar_url;
    const getNickName = body.payload.nickName;

    // const uniqueNickName = await this.checkUniqueNickname(getNickName);

    const passwordHash = await hashPassword(password);
    const user = {
      ...body.payload,
      create_date: new Date(),
      active: true,
      password: passwordHash,
    };
    return this.userModel.create(user);
  }

  async getListUsers(req: any): Promise<any> {
    const query = (req as any).query;

    let findQuery = {};

    const searchString = query.search;

    if (searchString && searchString !== "") {
      const words = searchString.split(" ");
      const wordsRegex = words.join("|");

      findQuery = {
        $or: [
          { nickName: { $regex: wordsRegex, $options: "i" } },
          { firstName: { $regex: wordsRegex, $options: "i" } },
          { lastName: { $regex: wordsRegex, $options: "i" } },
          { email: { $regex: wordsRegex, $options: "i" } },
        ],
      };
    }

    let page = Number(query.currentPage - 1) * Number(query.pageSize);

    const res = await this.userModel
      .find(findQuery, {})
      .skip(page)
      .limit(Number(query.pageSize))
      .populate("roleId")
      .sort({ create_date: -1 });
    const totalSize = await this.userModel.find(findQuery).countDocuments();

    return { data: res, total: Number(totalSize) };
  }

  async updateUser(body, updId) {
    // const { id } = updId;
    // let updateUser;

    // if (body.password) {
    //   const passwordHash = await hashPassword(body.password);

    //   updateUser = {
    //     ...body,
    //     password: passwordHash,
    //   };

    //   console.log("updateUservvvvv", updateUser);
    //   console.log("id2222", id);

    //   console.log("passwordHash", passwordHash);
    //   console.log("body.password6", body.password);
    //   console.log("body.payloadmmm", body.payload);
    //   console.log("bodyyyyy", body);

    //   const result = await this.userModel.findByIdAndUpdate(id, updateUser);
    //   console.log("resultsssssss", result);

    //   return result;
    // }
    try {
      console.log("bbbbbbbbbbbbbbbbbbody", body);
      console.log("updddddddd", updId);

      const updateUser = {
        ...body,
      };

      return this.userModel.findByIdAndUpdate(updId.id, updateUser);
    } catch (error) {
      console.log("error", error);
    }

    // try {
    //   // console.log("passwordHash", passwordHash);
    //   // console.log("body.password6", body.password);
    //   // console.log("body.payloadmmm", body.payload);
    //   // console.log("bodyyyyy", body);

    //   // const uniqueNickName = this.checkUniqueNickname(getNickName);

    //   const result = await this.userModel.findByIdAndUpdate(id, updateUser);
    //   console.log("resultsssssss", result);

    //   return result;
    // } catch (error) {
    //   console.log("error", error);
    // }
  }

  async getUserById(paramId: { id: string }) {
    const { id } = paramId;

    console.log("id", id);

    const user = await this.userModel.findById(id).populate("avatar_url");
    console.log("user", user);

    return user;
  }

  async deleteUser(deleteUser: any): Promise<IUser> {
    try {
      return this.userModel.findByIdAndRemove(deleteUser.id);
    } catch (error) {
      console.log("error", error);
    }
  }

  async updateById(body, updId) {
    try {
      return this.userModel.findByIdAndUpdate(updId.id, body);
    } catch (error) {
      console.log("error", error);
    }
  }
  // async findByEmail(email: string): Promise<IUser> {
  //   return this.userModel.findOne({ email }).exec();
  // }

  async checkUniqueNickname(nickname: string) {
    const foundUser = await this.userModel.findOne({ nickName: nickname });

    if (foundUser) {
      throw new ForbiddenException(
        `Cannot take the following nickname: ${foundUser.nickName}`,
        { cause: new Error(), description: "Неверный логин или пароль" }
      );
    }

    return nickname;
  }
}
