import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../../common/prisma/prisma.service";
import { BaseRepository } from "../../../common/repositories/base.repository";
import { User, Prisma } from "@prisma/client";

@Injectable()
export class UserRepository extends BaseRepository<
  User,
  Prisma.UserCreateInput,
  Prisma.UserUpdateInput,
  Prisma.UserWhereInput,
  Prisma.UserWhereUniqueInput
> {
  constructor(prisma: PrismaService) {
    super(prisma, prisma.user);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.findUnique({ email });
  }

  async findByEmailWithPassword(email: string): Promise<User | null> {
    return this.findUnique({ email });
  }
}
