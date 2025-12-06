"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { InputField } from "@/components/ui/input-field";
import { SelectField } from "@/components/ui/select-field";
import type { LanguageRequest } from "./language-modal.schema";
import { useLanguageModalModel } from "./language-modal.model";

const LEVEL_OPTIONS = [
  { value: "none", label: "Nenhum" },
  { value: "beginner", label: "Iniciante" },
  { value: "basic", label: "Básico" },
  { value: "intermediate", label: "Intermediário" },
  { value: "advanced", label: "Avançado" },
  { value: "fluent", label: "Fluente" },
  { value: "native", label: "Domínio pleno" },
];

interface LanguageModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultValues?: Partial<LanguageRequest> | null;
  languageId?: string;
}

export function LanguageModal({
  open,
  onOpenChange,
  defaultValues = null,
  languageId,
}: LanguageModalProps) {
  const { form, submitLanguage } = useLanguageModalModel({
    defaultValues,
    languageId,
    onSuccess: () => onOpenChange(false),
  });

  async function handleSave(data: LanguageRequest) {
    await submitLanguage(data);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-foreground">
            {languageId ? "Editar idioma" : "Adicionar idioma"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSave)} className="space-y-6">
            <InputField
              control={form.control}
              registerName="name"
              label="Idioma"
              placeholder="Ex: Inglês"
              labelClassName="font-medium text-sm text-foreground"
            />

            <SelectField
              control={form.control}
              registerName="level"
              label="Nível"
              placeholder="Selecione o nível"
              options={LEVEL_OPTIONS}
              required
              labelClassName="font-medium text-sm text-foreground"
            />

            <DialogFooter className="gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  form.reset(defaultValues ?? undefined);
                  onOpenChange(false);
                }}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={form.formState.isSubmitting}
                className="bg-[#028A5A] hover:bg-[#02754d] text-white"
              >
                {form.formState.isSubmitting ? "Salvando..." : "Salvar"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
