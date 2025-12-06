import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { HttpService } from "@nestjs/axios";
import { firstValueFrom, Observable } from "rxjs";
import * as FormData from "form-data";
import { AxiosError } from "axios";
import { Resume, User } from "@prisma/client";
import {
  CoombAIClientPort,
  OptimizationResult,
  PDFGenerationResult,
  ChatMessage,
  ChatCompletionResult,
  ChatStreamChunk,
  GeneratePersonalityResult,
} from "../../domain/ports/coomb-ai-client.port";

interface ExperienceInput {
  company?: string;
  title?: string;
  position?: string;
  description?: string;
  startDate?: string;
  start_date?: string;
  endDate?: string;
  end_date?: string;
  current?: boolean;
  achievements?: string[];
}

interface EducationInput {
  institution?: string;
  degree?: string;
  course?: string;
  field?: string;
  area?: string;
  startDate?: string;
  start_date?: string;
  endDate?: string;
  end_date?: string;
  current?: boolean;
}

interface SkillInput {
  name?: string;
  skill?: string;
  level?: string;
}

interface LanguageInput {
  name?: string;
  language?: string;
  level?: string;
  proficiency?: string;
}

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
    resume: Resume,
    userProfile: User,
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
    } catch (error) {
      const axiosError = error as AxiosError<{ detail?: string }>;
      const msg =
        axiosError.response?.data?.detail || axiosError.message || "Erro";
      throw new Error(`Erro ao otimizar currículo: ${msg}`);
    }
  }

  async generatePDF(
    resume: Resume,
    userProfile: User
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
    } catch (error) {
      const axiosError = error as AxiosError<{ detail?: string }>;
      const msg =
        axiosError.response?.data?.detail || axiosError.message || "Erro";
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
    } catch (error) {
      const axiosError = error as AxiosError<{ detail?: string }>;
      const msg =
        axiosError.response?.data?.detail || axiosError.message || "Erro";
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
    } catch (error) {
      const axiosError = error as AxiosError<{ detail?: string }>;
      const msg =
        axiosError.response?.data?.detail || axiosError.message || "Erro";
      throw new Error(`Erro no chat: ${msg}`);
    }
  }

  async chatStream(
    _messages: ChatMessage[],
    _userId?: string | null,
    _temperature: number = 0.7,
    _maxTokens: number = 2000
  ): Promise<Observable<ChatStreamChunk>> {
    return new Observable((observer) => {
      observer.error(new Error("chatStream não implementado ainda"));
      observer.complete();
    });
  }

  private mapExperiences(experiences: unknown): Array<{
    company: string;
    position: string;
    description: string;
    start_date: string;
    end_date: string | null;
    current: boolean;
  }> {
    if (!Array.isArray(experiences)) return [];
    return experiences.map((exp: unknown) => {
      const e = exp as ExperienceInput;
      return {
        company: e.company || "",
        position: e.title || e.position || "",
        description: e.description || "",
        start_date: e.startDate || e.start_date || "",
        end_date: e.endDate || e.end_date || null,
        current: e.current ?? !e.endDate,
      };
    });
  }

  private mapExperiencesForPDF(experiences: unknown): Array<{
    company: string;
    position: string;
    description: string;
    date_range: {
      start_formatted: string;
      end_formatted: string | null;
      is_current: boolean;
    };
    achievements: string[];
  }> {
    if (!Array.isArray(experiences)) return [];
    return experiences.map((exp: unknown) => {
      const e = exp as ExperienceInput;
      return {
        company: e.company || "",
        position: e.title || e.position || "",
        description: e.description || "",
        date_range: {
          start_formatted: e.startDate || e.start_date || "",
          end_formatted: e.endDate || e.end_date || null,
          is_current: e.current ?? !e.endDate,
        },
        achievements: e.achievements || [],
      };
    });
  }

  private mapEducationsForPDF(educations: unknown): Array<{
    institution: string;
    degree: string;
    field_of_study: string | null;
    date_range: {
      start_formatted: string;
      end_formatted: string | null;
      is_current: boolean;
    };
  }> {
    if (!Array.isArray(educations)) return [];
    return educations.map((edu: unknown) => {
      const e = edu as EducationInput;
      return {
        institution: e.institution || "",
        degree: e.degree || e.course || "",
        field_of_study: e.field || e.area || null,
        date_range: {
          start_formatted: e.startDate || e.start_date || "",
          end_formatted: e.endDate || e.end_date || null,
          is_current: e.current ?? false,
        },
      };
    });
  }

  private mapSkills(
    skills: unknown
  ): Array<{ name: string; level?: string | null }> {
    if (!Array.isArray(skills)) return [];
    return skills.map((s: unknown) => {
      if (typeof s === "string") {
        return { name: s, level: null };
      }
      const skill = s as SkillInput;
      return {
        name: skill.name || skill.skill || "",
        level: skill.level || null,
      };
    });
  }

  private mapLanguages(
    languages: unknown
  ): Array<{ name: string; proficiency: string }> {
    if (!Array.isArray(languages)) return [];
    return languages.map((l: unknown) => {
      if (typeof l === "string") {
        return { name: l, proficiency: "Básico" };
      }
      const lang = l as LanguageInput;
      return {
        name: lang.name || lang.language || "",
        proficiency: lang.level || lang.proficiency || "Básico",
      };
    });
  }

  async generatePersonality(
    userId?: string | null,
    userData?: {
      professional_summary?: string | null;
      career_goals?: string | null;
      experiences?: unknown[];
      skills?: unknown[];
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
    } catch (error) {
      const axiosError = error as AxiosError<{ detail?: string }>;
      const msg =
        axiosError.response?.data?.detail || axiosError.message || "Erro";
      throw new Error(`Erro ao gerar personalidade: ${msg}`);
    }
  }

  private buildLocation(user: User): string | null {
    if (user.city && user.state) return `${user.city}, ${user.state}`;
    return user.city || user.state || null;
  }
}
