"""
LLM provider adapters.

Available adapters:
- OpenAIAdapter: Primary LLM using OpenAI GPT models
"""

from .openai_adapter import OpenAIAdapter

__all__ = ["OpenAIAdapter"]

