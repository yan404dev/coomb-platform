import { HTMLAttributes } from "react";

export type LogoVariant = "icon" | "wordmark" | "full";
export type LogoSize = "sm" | "md" | "lg" | "xl";

export interface LogoProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  variant?: LogoVariant;

  size?: LogoSize;

  href?: string;

  className?: string;

  svgClassName?: string;
}
