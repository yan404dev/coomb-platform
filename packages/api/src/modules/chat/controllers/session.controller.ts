import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Get,
  Param,
} from "@nestjs/common";
import { JwtAuthGuard } from "../../auth/guards/jwt-auth.guard";
import { SessionService } from "../services/session.service";
import { CreateAnonymousSessionDto } from "../dto/create-anonymous-session.dto";
import { TransferSessionDto } from "../dto/transfer-session.dto";

@Controller("api/v1/sessions")
export class SessionController {
  constructor(private readonly sessionService: SessionService) {}

  /**
   * POST /api/v1/sessions/anonymous
   * Cria uma nova sessão anônima
   * Não requer autenticação
   */
  @Post("anonymous")
  async createAnonymousSession(@Body() dto: CreateAnonymousSessionDto) {
    const result = await this.sessionService.createAnonymousSession(dto);
    return {
      sessionId: result.sessionId,
      expiresAt: result.expiresAt,
      message: "Sessão anônima criada com sucesso",
    };
  }

  /**
   * POST /api/v1/sessions/transfer
   * Transfere uma sessão anônima para o usuário logado
   * Requer autenticação
   */
  @Post("transfer")
  @UseGuards(JwtAuthGuard)
  async transferSession(
    @Body() dto: TransferSessionDto,
    @Request() req: any
  ) {
    const result = await this.sessionService.transferSession(
      dto.sessionId,
      req.user.id
    );
    return {
      chatId: result.chatId,
      message: result.message,
    };
  }

  /**
   * GET /api/v1/sessions/:sessionId
   * Busca informações de uma sessão ativa
   */
  @Get(":sessionId")
  async getSession(@Param("sessionId") sessionId: string) {
    const session = await this.sessionService.findActiveSession(sessionId);
    return {
      sessionId: session.session_id,
      isAnonymous: session.is_anonymous,
      chatId: session.chat_id,
      expiresAt: session.expires_at,
      source: session.source,
    };
  }

  /**
   * GET /api/v1/sessions/metrics/conversion
   * Retorna métricas de conversão de sessões anônimas
   * Admin only (pode adicionar guard depois)
   */
  @Get("metrics/conversion")
  async getConversionMetrics() {
    const metrics = await this.sessionService.getConversionRate();
    return {
      totalAnonymousSessions: metrics.totalAnonymous,
      totalConvertedSessions: metrics.totalConverted,
      conversionRate: `${metrics.conversionRate}%`,
    };
  }
}
