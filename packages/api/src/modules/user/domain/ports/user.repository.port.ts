import { UserEntity } from "../../entities/user.entity";
import { CreateUserDto } from "../../dto/create-user.dto";
import { UpdateUserDto } from "../../dto/update-user.dto";

export interface UserRepositoryPort {
  findByEmail(email: string): Promise<UserEntity | null>;
  findByEmailWithPassword(email: string): Promise<any>;
  findById(id: string): Promise<UserEntity | null>;
  findAll(page: number, limit: number): Promise<{ data: UserEntity[]; meta: any }>;
  create(data: CreateUserDto & { password: string }): Promise<UserEntity>;
  update(id: string, data: UpdateUserDto): Promise<UserEntity>;
  delete(id: string): Promise<void>;
}

