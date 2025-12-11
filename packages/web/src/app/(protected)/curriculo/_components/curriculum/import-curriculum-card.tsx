"use client";

import { FolderUp, Info, Loader2 } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/shared/components/ui/accordion";
import { Card } from "@/shared/components/ui/card";
import { useImportCurriculumCard } from "./import-curriculum-card.model";

export function ImportCurriculumCard() {
  const { fileInputRef, isImporting, onFileChange } = useImportCurriculumCard();

  return (
    <Card className="w-full px-4">
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="import-curriculum">
          <AccordionTrigger className="text-xl font-bold text-foreground pt-4 flex">
            <h1>
              Importe o seu currículo
              <span className="text-sm text-[rgba(75,85,99,0.80)] font-normal ml-2">
                Opcional
              </span>
            </h1>
          </AccordionTrigger>
          <AccordionContent className="pb-6">
            <div className="relative">
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={onFileChange}
                disabled={isImporting}
                ref={fileInputRef}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <div className="items-center bg-gray-200 justify-center rounded-lg py-6 md:py-10 px-6 md:px-10 border-dashed border w-full h-full border-gray-300 hover:border-[#028A5A] transition-colors cursor-pointer flex flex-col space-y-4">
                {isImporting ? (
                  <>
                    <Loader2
                      size={48}
                      className="md:w-16 md:h-16 text-[#028A5A] animate-spin"
                    />
                    <h5 className="break-inside-avoid font-body text-lg md:text-xl font-bold text-foreground text-center">
                      Importando currículo...
                    </h5>
                    <p className="text-sm text-gray-600 text-center">
                      Aguarde enquanto a IA processa seu currículo
                    </p>
                  </>
                ) : (
                  <>
                    <FolderUp
                      size={48}
                      className="md:w-16 md:h-16 text-[#028A5A]"
                    />
                    <h5 className="break-inside-avoid font-body text-lg md:text-xl font-bold text-foreground text-center">
                      Selecione o arquivo
                    </h5>
                  </>
                )}
              </div>
            </div>

            <div className="bg-[#D0F2FF] rounded-lg p-3 mt-4">
              <p className="font-medium text-[#04297A] text-sm">
                <Info className="inline-block mr-1" size={18} />
                Importe seu currículo para completarmos suas experiências e
                formações de maneira mais rápida, ou{" "}
                <button className="text-[#04297A] underline hover:text-[#04297A]/80 font-semibold cursor-pointer">
                  clique aqui para sincronizar com o LinkedIn
                </button>
                .
              </p>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </Card>
  );
}
