"""
Document parsing adapters.

These adapters extract text from various document formats.
Migrated from coomb-pdf/services/resume_import_service.py
"""

from .pdf_parser_adapter import PDFParserAdapter
from .docx_parser_adapter import DOCXParserAdapter

__all__ = ["PDFParserAdapter", "DOCXParserAdapter"]

