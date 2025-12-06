"""
PDF rendering adapters.

Available adapters:
- WeasyPrintAdapter: Primary PDF renderer using WeasyPrint + Jinja2
"""

from .weasyprint_adapter import WeasyPrintAdapter

__all__ = ["WeasyPrintAdapter"]

