import { Injectable, NotFoundException, Inject } from "@nestjs/common";
import { User } from "@prisma/client";
import { CreateUserDto } from "../../dto/create-user.dto";
import { UpdateUserDto } from "../../dto/update-user.dto";
import { UserRepositoryPort } from "../../domain/ports/user.repository.port";
import { CreateUserUseCase } from "../use-cases/create-user.use-case";
import { UpdateUserUseCase } from "../use-cases/update-user.use-case";
import { INJECTION_TOKENS } from "../../../../common/constants/injection-tokens";

@Injectable()
export class UserService {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly updateUserUseCase: UpdateUserUseCase,
    @Inject(INJECTION_TOKENS.USER_REPOSITORY_PORT)
    private readonly repository: UserRepositoryPort
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    return this.createUserUseCase.execute({ data: createUserDto });
  }

  async findAll(page = 1, limit = 10) {
    return this.repository.findAll(page, limit);
  }

  async findById(id: string): Promise<User> {
    const user = await this.repository.findById(id);
    if (!user) {
      throw new NotFoundException("Usuário não encontrado");
    }
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.repository.findByEmail(email);
  }

  async findByEmailWithPassword(email: string) {
    return this.repository.findByEmailWithPassword(email);
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
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
