"use client";

import { useState } from "react";
import { useUser } from "@/hooks";
import { AuthRequiredDialog } from "@/components/auth-required-dialog";

interface FileAttachmentCardProps {
  name: string;
  size?: number;
  type: string;
  downloadUrl?: string;
  onClick?: () => void;
  requireAuth?: boolean;
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 10) / 10 + " " + sizes[i];
}

function getFileIcon(type: string, name: string) {
  const typeLower = type.toLowerCase();
  const nameLower = name.toLowerCase();

  if (typeLower.includes("pdf") || nameLower.endsWith(".pdf")) {
    return "https://drive-thirdparty.googleusercontent.com/32/type/application/pdf";
  }

  if (
    typeLower.includes("word") ||
    typeLower.includes("document") ||
    nameLower.endsWith(".doc") ||
    nameLower.endsWith(".docx")
  ) {
    return "https://drive-thirdparty.googleusercontent.com/32/type/application/vnd.openxmlformats-officedocument.wordprocessingml.document";
  }

  return "https://drive-thirdparty.googleusercontent.com/32/type/text/plain";
}

export function FileAttachmentCard({
  name,
  size,
  type,
  downloadUrl,
  onClick,
  requireAuth = false,
}: FileAttachmentCardProps) {
  const { user } = useUser();
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const fileIcon = getFileIcon(type, name);

  const content = (
    <>
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
          {name}
        </span>
        <span className="text-xs text-gray-500">
          {downloadUrl
            ? "Clique para baixar"
            : size
            ? formatFileSize(size)
            : "Arquivo"}
        </span>
      </div>
    </>
  );

  const handleDownloadClick = (e: React.MouseEvent) => {
    if (requireAuth && !user) {
      e.preventDefault();
      setShowAuthDialog(true);
      return;
    }
  };

  const baseClassName =
    "inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 max-w-fit";

  const interactiveClassName = "hover:bg-gray-100 transition-colors cursor-pointer";

  if (downloadUrl) {
    return (
      <>
        <a
          href={downloadUrl}
          download
          className={`${baseClassName} ${interactiveClassName}`}
          onClick={handleDownloadClick}
        >
          {content}
        </a>
        <AuthRequiredDialog
          open={showAuthDialog}
          onOpenChange={setShowAuthDialog}
        />
      </>
    );
  }

  if (onClick) {
    return (
      <button
        onClick={onClick}
        className={`${baseClassName} ${interactiveClassName}`}
      >
        {content}
      </button>
    );
  }

  return <div className={baseClassName}>{content}</div>;
}
