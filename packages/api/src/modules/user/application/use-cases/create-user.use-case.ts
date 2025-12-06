import { Injectable, Inject, ConflictException } from "@nestjs/common";
import { UserRepositoryPort } from "../../domain/ports/user.repository.port";
import { UserEntity } from "../../entities/user.entity";
import { CreateUserDto } from "../../dto/create-user.dto";
import * as bcrypt from "bcryptjs";

export interface CreateUserRequest {
  data: CreateUserDto;
}

@Injectable()
export class CreateUserUseCase {
  constructor(
    @Inject("USER_REPOSITORY_PORT")
    private readonly repository: UserRepositoryPort
  ) {}

  async execute(request: CreateUserRequest): Promise<UserEntity> {
    const existingUser = await this.repository.findByEmail(request.data.email);
    if (existingUser) {
      throw new ConflictException("Email já está em uso");
    }

    const hashedPassword = await bcrypt.hash(request.data.password, 12);

    return this.repository.create({
      ...request.data,
      password: hashedPassword,
    });
  }
}

