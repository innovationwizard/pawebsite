import type { ProjectStatus } from "@/lib/types/database";

type BadgeVariant = "default" | "success" | "warning" | "error" | "info";

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const variantClasses: Record<BadgeVariant, string> = {
  default: "bg-gray/10 text-gray",
  success: "bg-green-100 text-green-800",
  warning: "bg-amber-100 text-amber-800",
  error: "bg-red-100 text-red-800",
  info: "bg-celeste/10 text-celeste",
};

export function Badge({ children, variant = "default", className = "" }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${variantClasses[variant]} ${className}`}
    >
      {children}
    </span>
  );
}

const statusVariantMap: Record<ProjectStatus, BadgeVariant> = {
  active: "success",
  nearly_sold_out: "warning",
  sold_out: "info",
  delivered: "info",
  under_construction: "info",
  frozen: "default",
};

const statusLabelMap: Record<ProjectStatus, string> = {
  active: "En Venta",
  nearly_sold_out: "Últimas Unidades",
  sold_out: "Entregado",
  delivered: "Entregado",
  under_construction: "En Construcción",
  frozen: "Próximamente",
};

export function ProjectStatusBadge({
  status,
  className = "",
}: {
  status: ProjectStatus;
  className?: string;
}) {
  return (
    <Badge variant={statusVariantMap[status]} className={className}>
      {statusLabelMap[status]}
    </Badge>
  );
}
