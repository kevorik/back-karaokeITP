import {
  BadRequestException,
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
  Logger,
  MethodNotAllowedException,
  Next,
  UnauthorizedException,
} from "@nestjs/common";
import { UsersService } from "src/users/users.service";
import { JwtService } from "@nestjs/jwt";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import IUser from "src/interfaces/users.interfaces";
import { BehaviorSubject } from "rxjs";
import IRole from "src/interfaces/role.interface";
import { UserRole } from "src/enums/user-roles.enum";
import { hashPassword } from "src/utils/hash-password";
import { compareSync } from "bcrypt";
import { MailService } from "src/mail/mail.service";
import { v4 as uuidv4 } from "uuid";

@Injectable()
export class AuthService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    private usersService: UsersService,
    @Inject(forwardRef(() => JwtService))
    private readonly jwtService: JwtService,
    @InjectModel("User") private readonly userModel: Model<IUser>,
    @InjectModel("Role") private readonly roleModel: Model<IRole>,
    private mailService: MailService
  ) {}

  private _user: BehaviorSubject<IUser> = new BehaviorSubject<IUser>(null);

  get user() {
    return this._user.getValue();
  }

  set user(data) {
    this._user.next(data);
  }

  async validateUser(body): Promise<any> {
    if (body.nickName && body.password) {
      const user = await this.usersService.getByLogin(body.nickName);

      if (!compareSync(body.password, user.password)) {
        throw new UnauthorizedException("Неверный логин или пароль!!!");
      }

      return user;
    }
  }

  async registerUser(body): Promise<IUser> {
    const password = body.payload.password;
    const nickName = body.payload.nickName;
    const email = body.payload.email;
    console.log("bodybodysssss", body);

    console.log("nickName000000000", nickName);

    // try {
    //   const alreadyExistingUser = await this.getUserByNickname(nickName);

    const foundUserByNickname = await this.userModel.findOne({
      nickName: nickName,
    });
    const foundUserByEmail = await this.userModel.findOne({
      email: email,
    });

    if (foundUserByNickname) {
      throw new ForbiddenException(
        `Cannot take the following nickname: ${nickName}`,
        {
          cause: new Error(),
          description: "Пользователь с таким Nickname уже существует!",
        }
      );
    }
    if (foundUserByEmail) {
      throw new ForbiddenException(
        `Cannot take the following nickname: ${email}`,
        {
          cause: new Error(),
          description: "Пользователь с таким Email уже существует!",
        }
      );
    }

    const passwordHash = await hashPassword(password);

    const user = {
      ...body.payload,
      roleId: UserRole.User,
      active: true,
      create_date: new Date(),
      password: passwordHash,
      nickName: nickName || "",
      email: email || "",
    };

    try {
      return this.userModel.create(user);
    } catch (error) {
      return error;
    }
    // } catch (err) {
    //   this.logger.error(err);
    //   throw err;
    // }
  }
  async getUserByNickname(nickName: string): Promise<IUser> {
    const nic = await this.userModel.findOne({ nickName: nickName }).exec();
    return nic;
  }

  async login(body: any) {
    const user = await this.validateUser(body);
    this._user.next(user);

    if (user.active === false) {
      throw new ForbiddenException("Forbidden", {
        cause: new Error(),
        description: "Вход запрещен, обратитесь к администратору",
      });
    }

    const payload = {
      _id: user._id,
      nickName: user.nickName,
    };

    const accessToken = this.jwtService.sign(payload);
    const userInfo = await this.userModel.findById(user._id).populate("roleId");

    const role = await this.roleModel.findById(userInfo.roleId);

    return {
      code: 200,
      // role: userInfo.roleId,
      role: role,

      id: user._id,
      // userInfo: userInfo.toJSON(),
      // nickName: user.nickName,
      accessToken,
    };
  }

  async findByEmail(email: string): Promise<IUser> {
    const res = this.userModel.findOne({ email }).exec();
    console.log("ressdfg", res);
    return res;
  }

  async forgotPassword(body: any, id) {
    const findEmail = await this.findByEmail(body.email);
    console.log("findEmailzzz", findEmail);

    if (!findEmail) {
      throw new BadRequestException("Invalid email");
    }
    //генератор кода
    let token = uuidv4().toString(6).substring(2, 8);
    console.log("token", token);

    //Время
    function addMinutes(date, minutes) {
      date.setMinutes(date.getMinutes() + minutes);

      return date;
    }

    const date = new Date();
    const lifeCycle_code = addMinutes(date, 1);
    console.log(lifeCycle_code);

    const person = await this.usersService.getUserById(findEmail._id);

    console.log("person", person);
    const user = await this.userModel.findByIdAndUpdate(
      person._id,
      {
        recovery_code: token,
        lifeCycle_code: lifeCycle_code,
      },
      { new: true }
    );
    console.log("user1111111", user);
    console.log(
      "hqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqereeeeeeeeeeeeeeeeeee"
    );

    try {
      if (date > user.lifeCycle_code) {
        console.log("hereeeeeeeeeeeeeeeeeee");

        const usert = await this.userModel.findByIdAndUpdate(
          person._id,
          {
            recovery_code: user.recovery_code,
          },
          {
            new: true,
          }
        );

        const goga = await this.userModel.findOne({
          recovery_code: findEmail.recovery_code,
        });
        console.log("goga", goga);

        const deleteCode = await this.userModel.remove(goga);
        return {
          deleteCode,
          usert,
        };
      }
    } catch (error) {
      console.log("ERROR");
    }
    console.log("person.recovery_code", person.recovery_code);

    console.log("useruser", user);
    console.log("person._id", person._id);
    try {
      if (user.recovery_code) {
        const link = `localhost:5173/recovery/${user.recovery_code}`;
        await this.mailService.sendEmail({
          email: body.email,
          recovery_code: token,
          text: `Hello ! Please use this ${link} to reset your password.`,
        });
      }
    } catch (error) {
      console.log("ERR");
    }

    return user;
  }

  async reset(body: any) {}
}
