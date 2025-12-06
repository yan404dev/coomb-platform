import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface FormSaveFooterProps {
  buttonLabel?: string;
  buttonProps?: ButtonHTMLAttributes<HTMLButtonElement>;
  children?: ReactNode;
  rightContent?: ReactNode;
}

export function FormSaveFooter({
  buttonLabel = "Salvar e continuar",
  buttonProps,
  children,
  rightContent,
}: FormSaveFooterProps) {
  const hasChildren = Boolean(children);

  const buttonPropsWithDefaults: ButtonHTMLAttributes<HTMLButtonElement> =
    buttonProps ?? {};
  const { className, type, ...restButtonProps } = buttonPropsWithDefaults;

  const buttonNode = rightContent ?? (
    <button
      {...restButtonProps}
      type={type ?? "button"}
      className={cn(
        "rounded-md bg-[#028A5A] px-6 py-2 text-sm font-semibold text-white shadow transition hover:bg-[#02764d]",
        className,
      )}
    >
      {buttonLabel}
    </button>
  );

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-4">
      <div className="container mx-auto px-4 md:px-8 lg:px-24">
        <div
          className={cn(
            "flex w-full items-center gap-4",
            hasChildren ? "justify-between" : "justify-end",
          )}
        >
          {hasChildren ? (
            <>
              <div className="flex items-center gap-3">{children}</div>
              {buttonNode}
            </>
          ) : (
            buttonNode
          )}
        </div>
      </div>
    </div>
  );
}
