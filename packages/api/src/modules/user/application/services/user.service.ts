import { Injectable, NotFoundException, Inject } from "@nestjs/common";
import { UserEntity } from "../../entities/user.entity";
import { CreateUserDto } from "../../dto/create-user.dto";
import { UpdateUserDto } from "../../dto/update-user.dto";
import { UserRepositoryPort } from "../domain/ports/user.repository.port";
import { CreateUserUseCase } from "../use-cases/create-user.use-case";
import { UpdateUserUseCase } from "../use-cases/update-user.use-case";

@Injectable()
export class UserService {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly updateUserUseCase: UpdateUserUseCase,
    @Inject("USER_REPOSITORY_PORT")
    private readonly repository: UserRepositoryPort
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserEntity> {
    return this.createUserUseCase.execute({ data: createUserDto });
  }

  async findAll(page = 1, limit = 10) {
    return this.repository.findAll(page, limit);
  }

  async findById(id: string): Promise<UserEntity> {
    const user = await this.repository.findById(id);
    if (!user) {
      throw new NotFoundException("Usuário não encontrado");
    }
    return user;
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    return this.repository.findByEmail(email);
  }

  async findByEmailWithPassword(email: string) {
    return this.repository.findByEmailWithPassword(email);
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<UserEntity> {
    return this.updateUserUseCase.execute({ id, data: updateUserDto });
  }

  async remove(id: string): Promise<void> {
    const existingUser = await this.repository.findById(id);
    if (!existingUser) {
      throw new NotFoundException("Usuário não encontrado");
    }
    await this.repository.delete(id);
  }
}

