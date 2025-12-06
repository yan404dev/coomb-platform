from __future__ import annotations

import logging
from pathlib import Path
from typing import Optional, Union

from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse
from pydantic import BaseModel, Field

from infrastructure.adapters.outbound.pdf import WeasyPrintAdapter
from domain.ports.outbound.pdf_renderer_port import PDFRenderRequest

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/v1/pdf", tags=["PDF Generation"])

pdf_adapter = WeasyPrintAdapter()


class ContactInfoSchema(BaseModel):
    email: str
    phone: Optional[str] = None
    linkedin: Optional[str] = None
    github: Optional[str] = None
    location: Optional[str] = None
    open_to_remote: Optional[bool] = False


class SkillSchema(BaseModel):
    name: str
    level: Optional[str] = None


class SkillsSchema(BaseModel):
    languages: Optional[list[str]] = None
    frameworks: Optional[list[str]] = None
    tools: Optional[list[str]] = None


class LanguageSchema(BaseModel):
    name: str
    proficiency: str


class DateRangeSchema(BaseModel):
    start_formatted: str
    end_formatted: Optional[str] = None
    is_current: bool = False


class ExperienceSchema(BaseModel):
    company: str
    position: str
    description: Optional[str] = None
    date_range: DateRangeSchema
    achievements: list[str] = Field(default_factory=list)
    work_mode: Optional[str] = None
    country: Optional[str] = None


class EducationSchema(BaseModel):
    institution: str
    degree: str
    field_of_study: Optional[str] = None
    date_range: Optional[DateRangeSchema] = None
    country: Optional[str] = None


class CertificationSchema(BaseModel):
    name: Optional[str] = None
    issuer: Optional[str] = None
    date: Optional[str] = None


class ResumeSchema(BaseModel):
    candidate_name: str
    contact_info: ContactInfoSchema
    professional_summary: Optional[str] = None
    experiences: list[ExperienceSchema] = Field(default_factory=list)
    educations: list[EducationSchema] = Field(default_factory=list)
    skills: Optional[Union[SkillsSchema, list[SkillSchema]]] = Field(default_factory=list)
    languages: list[LanguageSchema] = Field(default_factory=list)
    certifications: list[Union[str, CertificationSchema]] = Field(default_factory=list)


class GeneratePDFRequest(BaseModel):
    resume: ResumeSchema
    template_id: str = "default"


class PDFResponse(BaseModel):
    filename: str
    download_url: str
    template_used: str


class TemplateResponse(BaseModel):
    id: str
    name: str
    description: str


class TemplatesListResponse(BaseModel):
    templates: list[TemplateResponse]


@router.post("/generate", response_model=PDFResponse)
async def generate_pdf(request: GeneratePDFRequest):
    try:
        render_request = PDFRenderRequest(
            resume=request.resume.model_dump(),
            template_id=request.template_id,
        )

        result = await pdf_adapter.render_pdf(render_request)

        return PDFResponse(
            filename=result.filename,
            download_url=f"/api/v1/pdf/files/{result.filename}",
            template_used=result.template_used,
        )

    except Exception as e:
        logger.error(f"PDF generation failed: {e}")
        raise HTTPException(status_code=500, detail=f"PDF generation failed: {e}")


@router.get("/files/{filename}")
async def download_pdf(filename: str):
    filepath = Path("storage") / filename

    if not filepath.exists():
        raise HTTPException(status_code=404, detail="File not found")

    return FileResponse(path=str(filepath), media_type="application/pdf", filename=filename)


@router.get("/templates", response_model=TemplatesListResponse)
async def get_templates():
    templates = pdf_adapter.get_available_templates()
    return TemplatesListResponse(
        templates=[TemplateResponse(id=t.id, name=t.name, description=t.description) for t in templates]
    )
