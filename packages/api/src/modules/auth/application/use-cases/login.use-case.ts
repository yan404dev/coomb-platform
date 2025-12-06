import { Injectable } from "@nestjs/common";
import { User } from "@prisma/client";
import { JwtService } from "@nestjs/jwt";
import { JwtPayload } from "../../interfaces/jwt-payload.interface";

export interface LoginRequest {
  user: User;
}

export interface LoginResponse {
  access_token: string;
  user: User;
}

@Injectable()
export class LoginUseCase {
  constructor(private readonly jwtService: JwtService) {}

  async execute(request: LoginRequest): Promise<LoginResponse> {
    const payload: JwtPayload = {
      sub: request.user.id,
      email: request.user.email,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: request.user,
    };
  }
}
