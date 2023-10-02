import { Repository } from "typeorm";
import { User } from "./entities/user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { HttpStatus, Injectable } from "@nestjs/common";
import { sendResponses } from "src/utils/services/sendResponse.services";

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private readonly userRepository: Repository<User>) {}

  async findUser(username: string) {
    const user = await this.userRepository.findOneBy({ username });

    return user;
  }

  async findUserById(id: number) {
    const user = await this.userRepository.findOneBy({ id });

    return user;
  }

  async create(username: string, password: string, res: any) {
    console.log("Start user creation");

    const newUser = this.userRepository.create({ username, password });

    await this.userRepository.save(newUser);

    delete newUser.password;

    console.log("Successfully completed user creation");

    sendResponses(res, HttpStatus.OK, newUser, "Information processed successfully");
  }

  async login(token: string, res: any) {
    sendResponses(res, HttpStatus.OK, token, "Information processed successfully");
  }
}
