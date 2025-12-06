import { Injectable } from "@nestjs/common";
import * as bcrypt from "bcryptjs";
import { UserService } from "../../../user/application/services/user.service";
import { UserEntity } from "../../../user/entities/user.entity";

export interface ValidateUserRequest {
  email: string;
  password: string;
}

@Injectable()
export class ValidateUserUseCase {
  constructor(private readonly userService: UserService) {}

  async execute(request: ValidateUserRequest): Promise<UserEntity | null> {
    const user = await this.userService.findByEmailWithPassword(request.email);
    
    if (user && user.password && (await bcrypt.compare(request.password, user.password))) {
      return new UserEntity(user);
    }

    return null;
  }
}

