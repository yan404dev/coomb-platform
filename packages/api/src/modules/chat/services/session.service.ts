import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
  Optional,
} from "@nestjs/common";
import { SessionRepository } from "../repositories/session.repository";
import { ChatRepository } from "../repositories/chat.repository";
import { CreateAnonymousSessionDto } from "../dto/create-anonymous-session.dto";
import { ChatSession } from "@prisma/client";
import { randomUUID } from "crypto";
import { UserService } from "../../user/application/services/user.service";
import { ResumeService } from "../../resume/application/services/resume.service";

@Injectable()
export class SessionService {
  constructor(
    private readonly sessionRepository: SessionRepository,
    private readonly chatRepository: ChatRepository,
    @Optional() private readonly userService?: UserService,
    @Optional() private readonly resumeService?: ResumeService
  ) {}

  /**
   * Cria uma nova sessão anônima
   * TTL padrão: 24 horas
   */
  async createAnonymousSession(
    dto: CreateAnonymousSessionDto
  ): Promise<{ sessionId: string; expiresAt: Date }> {
    const sessionId = randomUUID();
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24); // 24 horas de validade

    const session = await this.sessionRepository.create({
      session_id: sessionId,
      is_anonymous: true,
      source: dto.source || "web",
      expires_at: expiresAt,
    } as any);

    return {
      sessionId: session.session_id,
      expiresAt: session.expires_at,
    };
  }

  /**
   * Busca uma sessão ativa pelo ID
   */
  async findActiveSession(sessionId: string): Promise<ChatSession> {
    const session =
      await this.sessionRepository.findActiveBySessionId(sessionId);

    if (!session) {
      throw new NotFoundException("Sessão não encontrada ou expirada");
    }

    return session;
  }

  async transferSession(
    sessionId: string,
    userId: string
  ): Promise<{ chatId: string | null; message: string }> {
    const session = await this.sessionRepository.findBySessionId(sessionId);

    if (!session) {
      throw new NotFoundException("Sessão não encontrada");
    }

    if (!session.is_anonymous || session.user_id) {
      throw new ConflictException("Sessão já foi transferida");
    }

    if (session.expires_at < new Date()) {
      throw new BadRequestException("Sessão expirada");
    }

    // Importar dados do currículo para o usuário
    if (session.resume_data) {
      await this.importResumeDataToUser(userId, session.resume_data as any);
    }

    if (session.chat_id) {
      const chat = await this.chatRepository.findById(session.chat_id);

      if (!chat) {
        throw new NotFoundException("Chat associado não encontrado");
      }

      await this.chatRepository.update(
        { id: session.chat_id },
        {
          user: {
            connect: { id: userId },
          },
        }
      );

      await this.sessionRepository.update({ session_id: sessionId }, {
        user_id: userId,
        is_anonymous: false,
        converted_at: new Date(),
      } as any);

      return {
        chatId: session.chat_id,
        message: "Sessão transferida com sucesso",
      };
    }

    await this.sessionRepository.update({ session_id: sessionId }, {
      user_id: userId,
      is_anonymous: false,
      converted_at: new Date(),
    } as any);

    return {
      chatId: null,
      message: "Sessão transferida. O chat será criado na próxima interação.",
    };
  }

  /**
   * Importa dados do currículo da sessão para o usuário
   */
  private async importResumeDataToUser(
    userId: string,
    importedData: any
  ): Promise<void> {
    if (!this.userService || !this.resumeService) {
      console.warn("UserService ou ResumeService não disponível para importação");
      return;
    }

    try {
      // Verifica se o usuário já possui um currículo
      const existingResume = await this.resumeService
        .findUserResume(userId)
        .catch(() => null);

      if (existingResume) {
        console.log("Usuário já possui currículo cadastrado, não sobrescrevendo");
        return;
      }

      // Atualiza dados pessoais do usuário
      await this.userService.update(userId, {
        full_name: importedData.full_name || undefined,
        phone: importedData.phone || undefined,
        cpf: importedData.cpf || undefined,
        city: importedData.city || undefined,
        state: importedData.state || undefined,
        linkedin: importedData.linkedin || undefined,
        professional_summary: importedData.professional_summary || undefined,
      });

      // Cria o currículo
      await this.resumeService.createResume(userId);

      // Atualiza com os dados importados
      await this.resumeService.updateResume(userId, {
        experiences: (importedData.experiences || []).map((exp: any) => ({
          title: exp.position,
          company: exp.company,
          startDate: exp.startDate,
          endDate: exp.endDate,
          current: exp.current,
          description: exp.description,
        })),
        skills: (importedData.skills || []).map((skill: any) => ({
          name: skill.name,
          level: skill.level,
        })),
        languages: (importedData.languages || []).map((lang: any) => ({
          name: lang.language,
          level: lang.proficiency,
        })),
        educations: (importedData.educations || []).map((edu: any) => ({
          degree: edu.degree,
          course: edu.field,
          institution: edu.institution,
          startDate: edu.startDate,
          endDate: edu.endDate,
          current: edu.current,
        })),
        certifications: (importedData.certifications || []).map((cert: any) => ({
          name: cert.name,
          issuer: cert.institution,
          issueDate: cert.completionDate,
        })),
      });

      console.log(`Currículo importado com sucesso para o usuário ${userId}`);
    } catch (error) {
      console.error("Erro ao importar currículo para o usuário:", error);
      // Não lançamos erro para não bloquear a transferência da sessão
    }
  }

  async updateSessionData(
    sessionId: string,
    resumeData: any,
    originalResumeData?: any
  ): Promise<void> {
    const session = await this.findActiveSession(sessionId);

    await this.sessionRepository.update({ session_id: sessionId }, {
      resume_data: resumeData,
      original_resume_data: originalResumeData || session.original_resume_data,
    } as any);
  }

  async linkChatToSession(sessionId: string, chatId: string): Promise<void> {
    await this.sessionRepository.update({ session_id: sessionId }, {
      chat_id: chatId,
    } as any);
  }

  async getAnonymousSessionsCount(): Promise<number> {
    return this.sessionRepository.countAnonymousSessions();
  }

  async getConversionRate(startDate?: Date): Promise<{
    totalAnonymous: number;
    totalConverted: number;
    conversionRate: number;
  }> {
    const totalAnonymous =
      await this.sessionRepository.countAnonymousSessions();
    const totalConverted =
      await this.sessionRepository.countConvertedSessions(startDate);

    const conversionRate =
      totalAnonymous > 0 ? (totalConverted / totalAnonymous) * 100 : 0;

    return {
      totalAnonymous,
      totalConverted,
      conversionRate: Math.round(conversionRate * 100) / 100,
    };
  }

  async cleanExpiredSessions(): Promise<number> {
    return this.sessionRepository.deleteExpiredSessions();
  }
}
