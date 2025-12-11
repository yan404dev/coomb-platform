import { HelpCircle } from "lucide-react";
import React from "react";
import { Input } from "@/shared/components/ui/input";
import { Textarea } from "@/shared/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/shared/components/ui/tooltip";
import { cn } from "@/shared/lib/utils";

interface FormFieldProps {
  label: string;
  required?: boolean;
  optional?: boolean;
  tooltip?: string;
  children: React.ReactNode;
}

export function FormField({
  label,
  required,
  optional,
  tooltip,
  children,
}: FormFieldProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <label className="text-base font-semibold text-foreground">
          {label}
          {required && <span className="text-red-500">*</span>}
          {optional && (
            <span className="text-sm text-[rgba(75,85,99,0.80)] font-normal ml-2">
              Opcional
            </span>
          )}
        </label>
        {tooltip && (
          <Tooltip>
            <TooltipTrigger asChild>
              <button type="button">
                <HelpCircle
                  size={16}
                  className="text-[rgba(75,85,99,0.80)] hover:text-foreground"
                />
              </button>
            </TooltipTrigger>
            <TooltipContent className="bg-black text-white p-3 max-w-xs">
              <p className="text-xs">{tooltip}</p>
            </TooltipContent>
          </Tooltip>
        )}
      </div>
      {children}
    </div>
  );
}

type FormInputProps = React.InputHTMLAttributes<HTMLInputElement>;

export const FormInput = React.forwardRef<HTMLInputElement, FormInputProps>(
  ({ type = "text", ...props }, ref) => {
    return <Input ref={ref} type={type} {...props} />;
  },
);
FormInput.displayName = "FormInput";

type SelectValue = string | null | undefined;

interface FormSelectProps
  extends Omit<
    React.SelectHTMLAttributes<HTMLSelectElement>,
    "value" | "defaultValue" | "onChange" | "onBlur"
  > {
  value?: SelectValue;
  defaultValue?: SelectValue;
  placeholder?: string;
  options: { value: string; label: string }[];
  onValueChange?: (value: string) => void;
  className?: string;
  onBlur?: React.FocusEventHandler<HTMLSelectElement>;
  disabled?: boolean;
  required?: boolean;
  onChange?: React.ChangeEventHandler<HTMLSelectElement>;
}

export const FormSelect = React.forwardRef<HTMLSelectElement, FormSelectProps>(
  (
    {
      value,
      defaultValue,
      placeholder = "Selecione",
      options,
      onValueChange,
      className,
      onBlur,
      onChange,
      ...rest
    },
    ref,
  ) => {
    const normalizedValue =
      value === null || value === undefined ? "" : String(value);
    const normalizedDefault =
      defaultValue === null || defaultValue === undefined
        ? ""
        : String(defaultValue);

    const isControlled = value !== undefined;

    const baseClass = cn(
      "w-full h-14 px-4 pr-10 rounded-lg border border-gray-500/[.32] bg-transparent text-base outline-none transition-all",
      "focus-visible:border-2 focus-visible:border-primary",
      "placeholder:text-muted-foreground",
      "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
      "appearance-none",
      className,
    );

    return (
      <div className="relative w-full">
        <select
          ref={ref}
          className={baseClass}
          value={isControlled ? normalizedValue : undefined}
          defaultValue={isControlled ? undefined : normalizedDefault}
          onChange={(event) => {
            onChange?.(event);
            onValueChange?.(event.target.value);
          }}
          onBlur={onBlur}
          {...rest}
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
    );
  },
);
FormSelect.displayName = "FormSelect";

interface FormTextareaProps {
  placeholder?: string;
  defaultValue?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  rows?: number;
  maxLength?: number;
  className?: string;
}

export function FormTextarea({
  placeholder,
  defaultValue,
  value,
  onChange,
  rows = 6,
  maxLength,
  className,
}: FormTextareaProps) {
  return (
    <Textarea
      placeholder={placeholder}
      defaultValue={defaultValue}
      value={value}
      onChange={onChange}
      rows={rows}
      maxLength={maxLength}
      className={className}
    />
  );
}
