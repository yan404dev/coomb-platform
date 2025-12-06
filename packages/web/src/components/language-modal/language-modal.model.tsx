import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useResume } from "@/hooks/use-resume";
import { type LanguageRequest, languageSchema } from "./language-modal.schema";
import { resumeService } from "@/services";

interface UseLanguageModalModelOptions {
  defaultValues?: Partial<LanguageRequest> | null;
  languageId?: string;
  onSuccess?: () => void;
}

const EMPTY_LANGUAGE: LanguageRequest = {
  id: undefined,
  name: "",
  level: "nenhum",
};

export function useLanguageModalModel(
  options: UseLanguageModalModelOptions = {}
) {
  const { defaultValues, languageId, onSuccess } = options;
  const { mutate } = useResume();

  const form = useForm<LanguageRequest>({
    resolver: zodResolver(languageSchema) as any,
    defaultValues: EMPTY_LANGUAGE,
  });

  useEffect(() => {
    form.reset({
      ...EMPTY_LANGUAGE,
      ...defaultValues,
    });
  }, [defaultValues, form]);

  async function submitLanguage(data: LanguageRequest) {
    const isEditing = !!languageId;

    try {
      if (isEditing && languageId) {
        await resumeService.updateLanguage(languageId, {
          name: data.name,
          level: data.level as any,
        });
        toast.success("Idioma atualizado com sucesso");
      } else {
        await resumeService.addLanguage({
          name: data.name,
          level: data.level as any,
        });
        toast.success("Idioma adicionado com sucesso");
      }

      await mutate();
      form.reset(EMPTY_LANGUAGE);
      onSuccess?.();
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message || "Erro ao salvar idioma";
      toast.error(errorMessage);
    }
  }

  return {
    form,
    submitLanguage,
  };
}
