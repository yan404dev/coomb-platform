import { Injectable, Inject, NotFoundException, ConflictException } from "@nestjs/common";
import { UserRepositoryPort } from "../../domain/ports/user.repository.port";
import { UserEntity } from "../../entities/user.entity";
import { UpdateUserDto } from "../../dto/update-user.dto";

export interface UpdateUserRequest {
  id: string;
  data: UpdateUserDto;
}

@Injectable()
export class UpdateUserUseCase {
  constructor(
    @Inject("USER_REPOSITORY_PORT")
    private readonly repository: UserRepositoryPort
  ) {}

  async execute(request: UpdateUserRequest): Promise<UserEntity> {
    const existingUser = await this.repository.findById(request.id);
    if (!existingUser) {
      throw new NotFoundException("Usuário não encontrado");
    }

    if (request.data.email) {
      const userWithEmail = await this.repository.findByEmail(request.data.email);
      if (userWithEmail && userWithEmail.id !== request.id) {
        throw new ConflictException("Email já está em uso");
      }
    }

    return this.repository.update(request.id, request.data);
  }
}

