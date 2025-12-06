import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { AuthService } from "./application/services/auth.service";
import { AuthController } from "./controllers/auth.controller";
import { JwtStrategy } from "./strategies/jwt.strategy";
import { LocalStrategy } from "./strategies/local.strategy";
import { GoogleStrategy } from "./strategies/google.strategy";
import { FacebookStrategy } from "./strategies/facebook.strategy";
import { LinkedInStrategy } from "./strategies/linkedin.strategy";
import { LoginUseCase } from "./application/use-cases/login.use-case";
import { RegisterUseCase } from "./application/use-cases/register.use-case";
import { ValidateUserUseCase } from "./application/use-cases/validate-user.use-case";
import { UserModule } from "../user/user.module";

const socialStrategies = [
  AuthService,
  JwtStrategy,
  LocalStrategy,
] as const;

const optionalStrategies = [] as Array<new (...args: any[]) => any>;

if (
  process.env.GOOGLE_CLIENT_ID &&
  process.env.GOOGLE_CLIENT_SECRET &&
  process.env.GOOGLE_CALLBACK_URL
) {
  optionalStrategies.push(GoogleStrategy);
}

if (
  process.env.FACEBOOK_APP_ID &&
  process.env.FACEBOOK_APP_SECRET &&
  process.env.FACEBOOK_CALLBACK_URL
) {
  optionalStrategies.push(FacebookStrategy);
}

if (
  process.env.LINKEDIN_CLIENT_ID &&
  process.env.LINKEDIN_CLIENT_SECRET &&
  process.env.LINKEDIN_CALLBACK_URL
) {
  optionalStrategies.push(LinkedInStrategy);
}

@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>("JWT_SECRET") || "default-secret",
        signOptions: {
          expiresIn: configService.get<string>("JWT_EXPIRES_IN") || "24h",
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [
    ...socialStrategies,
    ...optionalStrategies,
    LoginUseCase,
    RegisterUseCase,
    ValidateUserUseCase,
  ],
  exports: [AuthService],
})
export class AuthModule {}
