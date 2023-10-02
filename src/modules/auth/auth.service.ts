import * as bcryptjs from "bcryptjs";
import { JwtService } from "@nestjs/jwt";
import { LoginDto } from "./dto/login.dto";
import { ConfigService } from "@nestjs/config";
import { RegisterDto } from "./dto/register.dto";
import { HttpStatus, Injectable } from "@nestjs/common";
import { UsersService } from "src/modules/users/users.service";
import { sendResponses } from "src/utils/services/sendResponse.services";

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService
  ) {}

  async register(registerDto: RegisterDto, res: any) {
    console.log("Start user registration");

    const { username, password } = registerDto;

    const user = await this.usersService.findUser(username);

    if (user) {
      console.error("The user is already created");

      return sendResponses(res, HttpStatus.BAD_REQUEST, null, "The user already exits");
    }

    console.log("Encrypting password");

    const salt = this.configService.get("SALT");

    const passwordCrypt = await bcryptjs.hash(password, parseInt(salt));

    console.log("End user registration");

    await this.usersService.create(username, passwordCrypt, res);
  }

  async login(loginDto: LoginDto, res: any) {
    console.log("Start user login");

    const { username, password } = loginDto;

    const user = await this.usersService.findUser(username);

    if (!user) {
      console.error("Invalid credentials");

      return sendResponses(res, HttpStatus.UNAUTHORIZED, null, "Invalid credentials'");
    }

    const isPasswordValid = await bcryptjs.compare(password, user.password);

    if (!isPasswordValid) {
      console.error("Invalid credentials");

      return sendResponses(res, HttpStatus.UNAUTHORIZED, null, "Invalid credentials'");
    }

    console.log("Creating token");

    const payload = { userId: user.id };

    const secret = this.configService.get("JWT_SECRET");

    const expiresIn = this.configService.get("JWT_EXPIRES_IN");

    const token = await this.jwtService.signAsync(payload, {
      secret,
      expiresIn
    });

    console.log("End token creation");

    await this.usersService.login(token, res);
  }
}
