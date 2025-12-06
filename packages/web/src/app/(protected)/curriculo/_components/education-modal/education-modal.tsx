"use client";

import { Button } from "@/components/ui/button";
import { CheckboxField } from "@/components/ui/checkbox-field";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { InputField } from "@/components/ui/input-field";
import { InputMaskField } from "@/components/ui/input-mask-field";
import { useEducationModalModel } from "./education-modal.model";
import { masks } from "@/shared/lib/masks";

interface EducationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  educationId?: string;
  defaultValues?: any;
}

export function EducationModal({
  open,
  onOpenChange,
  educationId,
  defaultValues,
}: EducationModalProps) {
  const { form, submitEducation } = useEducationModalModel({
    defaultValues,
    educationId,
    onSuccess: () => onOpenChange(false),
    open,
  });

  const isCurrent = form.watch("current");

  const handleSubmit = async (data: any) => {
    await submitEducation(data);
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
                {educationId ? "Editar formação" : "Adicionar formação"}
              </DialogTitle>
            </DialogHeader>

            <InputField
              label="Curso/Formação"
              registerName="degree"
              placeholder="Ex: Engenharia de Software"
              control={form.control}
              labelClassName="font-medium text-sm text-foreground"
            />

            <InputField
              label="Instituição"
              registerName="institution"
              placeholder="Ex: Universidade Federal do Rio de Janeiro"
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
                label="Data de conclusão"
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
              label="Ainda estou cursando"
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
                  : "Salvar formação"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
