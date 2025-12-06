import { Module } from "@nestjs/common";
import { PrismaModule } from "../../common/prisma/prisma.module";
import { UserController } from "./controllers/user.controller";
import { UserService } from "./application/services/user.service";
import { UserRepository } from "./repositories/user.repository";
import { UserRepositoryAdapter } from "./infrastructure/adapters/user.repository.adapter";
import { CreateUserUseCase } from "./application/use-cases/create-user.use-case";
import { UpdateUserUseCase } from "./application/use-cases/update-user.use-case";
import { PersonalityService } from "./services/personality.service";
import { INJECTION_TOKENS } from "../../common/constants/injection-tokens";

@Module({
  imports: [PrismaModule],
  controllers: [UserController],
  providers: [
    UserService,
    UserRepository,
    UserRepositoryAdapter,
    CreateUserUseCase,
    UpdateUserUseCase,
    PersonalityService,
    {
      provide: INJECTION_TOKENS.USER_REPOSITORY_PORT,
      useClass: UserRepositoryAdapter,
    },
  ],
  exports: [UserService, UserRepository, INJECTION_TOKENS.USER_REPOSITORY_PORT, PersonalityService],
})
export class UserModule {}
