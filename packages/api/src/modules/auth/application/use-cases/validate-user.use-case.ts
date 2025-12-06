import { Injectable } from "@nestjs/common";
import { User } from "@prisma/client";
import * as bcrypt from "bcryptjs";
import { UserService } from "../../../user/application/services/user.service";

export interface ValidateUserRequest {
  email: string;
  password: string;
}

@Injectable()
export class ValidateUserUseCase {
  constructor(private readonly userService: UserService) {}

  async execute(request: ValidateUserRequest): Promise<User | null> {
    const user = await this.userService.findByEmailWithPassword(request.email);

    if (
      user &&
      user.password &&
      (await bcrypt.compare(request.password, user.password))
    ) {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword as User;
    }

    return null;
  }
}
