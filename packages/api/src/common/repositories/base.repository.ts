import { PrismaService } from "../prisma/prisma.service";
import { Prisma } from "@prisma/client";

export interface PaginationOptions {
  page?: number;
  limit?: number;
  orderBy?: Record<string, "asc" | "desc">;
}

export interface PaginatedResult<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export abstract class BaseRepository<
  TModel,
  TCreateInput,
  TUpdateInput,
  TWhereInput,
  TWhereUniqueInput,
> {
  constructor(
    protected readonly prisma: PrismaService,
    protected readonly model: any
  ) {}

  async findUnique(
    where: TWhereUniqueInput,
    include?: any
  ): Promise<TModel | null> {
    return this.model.findUnique({
      where,
      include,
    });
  }

  async findFirst(
    where: TWhereInput,
    include?: any,
    orderBy?: any
  ): Promise<TModel | null> {
    return this.model.findFirst({
      where,
      include,
      orderBy,
    });
  }

  async findMany(
    where?: TWhereInput,
    options?: PaginationOptions & { include?: any }
  ): Promise<TModel[]> {
    const { page, limit, orderBy, include } = options || {};

    if (page && limit) {
      const skip = (page - 1) * limit;
      return this.model.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include,
      });
    }

    return this.model.findMany({
      where,
      orderBy,
      include,
    });
  }

  async findManyPaginated(
    where?: TWhereInput,
    options?: PaginationOptions & { include?: any }
  ): Promise<PaginatedResult<TModel>> {
    const { page = 1, limit = 10, orderBy, include } = options || {};
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.model.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include,
      }),
      this.model.count({ where }),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async create(data: TCreateInput, include?: any): Promise<TModel> {
    return this.model.create({
      data,
      include,
    });
  }

  async update(
    where: TWhereUniqueInput,
    data: TUpdateInput,
    include?: any
  ): Promise<TModel> {
    return this.model.update({
      where,
      data,
      include,
    });
  }

  async delete(where: TWhereUniqueInput): Promise<TModel> {
    return this.model.delete({
      where,
    });
  }

  async count(where?: TWhereInput): Promise<number> {
    return this.model.count({ where });
  }

  async exists(where: TWhereUniqueInput): Promise<boolean> {
    const result = await this.model.findUnique({
      where,
      select: { id: true },
    });
    return result !== null;
  }

  async transaction<T>(
    callback: (tx: Prisma.TransactionClient) => Promise<T>
  ): Promise<T> {
    return this.prisma.$transaction(callback);
  }
}
