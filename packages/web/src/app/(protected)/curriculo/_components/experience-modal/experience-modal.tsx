"use client";

import { Button } from "@/shared/components/ui/button";
import { CheckboxField } from "@/shared/components/ui/checkbox-field";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Form } from "@/shared/components/ui/form";
import { InputField } from "@/shared/components/ui/input-field";
import { InputMaskField } from "@/shared/components/ui/input-mask-field";
import { TextareaField } from "@/shared/components/ui/textarea-field";
import { useExperienceModalModel } from "./experience-modal.model";
import { masks } from "@/shared/lib/masks";

interface ExperienceModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  experienceId?: string;
  defaultValues?: any;
}

export function ExperienceModal({
  open,
  onOpenChange,
  experienceId,
  defaultValues,
}: ExperienceModalProps) {
  const { form, submitExperience } = useExperienceModalModel({
    defaultValues,
    experienceId,
    onSuccess: () => onOpenChange(false),
    open,
  });

  const isCurrent = form.watch("current");

  const handleSubmit = async (data: any) => {
    await submitExperience(data);
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-foreground">
                {experienceId ? "Editar experiência" : "Adicionar experiência"}
              </DialogTitle>
            </DialogHeader>

            <InputField
              label="Cargo"
              registerName="position"
              placeholder="Digite o seu cargo"
              control={form.control}
              labelClassName="font-medium text-sm text-foreground"
            />

            <InputField
              label="Empresa"
              registerName="company"
              placeholder="Digite o nome da empresa"
              control={form.control}
              labelClassName="font-medium text-sm text-foreground"
            />

            <div className="grid grid-cols-2 gap-4">
              <InputMaskField
                label="Data de início"
                registerName="startDate"
                placeholder="mm/aaaa"
                control={form.control}
                labelClassName="font-medium text-sm text-foreground"
                mask={masks.monthYear.mask}
              />

              <InputMaskField
                label="Data de fim"
                registerName="endDate"
                placeholder="mm/aaaa"
                control={form.control}
                disabled={isCurrent}
                labelClassName="font-medium text-sm text-foreground"
                mask={masks.monthYear.mask}
              />
            </div>

            <CheckboxField
              control={form.control}
              registerName="current"
              label="Ainda trabalho aqui"
              labelClassName="font-medium text-sm text-foreground"
            />

            <TextareaField
              label="Descrição das atividades"
              registerName="description"
              placeholder="Descreva o seu cargo e as suas principais responsabilidades"
              control={form.control}
              rows={6}
              labelClassName="font-medium text-sm text-foreground"
            />

            <DialogFooter className="gap-2">
              <Button type="button" variant="outline" onClick={handleCancel}>
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={form.formState.isSubmitting}
                className="bg-[#028A5A] hover:bg-[#02754d] text-white"
              >
                {form.formState.isSubmitting
                  ? "Salvando..."
                  : "Salvar experiência"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
