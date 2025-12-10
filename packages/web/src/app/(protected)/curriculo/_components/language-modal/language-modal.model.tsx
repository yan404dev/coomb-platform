import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useTransition } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { type LanguageRequest, languageSchema } from "./language-modal.schema";
import { languageService } from "../../_services/language.service";

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
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

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

    startTransition(async () => {
      try {
        if (isEditing && languageId) {
          await languageService.update(languageId, {
            name: data.name,
            level: data.level as any,
          });
          toast.success("Idioma atualizado com sucesso");
        } else {
          await languageService.add({
            name: data.name,
            level: data.level as any,
          });
          toast.success("Idioma adicionado com sucesso");
        }

        form.reset(EMPTY_LANGUAGE);
        router.refresh();
        onSuccess?.();
      } catch (error: any) {
        const errorMessage = error?.message || "Erro ao salvar idioma";
        toast.error(errorMessage);
      }
    });
  }

  return {
    form,
    submitLanguage,
    isPending,
  };
}
