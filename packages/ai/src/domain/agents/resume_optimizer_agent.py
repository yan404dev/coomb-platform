"""Resume Optimizer Agent - Optimizes resumes for ATS and specific jobs."""

from dataclasses import dataclass, field
from typing import Optional
import json

from domain.agents.base_agent import BaseAgent
from domain.entities.resume import Resume, Experience
from domain.entities.job_description import JobDescription
from domain.value_objects import Skill
from domain.ports.outbound import LLMProviderPort


@dataclass
class JobRequirements:
    """Requisitos extraídos de uma vaga."""
    
    required_skills: list[str] = field(default_factory=list)
    preferred_skills: list[str] = field(default_factory=list)
    years_of_experience: int = 0
    keywords: list[str] = field(default_factory=list)
    industry: str = ""
    seniority_level: str = ""


class ResumeOptimizerAgent(BaseAgent):
    """
    Agent especializado em otimização de currículos para ATS e vagas específicas.
    
    Responsabilidades:
        - Adaptar títulos de cargo para a vaga
        - Reformular descrições de experiência com keywords
        - Adicionar métricas e conquistas quantificáveis
        - Reordenar skills por relevância
        - Garantir compatibilidade ATS
    
    Exemplo:
        ```python
        agent = ResumeOptimizerAgent(llm_provider)
        optimized = await agent.optimize_for_job(resume, job_description)
        improvements = agent.get_improvements_made()
        ```
    """
    
    def __init__(self, llm_provider: LLMProviderPort):
        super().__init__(llm_provider)
        self._improvements_made: list[str] = []
    
    def get_agent_name(self) -> str:
        return "ResumeOptimizerAgent"
    
    async def execute(
        self,
        resume: Resume,
        job_description: JobDescription,
    ) -> Resume:
        """
        Executa otimização completa do currículo.
        
        Args:
            resume: Currículo original
            job_description: Descrição da vaga alvo
            
        Returns:
            Resume otimizado
        """
        return await self.optimize_for_job(resume, job_description)
    
    async def optimize_for_job(
        self,
        resume: Resume,
        job_description: JobDescription,
    ) -> Resume:
        """
        Otimiza o currículo para uma vaga específica.
        
        Fluxo:
        1. Extrai requisitos chave da vaga
        2. Otimiza cada experiência
        3. Prioriza skills relevantes
        4. Otimiza resumo profissional
        
        Args:
            resume: Currículo original
            job_description: Descrição da vaga alvo
            
        Returns:
            Resume otimizado para a vaga
        """
        self._improvements_made = []
        
        # 1. Extrair requisitos chave da vaga
        requirements = await self._extract_job_requirements(job_description)
        
        # 2. Otimizar cada experiência
        optimized_experiences = []
        for exp in resume.experiences:
            optimized_exp = await self._optimize_experience(exp, requirements)
            optimized_experiences.append(optimized_exp)
        
        # 3. Priorizar skills relevantes
        prioritized_skills = self._prioritize_skills(
            resume.skills,
            requirements.required_skills + requirements.preferred_skills,
        )
        
        # 4. Otimizar resumo profissional
        optimized_summary = await self._optimize_professional_summary(
            resume.professional_summary,
            requirements,
        )
        
        # 5. Construir currículo otimizado
        return Resume(
            id=resume.id,
            candidate_name=resume.candidate_name,
            contact_info=resume.contact_info,
            professional_summary=optimized_summary,
            experiences=optimized_experiences,
            educations=resume.educations,
            skills=prioritized_skills,
            languages=resume.languages,
            certifications=resume.certifications,
        )
    
    async def _extract_job_requirements(
        self,
        job_description: JobDescription,
    ) -> JobRequirements:
        """Extrai requisitos estruturados da descrição da vaga."""
        
        system_prompt = """Você é um especialista em análise de vagas.
Extraia os requisitos da vaga em formato JSON estruturado.

Retorne APENAS JSON válido, sem markdown."""

        user_prompt = f"""Analise esta descrição de vaga e extraia:

VAGA:
{job_description.full_description}

Retorne JSON com:
{{
    "required_skills": ["skill1", "skill2"],
    "preferred_skills": ["skill1"],
    "years_of_experience": 0,
    "keywords": ["palavra1", "palavra2"],
    "industry": "setor",
    "seniority_level": "junior|pleno|senior|lead"
}}"""

        response = await self._call_llm(
            system_prompt=system_prompt,
            user_prompt=user_prompt,
            temperature=0.2,
        )
        
        try:
            data = json.loads(response.strip())
            return JobRequirements(
                required_skills=data.get("required_skills", []),
                preferred_skills=data.get("preferred_skills", []),
                years_of_experience=data.get("years_of_experience", 0),
                keywords=data.get("keywords", []),
                industry=data.get("industry", ""),
                seniority_level=data.get("seniority_level", ""),
            )
        except json.JSONDecodeError:
            return JobRequirements()
    
    async def _optimize_experience(
        self,
        experience: Experience,
        requirements: JobRequirements,
    ) -> Experience:
        """Otimiza uma experiência individual para a vaga."""
        
        system_prompt = """Você é um especialista em otimização de currículos ATS.
Otimize a experiência para a vaga, mantendo VERDADE nos fatos.

REGRAS:
- NUNCA invente empresas ou datas
- PODE adaptar o título se refletir a função real
- Descrições devem ter bullets com métricas
- Use keywords da vaga naturalmente

Retorne APENAS JSON válido."""

        user_prompt = f"""EXPERIÊNCIA ORIGINAL:
- Empresa: {experience.company}
- Cargo: {experience.position}
- Descrição: {experience.description}

KEYWORDS DA VAGA:
{', '.join(requirements.keywords[:10])}

SKILLS REQUERIDAS:
{', '.join(requirements.required_skills[:10])}

Retorne JSON:
{{
    "position": "cargo otimizado",
    "description": "• Bullet 1 com métrica\\n• Bullet 2\\n• Bullet 3",
    "improvements": ["melhoria1", "melhoria2"]
}}"""

        response = await self._call_llm(
            system_prompt=system_prompt,
            user_prompt=user_prompt,
            temperature=0.3,
            max_tokens=2000,
        )
        
        try:
            data = json.loads(response.strip())
            
            new_position = data.get("position", experience.position)
            if new_position != experience.position:
                self._improvements_made.append(
                    f"Cargo adaptado: '{experience.position}' → '{new_position}'"
                )
            
            for improvement in data.get("improvements", []):
                self._improvements_made.append(improvement)
            
            return Experience(
                id=experience.id,
                company=experience.company,
                position=new_position,
                description=data.get("description", experience.description),
                date_range=experience.date_range,
                achievements=experience.achievements,
                skills_used=experience.skills_used,
            )
        except json.JSONDecodeError:
            return experience
    
    def _prioritize_skills(
        self,
        skills: list[Skill],
        target_skills: list[str],
    ) -> list[Skill]:
        """Prioriza skills baseado nos requisitos da vaga."""
        
        target_lower = [s.lower() for s in target_skills]
        
        # Separar skills em matching e não-matching
        matching = []
        non_matching = []
        
        for skill in skills:
            if any(t in skill.name.lower() for t in target_lower):
                matching.append(skill)
            else:
                non_matching.append(skill)
        
        # Skills matching primeiro, depois as outras
        prioritized = matching + non_matching
        
        # Limitar a 10-12 skills
        max_skills = 12
        if len(prioritized) > max_skills:
            removed_count = len(prioritized) - max_skills
            self._improvements_made.append(
                f"Removidas {removed_count} skills menos relevantes"
            )
            prioritized = prioritized[:max_skills]
        
        return prioritized
    
    async def _optimize_professional_summary(
        self,
        summary: Optional[str],
        requirements: JobRequirements,
    ) -> str:
        """Otimiza o resumo profissional para a vaga."""
        
        if not summary:
            return ""
        
        system_prompt = """Você é especialista em currículos ATS.
Reescreva o resumo profissional para a vaga, mantendo o conteúdo verdadeiro.
Use keywords naturalmente. Máximo 3-4 frases.

Retorne APENAS o texto do resumo, sem JSON."""

        user_prompt = f"""RESUMO ORIGINAL:
{summary}

VAGA - Setor: {requirements.industry}
VAGA - Senioridade: {requirements.seniority_level}
KEYWORDS: {', '.join(requirements.keywords[:8])}

Reescreva o resumo:"""

        response = await self._call_llm(
            system_prompt=system_prompt,
            user_prompt=user_prompt,
            temperature=0.4,
            max_tokens=500,
        )
        
        if response.strip() != summary:
            self._improvements_made.append("Resumo profissional otimizado")
        
        return response.strip()
    
    def get_improvements_made(self) -> list[str]:
        """Retorna lista de melhorias realizadas."""
        return self._improvements_made.copy()
    
    def clear_improvements(self) -> None:
        """Limpa lista de melhorias."""
        self._improvements_made = []

