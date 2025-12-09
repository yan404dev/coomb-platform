from __future__ import annotations

import logging
from dataclasses import dataclass
from pathlib import Path
from typing import Any, Optional

import yaml

logger = logging.getLogger(__name__)


@dataclass
class PromptTemplate:
    name: str
    version: str
    system: str
    user_template: str
    temperature: float = 0.7
    max_tokens: int = 2000

    def format_user(self, **kwargs: Any) -> str:
        return self.user_template.format(**kwargs)


class PromptLoader:
    def __init__(self, prompts_dir: Optional[Path] = None):
        if prompts_dir is None:
            prompts_dir = Path(__file__).parent.parent / "prompts"
        self._prompts_dir = prompts_dir
        self._cache: dict[str, PromptTemplate] = {}

    def load(self, name: str) -> PromptTemplate:
        if name in self._cache:
            return self._cache[name]

        file_path = self._prompts_dir / f"{name}.yaml"
        if not file_path.exists():
            raise FileNotFoundError(f"Prompt '{name}' not found at {file_path}")

        with open(file_path, "r", encoding="utf-8") as f:
            data = yaml.safe_load(f)

        config = data.get("config", {})
        template = PromptTemplate(
            name=data["name"],
            version=data.get("version", "1.0.0"),
            system=data["system"],
            user_template=data["user_template"],
            temperature=config.get("temperature", 0.7),
            max_tokens=config.get("max_tokens", 2000),
        )

        self._cache[name] = template
        logger.debug(f"Loaded prompt: {name} v{template.version}")
        return template

    def reload(self, name: str) -> PromptTemplate:
        if name in self._cache:
            del self._cache[name]
        return self.load(name)

