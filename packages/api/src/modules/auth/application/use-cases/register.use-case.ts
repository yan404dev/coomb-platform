import { Injectable, ConflictException } from "@nestjs/common";
import { User } from "@prisma/client";
import { JwtService } from "@nestjs/jwt";
import { UserService } from "../../../user/application/services/user.service";
import { RegisterDto } from "../../dto/register.dto";
import { JwtPayload } from "../../interfaces/jwt-payload.interface";

export interface RegisterRequest {
  data: RegisterDto;
}

export interface RegisterResponse {
  access_token: string;
  user: User;
}

@Injectable()
export class RegisterUseCase {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService
  ) {}

  async execute(request: RegisterRequest): Promise<RegisterResponse> {
    try {
      const user = await this.userService.create(request.data);

      const payload: JwtPayload = {
        sub: user.id,
        email: user.email,
      };

      return {
        access_token: this.jwtService.sign(payload),
        user,
      };
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new Error("Erro interno do servidor");
    }
  }
}
