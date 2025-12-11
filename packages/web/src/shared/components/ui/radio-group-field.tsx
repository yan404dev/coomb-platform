import type { Control } from "react-hook-form";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/components/ui/form";
import { Label } from "@/shared/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/shared/components/ui/radio-group";
import { cn } from "@/shared/lib/utils";

interface RadioOption {
  value: string | boolean;
  label: string;
}

interface RadioGroupFieldProps {
  control: Control<any>;
  registerName: string;
  label?: string;
  options: RadioOption[];
  labelClassName?: string;
  className?: string;
  disabled?: boolean;
  description?: string;
  orientation?: "horizontal" | "vertical";
}

export const RadioGroupField = ({
  registerName,
  label,
  control,
  options,
  labelClassName,
  className,
  disabled = false,
  description,
  orientation = "horizontal",
}: RadioGroupFieldProps) => {
  return (
    <FormField
      control={control}
      name={registerName}
      render={({ field }) => (
        <FormItem className="space-y-2">
          {label && (
            <FormLabel
              className={cn(
                "text-sm font-medium text-foreground block",
                labelClassName,
              )}
            >
              {label}
            </FormLabel>
          )}
          <FormControl>
            <RadioGroup
              value={String(field.value)}
              onValueChange={(value) => {
                if (value === "true") {
                  field.onChange(true);
                } else if (value === "false") {
                  field.onChange(false);
                } else {
                  field.onChange(value);
                }
              }}
              disabled={disabled}
              className={cn(
                "flex gap-4",
                orientation === "vertical" && "flex-col",
                className,
              )}
            >
              {options.map((option) => (
                <div key={String(option.value)} className="flex items-center">
                  <RadioGroupItem
                    value={String(option.value)}
                    id={`${registerName}-${String(option.value)}`}
                    className="mr-2"
                  />
                  <Label
                    htmlFor={`${registerName}-${String(option.value)}`}
                    className="font-normal cursor-pointer"
                  >
                    {option.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
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
