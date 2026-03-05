import { type ReactNode } from "react";

type BadgeVariant = "default" | "critical" | "high" | "medium" | "low";

const VARIANT_CLASSES: Record<BadgeVariant, string> = {
  default:
    "bg-panel-light text-gray-300 border border-panel-border",
  critical:
    "bg-red-900/50 text-red-400 border border-red-800",
  high:
    "bg-orange-900/50 text-orange-400 border border-orange-800",
  medium:
    "bg-yellow-900/50 text-yellow-400 border border-yellow-800",
  low:
    "bg-green-900/50 text-green-400 border border-green-800",
};

interface BadgeProps {
  variant?: BadgeVariant;
  children: ReactNode;
  className?: string;
}

export function Badge({
  variant = "default",
  children,
  className = "",
}: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${VARIANT_CLASSES[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
