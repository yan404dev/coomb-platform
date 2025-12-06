import type { Control, FieldPath, FieldValues } from "react-hook-form";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/shared/lib/utils";

interface CheckboxFieldProps<TFieldValues extends FieldValues> {
  control: Control<TFieldValues>;
  registerName: FieldPath<TFieldValues>;
  label?: string;
  labelClassName?: string;
  className?: string;
  disabled?: boolean;
  description?: string;
}

export function CheckboxField<TFieldValues extends FieldValues>({
  registerName,
  label,
  control,
  labelClassName,
  className,
  disabled = false,
  description,
}: CheckboxFieldProps<TFieldValues>) {
  return (
    <FormField
      control={control}
      name={registerName}
      render={({ field }) => (
        <FormItem className={cn("flex flex-row items-start space-x-3 space-y-0", className)}>
          <FormControl>
            <Checkbox
              checked={field.value}
              onCheckedChange={field.onChange}
              disabled={disabled}
            />
          </FormControl>
          <div className="space-y-1 leading-none">
            {label && (
              <FormLabel className={cn("cursor-pointer", labelClassName)}>
                {label}
              </FormLabel>
            )}
            {description && <FormDescription>{description}</FormDescription>}
            <FormMessage />
          </div>
        </FormItem>
      )}
    />
  );
}
