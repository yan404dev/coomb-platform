import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { userService } from "@/services";
import { useResume } from "@/hooks/use-resume";
import { AboutFormRequest, aboutFormSchema } from "./about.schema";
import { ResumeEntity } from "@/entities";

export function useAboutModel(onContinue?: () => void) {
  const { data, isLoading, error, mutate } = useResume();

  const form = useForm<AboutFormRequest>({
    resolver: zodResolver(aboutFormSchema),
    defaultValues: {
      full_name: "",
      email: "",
      phone: "",
      cpf: "",
      birth_date: "",
      has_disability: false,
      race: "",
      sexual_orientation: "",
      gender: "",
      state: "",
      city: "",
      salary_expectation: "",
      has_cnh: false,
      instagram: "",
      facebook: "",
      linkedin: "",
      portfolio: "",
      professional_summary: "",
      career_goals: "",
    },
  });

  useEffect(() => {
    const userData = data?.user;
    if (userData) {
      form.reset({ ...userData } as AboutFormRequest);
    }
  }, [data]);

  async function onSubmit(
    formData: AboutFormRequest
  ): Promise<ResumeEntity | undefined> {
    if (!data?.user?.id) return;

    await userService.update(data.user.id, formData);
    await mutate();
    toast.success("Sobre você atualizado com sucesso");

    if (onContinue) {
      onContinue();
    }
  }

  return {
    form,
    loading: isLoading && !data,
    error,
    onSubmit,
    data,
  };
}
