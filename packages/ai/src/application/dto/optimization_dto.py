"""DTOs para otimização de currículo."""

from pydantic import BaseModel, Field
from typing import Optional


class ExperienceInput(BaseModel):
    company: str
    position: str
    description: str
    start_date: str
    end_date: Optional[str] = None
    current: bool = False


class SkillInput(BaseModel):
    name: str
    level: Optional[str] = None


class ResumeInput(BaseModel):
    candidate_name: str
    email: str
    phone: Optional[str] = None
    linkedin: Optional[str] = None
    professional_summary: Optional[str] = None
    experiences: list[ExperienceInput] = Field(default_factory=list)
    skills: list[SkillInput] = Field(default_factory=list)


class OptimizeResumeRequest(BaseModel):
    resume: ResumeInput
    job_description: str
    template_id: str = "default"
    generate_pdf: bool = True


class OptimizedExperience(BaseModel):
    company: str
    position: str
    original_position: Optional[str] = None
    description: str
    achievements: list[str] = Field(default_factory=list)
    keywords_added: list[str] = Field(default_factory=list)
    start_date: str
    end_date: Optional[str] = None
    current: bool = False


class OptimizedResume(BaseModel):
    candidate_name: str
    email: str
    phone: Optional[str] = None
    linkedin: Optional[str] = None
    professional_summary: str
    experiences: list[OptimizedExperience]
    skills: list[str]
    keywords_matched: list[str] = Field(default_factory=list)


class OptimizeResumeResponse(BaseModel):
    optimized_resume: OptimizedResume
    ats_score_before: int
    ats_score_after: int
    improvements: list[str]
    pdf_url: Optional[str] = None
