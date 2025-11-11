import { Clock, Package, Truck, CheckCircle, XCircle } from "lucide-react";

function clsx(...classes) {
  return classes.filter(Boolean).join(" ");
}

const statusConfig = {
  processing: {
    icon: Package,
    color: "text-blue-600",
    bg: "bg-blue-50",
    ring: "ring-blue-200",
    dot: "bg-blue-500",
    label: "Processing",
  },
  shipped: {
    icon: Truck,
    color: "text-purple-600",
    bg: "bg-purple-50",
    ring: "ring-purple-200",
    dot: "bg-purple-500",
    label: "Shipped",
  },
  delivered: {
    icon: CheckCircle,
    color: "text-green-600",
    bg: "bg-green-50",
    ring: "ring-green-200",
    dot: "bg-green-500",
    label: "Delivered",
  },
  cancelled: {
    icon: XCircle,
    color: "text-rose-600",
    bg: "bg-rose-50",
    ring: "ring-rose-200",
    dot: "bg-rose-500",
    label: "Cancelled",
  },
};

export default function StatusBadge({ status, className }) {
  const cfg = statusConfig[status] || statusConfig.pending;
  const Icon = cfg.icon;

  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ring-1",
        cfg.bg,
        cfg.color,
        cfg.ring,
        className
      )}
    >
      <Icon className="w-3.5 h-3.5" />
      {cfg.label}
    </span>
  );
}
