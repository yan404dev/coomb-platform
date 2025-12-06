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
import { InputMaskField } from "@/components/ui/input-mask-field";
import { useCertificationModalModel } from "./certification-modal.model";
import { masks } from "@/shared/lib/masks";

interface CertificationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  certificationId?: string;
  defaultValues?: any;
}

export function CertificationModal({
  open,
  onOpenChange,
  certificationId,
  defaultValues,
}: CertificationModalProps) {
  const { form, submitCertification } = useCertificationModalModel({
    defaultValues,
    certificationId,
    onSuccess: () => onOpenChange(false),
    open,
  });

  const handleSubmit = async (data: any) => {
    await submitCertification(data);
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
                {certificationId ? "Editar certificação" : "Adicionar certificação"}
              </DialogTitle>
            </DialogHeader>

            <InputField
              label="Nome do curso/certificação"
              registerName="name"
              placeholder="Ex: AWS Certified Solutions Architect"
              control={form.control}
              labelClassName="font-medium text-sm text-foreground"
            />

            <InputField
              label="Instituição"
              registerName="institution"
              placeholder="Ex: Amazon Web Services"
              control={form.control}
              labelClassName="font-medium text-sm text-foreground"
            />

            <InputMaskField
              label="Data de conclusão"
              registerName="completionDate"
              placeholder="mm/aaaa"
              control={form.control}
              labelClassName="font-medium text-sm text-foreground"
              mask={masks.monthYear.mask}
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
                  : "Salvar certificação"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
