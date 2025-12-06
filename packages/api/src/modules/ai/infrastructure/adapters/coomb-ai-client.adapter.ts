import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { HttpService } from "@nestjs/axios";
import { firstValueFrom, Observable } from "rxjs";
import * as FormData from "form-data";
import { ResumeEntity } from "../../../resume/entities/resume.entity";
import { UserEntity } from "../../../user/entities/user.entity";
import {
  CoombAIClientPort,
  OptimizationResult,
  PDFGenerationResult,
  ChatMessage,
  ChatCompletionResult,
  ChatStreamChunk,
  GeneratePersonalityResult,
} from "../../domain/ports/coomb-ai-client.port";

@Injectable()
export class CoombAIClientAdapter implements CoombAIClientPort {
  private readonly baseUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService
  ) {
    this.baseUrl =
      this.configService.get<string>("COOMB_AI_URL") ||
      this.configService.get<string>("PDF_SERVICE_URL") ||
      "http://localhost:8000";
  }

  async optimizeResume(
    resume: ResumeEntity,
    userProfile: UserEntity,
    jobDescription: string,
    generatePdf: boolean = true
  ): Promise<OptimizationResult> {
    const request = {
      resume: {
        candidate_name: userProfile.full_name,
        email: userProfile.email,
        phone: userProfile.phone || null,
        linkedin: userProfile.linkedin || null,
        professional_summary: userProfile.professional_summary || null,
        experiences: this.mapExperiences(resume.experiences),
        skills: this.mapSkills(resume.skills),
      },
      job_description: jobDescription,
      template_id: "default",
      generate_pdf: generatePdf,
    };

    try {
      const response = await firstValueFrom(
        this.httpService.post<OptimizationResult>(
          `${this.baseUrl}/api/v1/resumes/optimize`,
          request
        )
      );
      return response.data;
    } catch (error: any) {
      const msg = error?.response?.data?.detail || error?.message || "Erro";
      throw new Error(`Erro ao otimizar currículo: ${msg}`);
    }
  }

  async generatePDF(
    resume: ResumeEntity,
    userProfile: UserEntity
  ): Promise<PDFGenerationResult> {
    const request = {
      template_id: "default",
      resume: {
        candidate_name: userProfile.full_name,
        contact_info: {
          email: userProfile.email,
          phone: userProfile.phone || null,
          linkedin: userProfile.linkedin || null,
          location: this.buildLocation(userProfile),
        },
        professional_summary: userProfile.professional_summary || null,
        experiences: this.mapExperiencesForPDF(resume.experiences),
        educations: this.mapEducationsForPDF(resume.educations),
        skills: this.mapSkills(resume.skills).map((s) => ({ name: s.name })),
        languages: this.mapLanguages(resume.languages),
        certifications: resume.certifications || [],
      },
    };

    try {
      const response = await firstValueFrom(
        this.httpService.post<PDFGenerationResult>(
          `${this.baseUrl}/api/v1/pdf/generate`,
          request
        )
      );
      return {
        ...response.data,
        download_url: `${this.baseUrl}${response.data.download_url}`,
      };
    } catch (error: any) {
      const msg = error?.response?.data?.detail || error?.message || "Erro";
      throw new Error(`Erro ao gerar PDF: ${msg}`);
    }
  }

  async extractText(file: Buffer, filename: string): Promise<string> {
    const formData = new FormData();
    formData.append("file", file, {
      filename,
      contentType: filename.toLowerCase().endsWith(".pdf")
        ? "application/pdf"
        : "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    });

    try {
      const response = await firstValueFrom(
        this.httpService.post<{ text: string }>(
          `${this.baseUrl}/api/v1/documents/extract-text`,
          formData,
          { headers: formData.getHeaders() }
        )
      );
      return response.data.text;
    } catch (error: any) {
      const msg = error?.response?.data?.detail || error?.message || "Erro";
      throw new Error(`Erro ao extrair texto: ${msg}`);
    }
  }

  async chatCompletion(
    messages: ChatMessage[],
    userId?: string | null,
    temperature: number = 0.7,
    maxTokens: number = 2000
  ): Promise<ChatCompletionResult> {
    const request = {
      messages,
      user_id: userId || null,
      temperature,
      max_tokens: maxTokens,
    };

    try {
      const response = await firstValueFrom(
        this.httpService.post<ChatCompletionResult>(
          `${this.baseUrl}/api/v1/chat/completion`,
          request
        )
      );
      return response.data;
    } catch (error: any) {
      const msg = error?.response?.data?.detail || error?.message || "Erro";
      throw new Error(`Erro no chat: ${msg}`);
    }
  }

  async chatStream(
    messages: ChatMessage[],
    userId?: string | null,
    temperature: number = 0.7,
    maxTokens: number = 2000
  ): Promise<Observable<ChatStreamChunk>> {
    return new Observable((observer) => {
      observer.error(new Error("chatStream não implementado ainda"));
      observer.complete();
    });
  }

  private mapExperiences(experiences: any): any[] {
    if (!Array.isArray(experiences)) return [];
    return experiences.map((exp: any) => ({
      company: exp.company || "",
      position: exp.title || exp.position || "",
      description: exp.description || "",
      start_date: exp.startDate || exp.start_date || "",
      end_date: exp.endDate || exp.end_date || null,
      current: exp.current || !exp.endDate,
    }));
  }

  private mapExperiencesForPDF(experiences: any): any[] {
    if (!Array.isArray(experiences)) return [];
    return experiences.map((exp: any) => ({
      company: exp.company || "",
      position: exp.title || exp.position || "",
      description: exp.description || "",
      date_range: {
        start_formatted: exp.startDate || exp.start_date || "",
        end_formatted: exp.endDate || exp.end_date || null,
        is_current: exp.current || !exp.endDate,
      },
      achievements: exp.achievements || [],
    }));
  }

  private mapEducationsForPDF(educations: any): any[] {
    if (!Array.isArray(educations)) return [];
    return educations.map((edu: any) => ({
      institution: edu.institution || "",
      degree: edu.degree || edu.course || "",
      field_of_study: edu.field || edu.area || null,
      date_range: {
        start_formatted: edu.startDate || edu.start_date || "",
        end_formatted: edu.endDate || edu.end_date || null,
        is_current: edu.current || false,
      },
    }));
  }

  private mapSkills(skills: any): Array<{ name: string; level?: string }> {
    if (!Array.isArray(skills)) return [];
    return skills.map((s: any) => ({
      name: typeof s === "string" ? s : s.name || s.skill || "",
      level: s.level || null,
    }));
  }

  private mapLanguages(
    languages: any
  ): Array<{ name: string; proficiency: string }> {
    if (!Array.isArray(languages)) return [];
    return languages.map((l: any) => ({
      name: l.name || l.language || l,
      proficiency: l.level || l.proficiency || "Básico",
    }));
  }

  async generatePersonality(
    userId?: string | null,
    userData?: {
      professional_summary?: string | null;
      career_goals?: string | null;
      experiences?: any[];
      skills?: any[];
    }
  ): Promise<GeneratePersonalityResult> {
    const request = {
      user_id: userId || null,
      user_data: userData || null,
    };

    try {
      const response = await firstValueFrom(
        this.httpService.post<GeneratePersonalityResult>(
          `${this.baseUrl}/api/v1/personality/generate`,
          request
        )
      );
      return response.data;
    } catch (error: any) {
      const msg = error?.response?.data?.detail || error?.message || "Erro";
      throw new Error(`Erro ao gerar personalidade: ${msg}`);
    }
  }

  private buildLocation(user: UserEntity): string | null {
    if (user.city && user.state) return `${user.city}, ${user.state}`;
    return user.city || user.state || null;
  }
}

