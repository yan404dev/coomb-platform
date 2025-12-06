import { cn } from "@/lib/utils";

interface InfoBoxProps {
  title: string;
  description: string;
  className?: string;
  variant?: "default" | "blue";
}

export function InfoBox({
  title,
  description,
  className,
  variant = "blue",
}: InfoBoxProps) {
  const variantStyles = {
    blue: "bg-[#D0F2FF] text-[#04297A]",
    default: "bg-gray-100 text-gray-800",
  };

  return (
    <div className={cn("rounded-lg p-3", variantStyles[variant], className)}>
      <h4 className="font-semibold text-sm mb-2">{title}</h4>
      <p className="text-xs">{description}</p>
    </div>
  );
}
