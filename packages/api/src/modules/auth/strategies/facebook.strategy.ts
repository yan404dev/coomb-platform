import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, Profile } from "passport-facebook";
import { ConfigService } from "@nestjs/config";
import { AuthService } from "../application/services/auth.service";

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, "facebook") {
  constructor(
    configService: ConfigService,
    private authService: AuthService
  ) {
    super({
      clientID: configService.get<string>("FACEBOOK_APP_ID"),
      clientSecret: configService.get<string>("FACEBOOK_APP_SECRET"),
      callbackURL: configService.get<string>("FACEBOOK_CALLBACK_URL"),
      scope: ["email", "user_mobile_phone"],
      profileFields: ["emails", "name", "picture.type(large)", "mobile_phone"],
    });
  }

  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: Profile,
    done: (error: any, user?: any) => void
  ): Promise<any> {
    const { name, emails, photos, _json } = profile;
    
    const email = emails?.[0]?.value;
    if (!email) {
      return done(new Error("Email is required but not provided by Facebook"));
    }

    const user = {
      email,
      fullName: `${name?.givenName} ${name?.familyName}`,
      avatarUrl: photos?.[0]?.value,
      phone: _json?.mobile_phone,
      provider: "facebook" as const,
      providerId: profile.id,
    };

    const validatedUser = await this.authService.validateOAuthUser(user);
    done(null, validatedUser);
  }
}
