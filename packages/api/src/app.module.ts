import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './common/prisma/prisma.module';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { ResumeModule } from './modules/resume/resume.module';
import { GeneratedResumeModule } from './modules/generated-resume/generated-resume.module';
import { ChatModule } from './modules/chat/chat.module';
import { AIModule } from './modules/ai/ai.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    PrismaModule,
    UserModule,
    AuthModule,
    ResumeModule,
    GeneratedResumeModule,
    ChatModule,
    AIModule,
  ],
})
export class AppModule {}
