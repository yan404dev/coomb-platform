import { useState, useRef, useEffect, useCallback } from "react";

interface UseDashboardInputModelProps {
  onSend: (message: string, file?: File | null) => Promise<void> | void;
  suggestionText?: string;
  onSuggestionApplied?: () => void;
  isLoading?: boolean;
}

export function useDashboardInputModel({
  onSend,
  suggestionText,
  onSuggestionApplied,
  isLoading = false,
}: UseDashboardInputModelProps) {
  const [message, setMessage] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (suggestionText && suggestionText.trim()) {
      setMessage(suggestionText);
      onSuggestionApplied?.();

      setTimeout(() => {
        textareaRef.current?.focus();
      }, 0);
    }
  }, [suggestionText, onSuggestionApplied]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      const newHeight = Math.min(textareaRef.current.scrollHeight, 200);
      textareaRef.current.style.height = `${newHeight}px`;
    }
  }, [message]);

  const handleSend = useCallback(() => {
    if (message.trim() || selectedFile) {
      onSend(message, selectedFile);
      setMessage("");
      setSelectedFile(null);
    }
  }, [message, selectedFile, onSend]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    },
    [handleSend]
  );

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        setSelectedFile(file);
      }
    },
    []
  );

  const handleAttachClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleRemoveFile = useCallback(() => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (
        file.type === "application/pdf" ||
        file.type === "application/msword" ||
        file.type ===
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      ) {
        setSelectedFile(file);
      }
    }
  }, []);

  return {
    message,
    setMessage,
    selectedFile,
    isDragging,
    textareaRef,
    fileInputRef,
    dropZoneRef,
    handleKeyDown,
    handleSend,
    handleFileSelect,
    handleAttachClick,
    handleRemoveFile,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    isLoading,
  };
}

