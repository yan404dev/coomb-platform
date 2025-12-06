import Link from "next/link";
import { cn } from "@/lib/utils";
import { CoombIcon } from "./coomb-icon";
import { CoombWordmark } from "./coomb-wordmark";
import { LogoProps } from "./logo.types";

const sizeMap = {
  sm: {
    icon: "h-6 w-6",
    wordmark: "h-6 w-auto",
  },
  md: {
    icon: "h-8 w-8",
    wordmark: "h-8 w-auto",
  },
  lg: {
    icon: "h-12 w-12",
    wordmark: "h-12 w-auto",
  },
  xl: {
    icon: "h-16 w-16",
    wordmark: "h-16 w-auto",
  },
};

export const Logo = ({
  variant = "full",
  size = "md",
  href = "/",
  className,
  svgClassName,
  ...props
}: LogoProps) => {
  const renderLogo = () => {
    switch (variant) {
      case "icon":
        return (
          <CoombIcon
            className={cn(sizeMap[size].icon, svgClassName)}
            aria-label="Coomb"
          />
        );
      case "wordmark":
        return (
          <CoombWordmark
            className={cn(sizeMap[size].wordmark, svgClassName)}
            aria-label="Coomb"
          />
        );
      case "full":
        return (
          <>
            <CoombIcon
              className={cn(sizeMap[size].icon, "mr-2", svgClassName)}
              aria-label="Coomb"
            />
            <CoombWordmark
              className={cn(sizeMap[size].wordmark, svgClassName)}
              aria-label="Coomb"
            />
          </>
        );
    }
  };

  return (
    <div className={cn("flex items-center", className)} {...props}>
      <Link
        href={href}
        className="relative flex items-center transition-opacity hover:opacity-80"
        aria-label="Página inicial do Coomb"
      >
        {renderLogo()}
      </Link>
    </div>
  );
};
