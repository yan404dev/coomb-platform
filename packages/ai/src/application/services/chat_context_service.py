from __future__ import annotations

import logging
from dataclasses import dataclass
from typing import Optional

from domain.ports.outbound.llm_provider_port import LLMMessage

logger = logging.getLogger(__name__)


@dataclass
class ChatContext:
    has_resume: bool = False
    resume_content: Optional[str] = None
    has_job_description: bool = False
    job_description: Optional[str] = None
    is_optimization_request: bool = False


SYSTEM_PROMPT_ASSISTANT = """Você é um assistente especializado em carreiras e currículos.
Você ajuda candidatos a:
- Entender seus currículos
- Preparar para entrevistas
- Entender requisitos de vagas
- Dar dicas de carreira

Seja sempre prestativo, profissional e direto nas respostas."""


SYSTEM_PROMPT_OPTIMIZER = """Você é um especialista em otimização de currículos para ATS (Applicant Tracking Systems).

O usuário compartilhou seu currículo e uma descrição de vaga. Sua tarefa é:

1. ANALISE a vaga e identifique:
   - Keywords técnicas importantes
   - Requisitos obrigatórios vs desejáveis
   - Soft skills mencionadas
   - Nível de senioridade esperado

2. OTIMIZE o currículo do usuário:
   - Adapte títulos de cargo quando apropriado
   - Adicione métricas e conquistas quantificáveis
   - Inclua keywords relevantes nas descrições
   - Priorize experiências mais relevantes para a vaga
   - Mantenha apenas informações verdadeiras

3. EXPLIQUE as melhorias feitas de forma clara e objetiva

4. GERE um resumo das principais alterações

Responda de forma estruturada e profissional."""


class ChatContextService:
    def analyze_context(self, messages: list[dict]) -> ChatContext:
        context = ChatContext()

        logger.info(f"Analyzing {len(messages)} messages for context...")

        for i, msg in enumerate(messages):
            role = msg.get("role", "unknown")
            content = msg.get("content", "")

            logger.info(f"Message {i}: role={role}, length={len(content)}, preview={content[:80]}...")

            if role != "user":
                continue

            # Detecta currículo anexado
            if "Arquivo anexado:" in content or "=== CONTEÚDO DO CURRÍCULO ===" in content:
                context.has_resume = True
                logger.info(f"Resume detected in message {i}")
                if "=== CONTEÚDO DO CURRÍCULO ===" in content:
                    parts = content.split("=== CONTEÚDO DO CURRÍCULO ===")
                    if len(parts) > 1:
                        context.resume_content = parts[1].strip()
                        logger.info(f"Resume content extracted: {len(context.resume_content)} chars")
                # Não verificar se é job description se for currículo
                continue

            # Detecta descrição de vaga (apenas se NÃO for currículo)
            is_job = self._is_job_description(content)
            logger.info(f"Message {i} is_job_description: {is_job}")

            if is_job:
                context.has_job_description = True
                # Mantém a PRIMEIRA vaga encontrada, não sobrescreve
                if context.job_description is None:
                    context.job_description = content
                    logger.info(f"Job description set: {content[:100]}...")

        context.is_optimization_request = (
            context.has_resume and context.has_job_description
        )

        logger.info(f"Context result: has_resume={context.has_resume}, has_job={context.has_job_description}, is_optimization={context.is_optimization_request}")

        return context

    def _is_job_description(self, content: str) -> bool:
        # Ignora conteúdos muito curtos
        if len(content) < 100:
            return False

        content_lower = content.lower()

        # Ignora se parece ser currículo (marcadores explícitos)
        resume_indicators = [
            "=== conteúdo do currículo ===",
            "arquivo anexado:",
            "experiência profissional:",
            "formação acadêmica:",
            "habilidades técnicas:",
            "objetivo profissional:",
            "dados pessoais:",
        ]
        if any(indicator in content_lower for indicator in resume_indicators):
            return False

        # INDICADORES FORTES de vaga (1 já basta)
        strong_job_indicators = [
            "sobre a vaga",
            "descrição da vaga",
            "descrição do perfil",
            "principais atividades",
            "principais responsabilidades",
            "estamos contratando",
            "estamos buscando",
            "buscamos um",
            "procuramos um",
            "oportunidade de emprego",
            "venha fazer parte",
            "candidate-se",
            "inscreva-se",
            "envie seu currículo",
        ]
        if any(indicator in content_lower for indicator in strong_job_indicators):
            logger.info(f"Job detected by strong indicator")
            return True

        # KEYWORDS de vaga (precisa de 2+)
        job_keywords = [
            "vaga",
            "oportunidade",
            "responsabilidades",
            "atividades",
            "requisitos",
            "qualificações",
            "conhecimentos",
            "experiência",  # como requisito
            "formação",  # como requisito
            "benefícios",
            "salário",
            "remuneração",
            "contratação",
            "candidat",
            "regime",
            "clt",
            "pj",
            "híbrido",
            "remoto",
            "presencial",
            "home office",
            "horário",
            "jornada",
            "vale transporte",
            "vale refeição",
            "vale alimentação",
            "plano de saúde",
            "plano odontológico",
            "seguro de vida",
            "gympass",
            "desejável",
            "diferencial",
            "obrigatório",
            "necessário",
            "indispensável",
        ]

        matches = sum(1 for kw in job_keywords if kw in content_lower)
        logger.info(f"Job keywords matched: {matches}")

        # Com 2+ keywords, é provavelmente uma vaga
        return matches >= 2

    def build_messages_with_context(
        self, messages: list[dict], context: ChatContext
    ) -> list[LLMMessage]:
        llm_messages: list[LLMMessage] = []

        if context.is_optimization_request:
            llm_messages.append(
                LLMMessage(role="system", content=SYSTEM_PROMPT_OPTIMIZER)
            )
        else:
            llm_messages.append(
                LLMMessage(role="system", content=SYSTEM_PROMPT_ASSISTANT)
            )

        for msg in messages:
            role = msg.get("role", "user")
            content = msg.get("content", "")

            if role in ["user", "assistant"]:
                llm_messages.append(LLMMessage(role=role, content=content))

        return llm_messages

