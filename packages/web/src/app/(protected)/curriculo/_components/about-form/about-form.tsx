"use client";

import { useCallback } from "react";
import { CategoryDialog, FormSaveFooter, FormSection } from "@/components/form";
import { Form } from "@/components/ui/form";
import { InputField } from "@/components/ui/input-field";
import { InputMaskField } from "@/components/ui/input-mask-field";
import { RadioGroupField } from "@/components/ui/radio-group-field";
import { SelectField } from "@/components/ui/select-field";
import { InfoBox } from "@/components/info-box";
import { Skeleton } from "@/components/ui/skeleton";
import { useAboutModel } from "./about.model";
import { masks } from "@/shared/lib/masks";
import {
  hasDisabilityOptions,
  sexOptions,
  raceOptions,
  sexualOrientationOptions,
  genderOptions,
  sexualOrientationCategories,
  genderCategories,
} from "./about-form.constants";

interface AboutFormProps {
  onContinue?: () => void;
}

export function AboutForm({ onContinue }: AboutFormProps) {
  const { form, loading, onSubmit } = useAboutModel(onContinue);

  if (loading) {
    return (
      <div className="space-y-6 pb-24">
        <FormSection
          id="informacoes-pessoais"
          title="Informações pessoais"
          defaultOpen
        >
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-14 w-full" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Skeleton className="h-14 w-full" />
            <Skeleton className="h-14 w-full" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Skeleton className="h-14 w-full" />
            <Skeleton className="h-14 w-full" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Skeleton className="h-14 w-full" />
            <Skeleton className="h-14 w-full" />
          </div>
          <Skeleton className="h-16 w-full" />
        </FormSection>

        <FormSection id="diversidade" title="Diversidade">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Skeleton className="h-14 w-full" />
            <Skeleton className="h-14 w-full" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Skeleton className="h-14 w-full" />
            <Skeleton className="h-14 w-full" />
          </div>
          <Skeleton className="h-24 w-full" />
        </FormSection>

        <FormSaveFooter rightContent={<Skeleton className="h-10 w-40" />} />
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="pb-24">
        <FormSection
          id="informacoes-pessoais"
          title="Informações pessoais"
          defaultOpen
        >
          <InputField
            control={form.control}
            registerName="full_name"
            label="Nome completo (Nome social)"
            placeholder="Digite seu nome completo"
            labelClassName="font-medium text-sm text-foreground after:content-['*'] after:ml-1 after:text-red-500"
            className="w-full"
          />

          <InputField
            control={form.control}
            registerName="email"
            label="Email"
            type="email"
            placeholder="seu@email.com"
            labelClassName="font-medium text-sm text-foreground after:content-['*'] after:ml-1 after:text-red-500"
            className="w-full"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <InputMaskField
                control={form.control}
                registerName="cpf"
                label="CPF"
                placeholder="000.000.000-00"
                labelClassName="font-medium text-sm text-foreground after:content-['*'] after:ml-1 after:text-red-500"
                className="w-full"
                mask={masks.cpf.mask}
              />
            </div>

            <InputMaskField
              control={form.control}
              registerName="phone"
              label="Telefone"
              placeholder="(00) 00000-0000"
              labelClassName="font-medium text-sm text-foreground after:content-['*'] after:ml-1 after:text-red-500"
              className="w-full"
              mask={masks.phone}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputMaskField
              control={form.control}
              registerName="birth_date"
              label="Data de nascimento"
              placeholder="dd/mm/aaaa"
              labelClassName="font-medium text-sm text-foreground"
              className="w-full"
              mask={masks.date.mask}
            />

            <RadioGroupField
              control={form.control}
              registerName="has_disability"
              label="Você possui alguma deficiência?"
              options={hasDisabilityOptions}
              labelClassName="text-sm font-medium text-foreground"
              orientation="horizontal"
            />
          </div>

          <InfoBox
            title="Porque pedimos essas informações"
            description="Inúmeras organizações comprometidas em aumentar a inclusão e a pluralidade, publicam vagas exclusivas ou elegíveis PCD em nossa plataforma. Fornecer esta informação ajuda a empresa a saber se as funções da vaga estão compatíveis com sua deficiência."
          />
        </FormSection>

        <FormSection id="diversidade" title="Diversidade">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <SelectField
                control={form.control}
                registerName="sexual_orientation"
                label="Qual a sua orientação sexual?"
                placeholder="Selecione"
                options={sexualOrientationOptions}
                labelClassName="font-medium text-sm text-foreground"
                className="w-full"
              />
              <CategoryDialog
                title="Orientação Sexual"
                categories={sexualOrientationCategories}
              />
            </div>

            <div className="space-y-2">
              <SelectField
                control={form.control}
                registerName="gender"
                label="Qual o seu gênero?"
                placeholder="Selecione"
                options={genderOptions}
                labelClassName="font-medium text-sm text-foreground"
                className="w-full"
              />
              <CategoryDialog
                title="Identidade de Gênero"
                categories={genderCategories}
              />
            </div>
          </div>

          <SelectField
            control={form.control}
            registerName="race"
            label="Qual a sua raça/cor?"
            placeholder="Selecione"
            options={raceOptions}
            labelClassName="font-medium text-sm text-foreground"
            className="w-full"
          />

          <InfoBox
            title="Porque pedimos essas informações"
            description="Esses dados são importantes para empresas que acreditam e promovem a diversidade. Estas informações não são eliminatórias e os campos não são de preenchimento obrigatório."
          />
        </FormSection>

        <FormSaveFooter
          buttonLabel={
            form.formState.isSubmitting ? "Salvando..." : "Salvar e continuar"
          }
          buttonProps={{
            type: "submit",
            disabled: form.formState.isSubmitting,
          }}
        />
      </form>
    </Form>
  );
}
