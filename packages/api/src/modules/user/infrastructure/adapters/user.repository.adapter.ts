import { Injectable } from "@nestjs/common";
import { User, Prisma } from "@prisma/client";
import { UserRepository } from "../../repositories/user.repository";
import { CreateUserDto } from "../../dto/create-user.dto";
import { UpdateUserDto } from "../../dto/update-user.dto";
import { UserRepositoryPort } from "../../domain/ports/user.repository.port";

@Injectable()
export class UserRepositoryAdapter implements UserRepositoryPort {
  constructor(private readonly userRepository: UserRepository) {}

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.userRepository.findByEmail(email);
    return user;
  }

  async findByEmailWithPassword(email: string): Promise<(User & { password: string }) | null> {
    const user = await this.userRepository.findByEmailWithPassword(email);
    if (!user || !user.password) {
      return null;
    }
    return user as User & { password: string };
  }

  async findById(id: string): Promise<User | null> {
    const user = await this.userRepository.findUnique({ id });
    return user;
  }

  async findAll(page: number, limit: number): Promise<{ data: User[]; meta: { total: number; page: number; limit: number } }> {
    const result = await this.userRepository.findManyPaginated(undefined, {
      page,
      limit,
      orderBy: { created_at: "desc" },
    });

    return {
      data: result.data,
      meta: result.meta,
    };
  }

  async create(data: CreateUserDto & { password: string }): Promise<User> {
    const user = await this.userRepository.create(data);
    return user;
  }

  async update(id: string, data: UpdateUserDto): Promise<User> {
    const { personality_profile, ...rest } = data;
    const updateData: Record<string, unknown> = { ...rest };
    
    if (personality_profile !== undefined) {
      updateData.personality_profile = personality_profile as unknown as Prisma.InputJsonValue;
    }
    
    const user = await this.userRepository.update({ id }, updateData as any);
    return user;
  }

  async delete(id: string): Promise<void> {
    await this.userRepository.delete({ id });
  }
}

