import { Plus } from "lucide-react";

interface AddItemButtonProps {
  label: string;
  onClick?: () => void;
  variant?: "neutral" | "success";
}

export function AddItemButton({
  label,
  onClick,
  variant = "neutral",
}: AddItemButtonProps) {
  const baseStyles =
    "flex items-center justify-between px-4 py-6 border rounded-lg border-dashed w-full transition-colors cursor-pointer";

  const variants = {
    neutral:
      "bg-background border-gray-500/[0.32] hover:border-[#028A5A] text-foreground",
    success: "bg-[#028A5A] border-[#028A5A] hover:bg-[#02754d] text-white",
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className={`${baseStyles} ${variants[variant]}`}
    >
      <h2 className="break-inside-avoid font-body text-base font-semibold text-foreground">
        {label}
      </h2>
      <Plus className="h-6 w-6 text-foreground" />
    </button>
  );
}
