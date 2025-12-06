import { CircleX } from "lucide-react";
import type { Control } from "react-hook-form";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/shared/lib/utils";

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  control: Control<any>;
  registerName: string;
  type?: string;
  label?: string;
  placeholder?: string;
  labelClassName?: string;
  className?: string;
  showClearButton?: boolean;
  disabled?: boolean;
  inputMode?: "text" | "numeric" | "decimal";
  description?: string;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  inputRef?: React.Ref<HTMLInputElement>;
}

export const InputField = ({
  registerName,
  label,
  control,
  placeholder,
  type,
  labelClassName,
  className,
  disabled = false,
  showClearButton = false,
  inputMode = "text",
  description,
  onBlur,
  onInput,
  inputRef,
}: Props) => {
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
            <div className="relative">
              <Input
                id={registerName}
                placeholder={placeholder}
                {...field}
                value={field.value || ""}
                onInput={(e) => {
                  field.onChange(e.currentTarget.value);

                  if (onInput) onInput(e);
                }}
                type={type}
                autoComplete="off"
                autoCapitalize="off"
                className={cn(
                  "w-full py-2 text-sm",
                  className,
                  disabled && "cursor-not-allowed",
                )}
                disabled={disabled}
                inputMode={inputMode}
                onBlur={(e) => {
                  field.onBlur();
                  if (onBlur) onBlur(e);
                }}
              />

              {showClearButton && field.value && !disabled && (
                <button
                  type="button"
                  onClick={() => field.onChange("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  <CircleX className="h-5 w-5 text-[#798AA3]" />
                </button>
              )}
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
