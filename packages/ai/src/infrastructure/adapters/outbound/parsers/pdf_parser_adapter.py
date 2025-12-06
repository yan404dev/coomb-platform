"""
PDF parser adapter using pdfplumber.

Migrated from: coomb-pdf/services/resume_import_service.py
"""

from __future__ import annotations

import io
import logging
from dataclasses import dataclass

import pdfplumber

from domain.ports.outbound.resume_parser_port import (
    DocumentParserPort,
    ExtractedText,
    ParserError,
)

logger = logging.getLogger(__name__)


@dataclass
class PDFMetadata:
    """Metadata extracted from PDF."""

    page_count: int
    author: str | None = None
    title: str | None = None
    creator: str | None = None


class PDFParserAdapter(DocumentParserPort):
    """
    PDF text extraction using pdfplumber.

    This adapter extracts raw text from PDF files, preserving
    basic structure and formatting where possible.
    """

    SUPPORTED_EXTENSIONS = [".pdf"]

    async def extract_text(self, file_content: bytes) -> ExtractedText:
        """
        Extract text content from a PDF file.

        Args:
            file_content: Raw bytes of the PDF file

        Returns:
            ExtractedText with content and metadata

        Raises:
            ParserError: If extraction fails
        """
        try:
            pdf_file = io.BytesIO(file_content)

            text_parts: list[str] = []
            page_count = 0

            with pdfplumber.open(pdf_file) as pdf:
                page_count = len(pdf.pages)

                for page in pdf.pages:
                    page_text = page.extract_text()
                    if page_text:
                        text_parts.append(page_text)

            full_text = "\n\n".join(text_parts)

            if not full_text or len(full_text.strip()) < 50:
                raise ParserError(
                    "PDF extraction returned insufficient text. "
                    "The file may be image-based or corrupted."
                )

            logger.info(
                f"PDF extracted successfully: {len(full_text)} chars from {page_count} pages"
            )

            return ExtractedText(
                content=full_text,
                char_count=len(full_text),
                source_type="pdf",
                metadata={"page_count": page_count},
            )

        except ParserError:
            raise
        except Exception as e:
            logger.error(f"PDF extraction failed: {e}")
            raise ParserError(f"Failed to extract text from PDF: {e}") from e

    def supports_format(self, filename: str) -> bool:
        """Check if this parser supports the given file format."""
        return any(filename.lower().endswith(ext) for ext in self.SUPPORTED_EXTENSIONS)

