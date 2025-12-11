"use client";

import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Form } from "@/shared/components/ui/form";
import { InputField } from "@/shared/components/ui/input-field";
import { SelectField } from "@/shared/components/ui/select-field";
import type { SkillRequest } from "./skill-modal.schema";
import { useSkillModalModel } from "./skill-modal.model";

const LEVEL_OPTIONS = [
  { value: "none", label: "Nenhum" },
  { value: "basic", label: "Básico" },
  { value: "intermediate", label: "Intermediário" },
  { value: "advanced", label: "Avançado" },
];

interface SkillModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultValues?: Partial<SkillRequest> | null;
  skillId?: string;
}

export function SkillModal({
  open,
  onOpenChange,
  defaultValues = null,
  skillId,
}: SkillModalProps) {
  const { form, submitSkill } = useSkillModalModel({
    defaultValues,
    skillId,
    onSuccess: () => onOpenChange(false),
  });

  async function handleSave(data: SkillRequest) {
    await submitSkill(data);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-foreground">
            {skillId ? "Editar habilidade" : "Adicionar habilidade"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSave)} className="space-y-6">
            <InputField
              control={form.control}
              registerName="name"
              label="Nome"
              placeholder="Ex: React"
              labelClassName="font-medium text-sm text-foreground"
            />

            <SelectField
              control={form.control}
              registerName="level"
              label="Nível (opcional)"
              placeholder="Selecione o nível"
              options={LEVEL_OPTIONS}
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
