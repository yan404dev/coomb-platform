"use client";

import { Controller } from "react-hook-form";
import {
  FormField,
  FormInput,
  FormSaveFooter,
  FormSection,
} from "@/components/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useOutrasInfoModel } from "./outras-info.model";

export function OutrasInfoTab() {
  const { form, loading, error, onSubmit, clearCnhFields } =
    useOutrasInfoModel();

  const {
    control,
    register,
    watch,
    formState: { errors, isSubmitting },
  } = form;

  const hasCnh = watch("has_cnh");

  if (loading) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Carregando informações adicionais...
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pb-24">
      <FormSection
        id="informacoes-adicionais"
        title="Informações adicionais"
        defaultOpen
      >
        {error ? (
          <p className="text-sm text-destructive">
            Não foi possível carregar as informações agora.
          </p>
        ) : null}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Cidade" required>
            <FormInput
              placeholder="Rio de Janeiro"
              className="h-12"
              {...register("city")}
            />
            {errors.city && (
              <span className="text-xs text-red-500">
                {errors.city.message}
              </span>
            )}
          </FormField>

          <FormField label="Estado" required>
            <FormInput
              placeholder="Rio de Janeiro"
              className="h-12"
              {...register("state")}
            />
            {errors.state && (
              <span className="text-xs text-red-500">
                {errors.state.message}
              </span>
            )}
          </FormField>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Pretensão salarial" required>
            <FormInput
              placeholder="R$ 8.000,00"
              className="h-12"
              {...register("salary_expectation")}
            />
            {errors.salary_expectation && (
              <span className="text-xs text-red-500">
                {errors.salary_expectation.message}
              </span>
            )}
          </FormField>

          <FormField label="Você possui CNH?" required>
            <Controller
              control={control}
              name="has_cnh"
              render={({ field }) => (
                <RadioGroup
                  className="flex gap-6"
                  value={field.value ? "sim" : "nao"}
                  onValueChange={(value) => {
                    const booleanValue = value === "sim";
                    field.onChange(booleanValue);
                    if (!booleanValue) {
                      clearCnhFields();
                    }
                  }}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="sim" id="cnh-sim" />
                    <label
                      htmlFor="cnh-sim"
                      className="text-sm font-medium leading-none cursor-pointer"
                    >
                      Sim
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="nao" id="cnh-nao" />
                    <label
                      htmlFor="cnh-nao"
                      className="text-sm font-medium leading-none cursor-pointer"
                    >
                      Não
                    </label>
                  </div>
                </RadioGroup>
              )}
            />
            {errors.has_cnh && (
              <span className="text-xs text-red-500">
                {errors.has_cnh.message}
              </span>
            )}
          </FormField>
        </div>
      </FormSection>

      <FormSection id="redes-sociais" title="Redes sociais" defaultOpen>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="LinkedIn">
            <FormInput
              type="url"
              placeholder="https://linkedin.com/in/seu-perfil"
              className="h-12"
              {...register("linkedin")}
            />
            {errors.linkedin && (
              <span className="text-xs text-red-500">
                {errors.linkedin.message}
              </span>
            )}
          </FormField>

          <FormField label="Instagram">
            <FormInput
              type="url"
              placeholder="https://www.instagram.com/seuusuario"
              className="h-12"
              {...register("instagram")}
            />
            {errors.instagram && (
              <span className="text-xs text-red-500">
                {errors.instagram.message}
              </span>
            )}
          </FormField>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Facebook">
            <FormInput
              type="url"
              placeholder="https://www.facebook.com/seuusuario"
              className="h-12"
              {...register("facebook")}
            />
            {errors.facebook && (
              <span className="text-xs text-red-500">
                {errors.facebook.message}
              </span>
            )}
          </FormField>

          <FormField label="Portfólio">
            <FormInput
              type="url"
              placeholder="https://www.seuportfolio.com"
              className="h-12"
              {...register("portfolio")}
            />
            {errors.portfolio && (
              <span className="text-xs text-red-500">
                {errors.portfolio.message}
              </span>
            )}
          </FormField>
        </div>
      </FormSection>

      <FormSaveFooter
        buttonLabel={isSubmitting ? "Salvando..." : "Salvar"}
        buttonProps={{ type: "submit", disabled: isSubmitting }}
      />
    </form>
  );
}
