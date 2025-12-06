import { User } from "@prisma/client";
import { CreateUserDto } from "../../dto/create-user.dto";
import { UpdateUserDto } from "../../dto/update-user.dto";

export interface UserRepositoryPort {
  findByEmail(email: string): Promise<User | null>;
  findByEmailWithPassword(email: string): Promise<(User & { password: string }) | null>;
  findById(id: string): Promise<User | null>;
  findAll(page: number, limit: number): Promise<{ data: User[]; meta: { total: number; page: number; limit: number } }>;
  create(data: CreateUserDto & { password: string }): Promise<User>;
  update(id: string, data: UpdateUserDto): Promise<User>;
  delete(id: string): Promise<void>;
}

