"""Base Agent - Abstract base class for all agents."""

from abc import ABC, abstractmethod
from pathlib import Path
from typing import Optional

import yaml

from domain.ports.outbound import LLMProviderPort, LLMMessage


class BaseAgent(ABC):
    """
    Classe base abstrata para todos os agents.
    
    Fornece funcionalidades comuns como:
    - Carregamento de prompts
    - Comunicação com LLM
    - Logging estruturado
    
    Subclasses devem implementar:
    - execute(): Lógica principal do agent
    - get_agent_name(): Nome do agent para logging
    """
    
    def __init__(self, llm_provider: LLMProviderPort):
        """
        Inicializa o agent.
        
        Args:
            llm_provider: Porta para comunicação com LLM
        """
        self._llm_provider = llm_provider
        self._prompts_dir = Path(__file__).parent.parent.parent / "prompts"
    
    @abstractmethod
    async def execute(self, *args, **kwargs):
        """Executa a tarefa principal do agent."""
        pass
    
    @abstractmethod
    def get_agent_name(self) -> str:
        """Retorna o nome do agent para logging."""
        pass
    
    async def _call_llm(
        self,
        system_prompt: str,
        user_prompt: str,
        temperature: float = 0.7,
        max_tokens: int = 4096,
    ) -> str:
        """
        Faz chamada ao LLM com prompts formatados.
        
        Args:
            system_prompt: Prompt de sistema
            user_prompt: Prompt do usuário
            temperature: Temperatura para geração
            max_tokens: Máximo de tokens
            
        Returns:
            Resposta do LLM como string
        """
        messages = [
            LLMMessage.system(system_prompt),
            LLMMessage.user(user_prompt),
        ]
        
        result = await self._llm_provider.complete(
            messages=messages,
            temperature=temperature,
            max_tokens=max_tokens,
        )
        
        return result.content
    
    def _load_prompt(self, prompt_name: str) -> dict:
        """
        Carrega prompt de arquivo YAML.
        
        Args:
            prompt_name: Nome do arquivo (sem extensão)
            
        Returns:
            Dict com 'system' e 'user' prompts
        """
        prompt_file = self._prompts_dir / f"{prompt_name}.yaml"
        
        if not prompt_file.exists():
            raise FileNotFoundError(f"Prompt não encontrado: {prompt_file}")
        
        with open(prompt_file, "r", encoding="utf-8") as f:
            return yaml.safe_load(f)
    
    def _format_prompt(self, template: str, **kwargs) -> str:
        """
        Formata template de prompt com variáveis.
        
        Args:
            template: Template com placeholders {var}
            **kwargs: Variáveis para substituição
            
        Returns:
            Prompt formatado
        """
        return template.format(**kwargs)

