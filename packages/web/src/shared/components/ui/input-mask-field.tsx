import type { Control, FieldPath, FieldValues } from "react-hook-form";
import { IMaskInput } from "react-imask";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/components/ui/form";
import { cn } from "@/shared/lib/utils";

interface InputMaskFieldProps<TFieldValues extends FieldValues> {
  control: Control<TFieldValues>;
  registerName: FieldPath<TFieldValues>;
  label?: string;
  placeholder?: string;
  labelClassName?: string;
  className?: string;
  disabled?: boolean;
  description?: string;
  mask: any;
  unmask?: boolean | "typed";
  lazy?: boolean;
  blocks?: Record<string, any>;
  definitions?: Record<string, RegExp>;
}

export function InputMaskField<TFieldValues extends FieldValues>({
  registerName,
  label,
  control,
  placeholder,
  labelClassName,
  className,
  disabled = false,
  description,
  mask,
  unmask = false,
  lazy = false,
  blocks,
  definitions,
}: InputMaskFieldProps<TFieldValues>) {
  return (
    <FormField
      control={control}
      name={registerName}
      render={({ field }) => (
        <FormItem className="group w-full space-y-2">
          {label && (
            <FormLabel className={cn(labelClassName)}>{label}</FormLabel>
          )}
          <FormControl>
            <IMaskInput
              {...field}
              mask={mask}
              unmask={unmask}
              lazy={lazy}
              blocks={blocks}
              definitions={definitions}
              value={field.value ?? ""}
              onAccept={(value: any) => {
                field.onChange(value);
              }}
              placeholder={placeholder}
              disabled={disabled}
              className={cn(
                "flex items-center gap-x-3 px-4 h-14 rounded-lg border border-gray-500/[.32] w-full bg-transparent text-base outline-none transition-all focus-within:border-2 focus-within:border-primary placeholder:text-muted-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
                className
              )}
            />
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage className="pt-1" />
        </FormItem>
      )}
    />
  );
}
