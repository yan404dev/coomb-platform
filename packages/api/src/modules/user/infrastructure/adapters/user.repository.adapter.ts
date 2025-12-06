import { Injectable } from "@nestjs/common";
import { UserRepository } from "../../repositories/user.repository";
import { UserEntity } from "../../entities/user.entity";
import { CreateUserDto } from "../../dto/create-user.dto";
import { UpdateUserDto } from "../../dto/update-user.dto";
import { UserRepositoryPort } from "../../domain/ports/user.repository.port";

@Injectable()
export class UserRepositoryAdapter implements UserRepositoryPort {
  constructor(private readonly userRepository: UserRepository) {}

  async findByEmail(email: string): Promise<UserEntity | null> {
    const user = await this.userRepository.findByEmail(email);
    return user ? new UserEntity(user) : null;
  }

  async findByEmailWithPassword(email: string): Promise<any> {
    return this.userRepository.findByEmailWithPassword(email);
  }

  async findById(id: string): Promise<UserEntity | null> {
    const user = await this.userRepository.findUnique({ id });
    return user ? new UserEntity(user) : null;
  }

  async findAll(page: number, limit: number): Promise<{ data: UserEntity[]; meta: any }> {
    const result = await this.userRepository.findManyPaginated(undefined, {
      page,
      limit,
      orderBy: { created_at: "desc" },
    });

    return {
      data: result.data.map((user) => new UserEntity(user)),
      meta: result.meta,
    };
  }

  async create(data: CreateUserDto & { password: string }): Promise<UserEntity> {
    const user = await this.userRepository.create(data);
    return new UserEntity(user);
  }

  async update(id: string, data: UpdateUserDto): Promise<UserEntity> {
    const { personality_profile, ...rest } = data;
    const user = await this.userRepository.update(
      { id },
      {
        ...rest,
        ...(personality_profile && {
          personality_profile: personality_profile as any,
        }),
      }
    );
    return new UserEntity(user);
  }

  async delete(id: string): Promise<void> {
    await this.userRepository.delete({ id });
  }
}

