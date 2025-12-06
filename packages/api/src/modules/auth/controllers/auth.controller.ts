import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Request,
  Res,
  UnauthorizedException,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Response } from "express";
import { AuthService } from "../application/services/auth.service";
import { LoginDto } from "../dto/login.dto";
import { RegisterDto } from "../dto/register.dto";
import { JwtAuthGuard } from "../guards/jwt-auth.guard";

@Controller("api/v1/auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("login")
  async login(@Body() loginDto: LoginDto) {
    const user = await this.authService.validateUser(
      loginDto.email,
      loginDto.password
    );

    if (!user) {
      throw new UnauthorizedException("Credenciais inválidas");
    }

    return this.authService.login(user);
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

  @Get("google")
  @UseGuards(AuthGuard("google"))
  async googleAuth() {}

  @Get("google/callback")
  @UseGuards(AuthGuard("google"))
  async googleAuthRedirect(@Request() req: any, @Res() res: Response) {
    const loginResult = await this.authService.login(req.user);
    res.redirect(`${process.env.FRONTEND_URL}/auth/success?token=${loginResult.access_token}`);
  }

  @Get("facebook")
  @UseGuards(AuthGuard("facebook"))
  async facebookAuth() {}

  @Get("facebook/callback")
  @UseGuards(AuthGuard("facebook"))
  async facebookAuthRedirect(@Request() req: any, @Res() res: Response) {
    const loginResult = await this.authService.login(req.user);
    res.redirect(`${process.env.FRONTEND_URL}/auth/success?token=${loginResult.access_token}`);
  }

  @Get("linkedin")
  @UseGuards(AuthGuard("linkedin"))
  async linkedinAuth() {}

  @Get("linkedin/callback")
  @UseGuards(AuthGuard("linkedin"))
  async linkedinAuthRedirect(@Request() req: any, @Res() res: Response) {
    const loginResult = await this.authService.login(req.user);
    res.redirect(`${process.env.FRONTEND_URL}/auth/success?token=${loginResult.access_token}`);
  }
}
