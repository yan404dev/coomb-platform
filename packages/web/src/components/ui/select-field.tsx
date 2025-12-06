import React from "react";
import type { Control } from "react-hook-form";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { cn } from "@/shared/lib/utils";

type SelectValue = string | null | undefined;

interface SelectOption {
  value: string;
  label: string;
}

interface SelectFieldProps {
  control: Control<any>;
  registerName: string;
  label?: string;
  placeholder?: string;
  labelClassName?: string;
  className?: string;
  options: SelectOption[];
  disabled?: boolean;
  description?: string;
  required?: boolean;
  onValueChange?: (value: string) => void;
}

export const SelectField = ({
  registerName,
  label,
  control,
  placeholder = "Selecione",
  labelClassName,
  className,
  options,
  disabled = false,
  description,
  required = false,
  onValueChange,
}: SelectFieldProps) => {
  return (
    <FormField
      control={control}
      name={registerName}
      render={({ field }) => (
        <FormItem className="group w-full space-y-2">
          {label && (
            <FormLabel
              htmlFor={registerName}
              className={cn(
                "text-[14px] font-medium leading-6 text-[#798AA3]",
                labelClassName,
              )}
            >
              {label}
            </FormLabel>
          )}
          <FormControl>
            <div className="relative w-full">
              <select
                id={registerName}
                className={cn(
                  "w-full h-14 px-4 pr-10 rounded-lg border border-gray-500/[.32] bg-transparent text-base outline-none transition-all",
                  "focus-visible:border-2 focus-visible:border-primary",
                  "placeholder:text-muted-foreground",
                  "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
                  "appearance-none",
                  className,
                )}
                value={
                  field.value === null || field.value === undefined
                    ? ""
                    : String(field.value)
                }
                onChange={(event) => {
                  field.onChange(event.target.value);
                  onValueChange?.(event.target.value);
                }}
                onBlur={field.onBlur}
                disabled={disabled}
              >
                <option value="">{placeholder}</option>
                {options.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-sm text-muted-foreground">
                ▾
              </span>
            </div>
          </FormControl>

          {description && (
            <FormDescription className="text-xs text-gray-400">
              {description}
            </FormDescription>
          )}
          <FormMessage className="pt-1" />
        </FormItem>
      )}
    />
  );
};
