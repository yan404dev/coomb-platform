import { Controller, Post, Body, UseGuards, Get, Request } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginDto } from "./dtos/login.dto";
import { RegisterDto } from "./dtos/register.dto";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";

@Controller("api/v1/auth")
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post("login")
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post("register")
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get("me")
  async getProfile(@Request() req: any) {
    return this.authService.me(req.user.id);
  }
}
