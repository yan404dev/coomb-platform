"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useResume } from "@/hooks/use-resume";
import { useUser } from "@/hooks/use-user";
import {
  type AdditionalInfoFormRequest,
  additionalInfoFormSchema,
} from "./additional-info-form.schema";
import { userService } from "@/services";

const DEFAULT_VALUES: AdditionalInfoFormRequest = {
  city: "",
  state: "",
  salary_expectation: "",
  has_cnh: false,
  linkedin: "",
  instagram: "",
  facebook: "",
  portfolio: "",
};

export function useOutrasInfoModel() {
  const { data: resume, isLoading, error, mutate } = useResume();
  const { user, mutate: mutateUser } = useUser();

  const form = useForm<AdditionalInfoFormRequest>({
    resolver: zodResolver(additionalInfoFormSchema),
    defaultValues: DEFAULT_VALUES,
  });

  useEffect(() => {
    if (!resume) {
      form.reset(DEFAULT_VALUES);
      return;
    }

    const aboutData = resume.user ?? user;
    form.reset({
      city: aboutData?.city ?? "",
      state: aboutData?.state ?? "",
      salary_expectation: aboutData?.salary_expectation ?? "",
      has_cnh: aboutData?.has_cnh ?? false,
      linkedin: aboutData?.linkedin ?? "",
      instagram: aboutData?.instagram ?? "",
      facebook: aboutData?.facebook ?? "",
      portfolio: aboutData?.portfolio ?? "",
    });
  }, [resume, user, form]);

  const clearCnhFields = useCallback(() => {
    form.setValue("has_cnh", false);
  }, [form]);

  const onSubmit = async () => {
    if (!resume) {
      toast.error("Currículo não encontrado");
      return;
    }

    await userService.update(resume.user_id, form.getValues());
    await Promise.all([mutate(), mutateUser()]);
    toast.success("Informações adicionais atualizadas com sucesso");
  };

  return {
    form,
    loading: isLoading && !resume,
    error,
    onSubmit,
    clearCnhFields,
  };
}
