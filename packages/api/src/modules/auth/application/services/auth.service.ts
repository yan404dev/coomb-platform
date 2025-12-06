import { Injectable } from "@nestjs/common";
import { UserService } from "../../../user/application/services/user.service";
import { UserEntity } from "../../../user/entities/user.entity";
import { OAuthUser } from "../../interfaces/oauth-user.interface";
import { LoginUseCase } from "../use-cases/login.use-case";
import { RegisterUseCase } from "../use-cases/register.use-case";
import { ValidateUserUseCase } from "../use-cases/validate-user.use-case";
import { RegisterDto } from "../../dto/register.dto";

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly loginUseCase: LoginUseCase,
    private readonly registerUseCase: RegisterUseCase,
    private readonly validateUserUseCase: ValidateUserUseCase
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    return this.validateUserUseCase.execute({ email, password });
  }

  async login(user: UserEntity) {
    return this.loginUseCase.execute({ user });
  }

  async register(registerDto: RegisterDto) {
    return this.registerUseCase.execute({ data: registerDto });
  }

  async me(userId: string) {
    return this.userService.findById(userId);
  }

  async validateOAuthUser(oauthUser: OAuthUser): Promise<UserEntity> {
    let user = await this.userService.findByEmail(oauthUser.email);

    if (!user) {
      const createUserDto = {
        email: oauthUser.email,
        full_name: oauthUser.fullName,
        password: Math.random().toString(36).slice(-8),
      };

      user = await this.userService.create(createUserDto);
    }

    return user;
  }
}

