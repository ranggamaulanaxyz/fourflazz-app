import { Badge } from "@/components/ui/badge";
import type { OrderStatus } from "@/types";

const statusConfig: Record<
  OrderStatus,
  { label: string; variant: "default" | "secondary" | "destructive" | "outline"; className: string }
> = {
  created: {
    label: "Dibuat",
    variant: "secondary",
    className: "bg-slate-500/10 text-slate-400 border-slate-500/20",
  },
  debited: {
    label: "Dipotong",
    variant: "secondary",
    className: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  },
  processing: {
    label: "Diproses",
    variant: "secondary",
    className: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  },
  pending_vendor: {
    label: "Menunggu Vendor",
    variant: "secondary",
    className: "bg-orange-500/10 text-orange-400 border-orange-500/20",
  },
  manual_processing: {
    label: "Proses Manual",
    variant: "secondary",
    className: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  },
  success: {
    label: "Berhasil",
    variant: "secondary",
    className: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  },
  failed: {
    label: "Gagal",
    variant: "destructive",
    className: "bg-red-500/10 text-red-400 border-red-500/20",
  },
  refunded: {
    label: "Dikembalikan",
    variant: "secondary",
    className: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
  },
};

interface OrderStatusBadgeProps {
  status: OrderStatus;
}

export function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  const config = statusConfig[status];
  return (
    <Badge
      variant="outline"
      className={`text-[10px] font-semibold border ${config.className}`}
    >
      {config.label}
    </Badge>
  );
}
