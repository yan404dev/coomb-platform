import type { Control, FieldPath, FieldValues } from "react-hook-form";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface TextareaFieldProps<TFieldValues extends FieldValues> {
  control: Control<TFieldValues>;
  registerName: FieldPath<TFieldValues>;
  label?: string;
  placeholder?: string;
  labelClassName?: string;
  className?: string;
  disabled?: boolean;
  description?: string;
  rows?: number;
}

export function TextareaField<TFieldValues extends FieldValues>({
  registerName,
  label,
  control,
  placeholder,
  labelClassName,
  className,
  disabled = false,
  description,
  rows = 4,
}: TextareaFieldProps<TFieldValues>) {
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
            <Textarea
              {...field}
              placeholder={placeholder}
              disabled={disabled}
              rows={rows}
              className={cn(className)}
              value={field.value ?? ""}
            />
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage className="pt-1" />
        </FormItem>
      )}
    />
  );
}
