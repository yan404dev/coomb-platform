"use client";

import { X } from "lucide-react";
import { motion } from "framer-motion";

interface AttachmentPreviewProps {
  file: File;
  onRemove: () => void;
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 10) / 10 + " " + sizes[i];
}

function getFileIcon(file: File) {
  const type = file.type.toLowerCase();
  const name = file.name.toLowerCase();

  if (type.includes("pdf") || name.endsWith(".pdf")) {
    return "https://drive-thirdparty.googleusercontent.com/32/type/application/pdf";
  }

  if (
    type.includes("word") ||
    type.includes("document") ||
    name.endsWith(".doc") ||
    name.endsWith(".docx")
  ) {
    return "https://drive-thirdparty.googleusercontent.com/32/type/application/vnd.openxmlformats-officedocument.wordprocessingml.document";
  }

  return "https://drive-thirdparty.googleusercontent.com/32/type/text/plain";
}

export function AttachmentPreview({ file, onRemove }: AttachmentPreviewProps) {
  const fileSize = formatFileSize(file.size);
  const fileIcon = getFileIcon(file);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.15 }}
      className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50/50 px-3 py-2 max-w-fit"
    >
      <div className="flex-shrink-0">
        <img
          src={fileIcon}
          alt=""
          className="h-5 w-5"
          onError={(e) => {
            e.currentTarget.style.display = "none";
          }}
        />
      </div>

      <div className="flex flex-col gap-0.5 min-w-0">
        <span className="text-sm text-gray-900 truncate max-w-[180px]">
          {file.name}
        </span>
        <span className="text-xs text-gray-500">{fileSize}</span>
      </div>

      <button
        onClick={onRemove}
        className="flex-shrink-0 rounded-full p-1 text-gray-400 hover:bg-gray-200 hover:text-gray-600 transition-colors cursor-pointer"
        aria-label="Remover anexo"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </motion.div>
  );
}
