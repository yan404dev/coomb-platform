"use client";

import { ArrowUp, Plus } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { AttachmentPreview } from "@/shared/components/attachment-preview";
import { motion, AnimatePresence } from "framer-motion";
import { useDashboardInputModel } from "./dashboard-input.model";

interface DashboardInputProps {
  onSend: (message: string, file?: File | null) => Promise<void> | void;
  suggestionText?: string;
  onSuggestionApplied?: () => void;
  isLoading?: boolean;
}

export const DashboardInput = ({
  onSend,
  suggestionText,
  onSuggestionApplied,
  isLoading = false,
}: DashboardInputProps) => {
  const {
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
  } = useDashboardInputModel({
    onSend,
    suggestionText,
    onSuggestionApplied,
    isLoading,
  });

  return (
    <div className="w-full max-w-3xl mx-auto px-2 sm:px-0 space-y-3">
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.doc,.docx"
        onChange={handleFileSelect}
        className="hidden"
      />

      <div
        ref={dropZoneRef}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative rounded-3xl border-2 transition-all duration-200 bg-background ${
          isDragging
            ? "border-blue-400 border-dashed bg-blue-50/50 shadow-lg scale-[1.01]"
            : selectedFile
            ? "border-gray-300 hover:border-gray-400"
            : "border-gray-300 hover:border-gray-400"
        }`}
      >
        {/* Drag overlay */}
        <AnimatePresence>
          {isDragging && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-10 flex items-center justify-center rounded-3xl bg-blue-50/80 backdrop-blur-sm"
            >
              <div className="flex flex-col items-center gap-2">
                <Plus className="h-8 w-8 text-blue-600" />
                <p className="text-sm font-medium text-blue-700">
                  Solte o arquivo aqui
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {selectedFile && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="px-3 pt-3"
            >
              <AttachmentPreview
                file={selectedFile}
                onRemove={handleRemoveFile}
              />
            </motion.div>
          )}
        </AnimatePresence>
        <textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={
            selectedFile
              ? "Adicione uma descrição da vaga ou orientações específicas (opcional)..."
              : "Cole a descrição da vaga, faça uma pergunta ou peça ajuda com sua carreira..."
          }
          rows={1}
          className={`w-full bg-transparent px-12 sm:px-14 pb-4 focus:outline-none resize-none overflow-y-auto min-h-[56px] max-h-[200px] text-sm sm:text-base text-gray-900 placeholder:text-gray-400 transition-all ${
            selectedFile ? "pt-2" : "pt-4"
          }`}
        />

        <Button
          type="button"
          size="icon"
          onClick={handleAttachClick}
          className="absolute left-2 sm:left-3 bottom-3 h-8 w-8 sm:h-9 sm:w-9 rounded-full bg-transparent hover:bg-gray-200 text-gray-700 hover:text-gray-900 transition-all cursor-pointer"
        >
          <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
        </Button>

        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="absolute right-2 sm:right-3 bottom-3"
        >
          <Button
            type="button"
            size="icon"
            onClick={handleSend}
            variant="default"
            disabled={isLoading || (!message.trim() && !selectedFile)}
            className="h-9 w-9 sm:h-10 sm:w-10 rounded-full disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-all"
          >
            {isLoading ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <ArrowUp className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
              </motion.div>
            ) : (
              <ArrowUp className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
            )}
          </Button>
        </motion.div>
      </div>
    </div>
  );
};
