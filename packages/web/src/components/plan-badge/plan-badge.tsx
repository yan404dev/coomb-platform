import type { User } from "@/entities";
import { formatPlanName } from "@/lib/user-utils";

interface PlanBadgeProps {
  planType: User["plan_type"];
  variant?: "default" | "compact" | "inline";
}

export function PlanBadge({ planType, variant = "default" }: PlanBadgeProps) {
  if (variant === "compact") {
    return (
      <span className="text-sm text-gray-600">
        {formatPlanName(planType)}
      </span>
    );
  }

  if (variant === "inline") {
    return (
      <span className="text-sm text-gray-600">
        Plano atual: {formatPlanName(planType)}
      </span>
    );
  }

  return (
    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/80 border border-primary/20">
      <span className="text-xs font-semibold text-primary">
        {formatPlanName(planType)}
      </span>
    </div>
  );
}
