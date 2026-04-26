"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { OrderStatusBadge } from "@/components/order-status-badge";
import { mockOrders } from "@/lib/mock-data";
import { formatRupiah, formatDate } from "@/lib/format";
import type { Order } from "@/types";
import {
  ArrowLeft,
  Copy,
  CheckCircle2,
  XCircle,
  Clock,
  RefreshCw,
  Package,
} from "lucide-react";
import { toast } from "sonner";

const statusIcons: Record<string, typeof CheckCircle2> = {
  created: Clock,
  debited: Clock,
  processing: RefreshCw,
  pending_vendor: Clock,
  manual_processing: Clock,
  success: CheckCircle2,
  failed: XCircle,
  refunded: RefreshCw,
};

const statusColors: Record<string, string> = {
  created: "text-slate-400 border-slate-500/30",
  debited: "text-amber-400 border-amber-500/30",
  processing: "text-blue-400 border-blue-500/30",
  pending_vendor: "text-orange-400 border-orange-500/30",
  manual_processing: "text-purple-400 border-purple-500/30",
  success: "text-emerald-400 border-emerald-500/30",
  failed: "text-red-400 border-red-500/30",
  refunded: "text-cyan-400 border-cyan-500/30",
};

interface OrderDetailClientProps {
  params: Promise<{ id: string }>;
}

export default function OrderDetailClient({ params }: OrderDetailClientProps) {
  const { id } = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      const found = mockOrders.find((o) => o.id === id);
      setOrder(found ?? null);
      setLoading(false);
    }, 400);
    return () => clearTimeout(timer);
  }, [id]);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} disalin!`);
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-lg px-4 py-6 space-y-6">
        <Skeleton className="h-6 w-32" />
        <Card className="border-border/50">
          <CardContent className="p-6 space-y-4">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="mx-auto max-w-lg px-4 py-6 text-center">
        <Package className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
        <h2 className="text-lg font-bold mb-2">Order Tidak Ditemukan</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Order dengan ID tersebut tidak ditemukan
        </p>
        <Button onClick={() => router.push("/orders/")}>
          Kembali ke Riwayat
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-6 space-y-6 animate-fade-in-up">
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Kembali
      </button>

      {/* Status Header */}
      <Card className="border-border/50 overflow-hidden">
        <div
          className={`p-6 text-center ${
            order.status === "success"
              ? "gradient-success"
              : order.status === "failed" || order.status === "refunded"
              ? "bg-destructive/10"
              : "bg-primary/10"
          }`}
        >
          <OrderStatusBadge status={order.status} />
          <h1 className="text-xl font-bold mt-3">{order.productName}</h1>
          <p className="text-2xl font-bold mt-1">
            {formatRupiah(order.price)}
          </p>
        </div>
      </Card>

      {/* Order Details */}
      <Card className="border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Detail Order</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Order ID</span>
            <button
              onClick={() => copyToClipboard(order.id, "Order ID")}
              className="flex items-center gap-1 font-mono text-xs hover:text-primary"
            >
              {order.id}
              <Copy className="h-3 w-3" />
            </button>
          </div>
          <Separator />
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Produk</span>
            <span className="font-medium">{order.productName}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Provider</span>
            <span className="font-medium">{order.providerName}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Nomor Tujuan</span>
            <span className="font-mono font-medium">{order.destination}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Harga</span>
            <span className="font-bold text-primary">
              {formatRupiah(order.price)}
            </span>
          </div>
          {order.vendorName && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Vendor</span>
              <span className="font-medium">{order.vendorName}</span>
            </div>
          )}
          {order.serialNumber && (
            <>
              <Separator />
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Serial Number</span>
                <button
                  onClick={() =>
                    copyToClipboard(order.serialNumber!, "Serial Number")
                  }
                  className="flex items-center gap-1 font-mono text-xs text-emerald-400 hover:text-emerald-300"
                >
                  {order.serialNumber}
                  <Copy className="h-3 w-3" />
                </button>
              </div>
            </>
          )}
          <Separator />
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Tanggal</span>
            <span className="font-medium">{formatDate(order.createdAt)}</span>
          </div>
        </CardContent>
      </Card>

      {/* Status Timeline */}
      <Card className="border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Status Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative space-y-0">
            {order.statusLogs.map((log, idx) => {
              const Icon = statusIcons[log.status] ?? Clock;
              const color = statusColors[log.status] ?? "text-muted-foreground";
              const isLast = idx === order.statusLogs.length - 1;
              return (
                <div key={idx} className="flex gap-3 pb-4 last:pb-0">
                  {/* Timeline line + dot */}
                  <div className="flex flex-col items-center">
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-full border-2 bg-card shrink-0 ${color}`}
                    >
                      <Icon className="h-4 w-4" />
                    </div>
                    {!isLast && (
                      <div className="w-px flex-1 bg-border/50 mt-1" />
                    )}
                  </div>
                  {/* Content */}
                  <div className="pt-1 pb-2">
                    <p className="text-sm font-medium">{log.message}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {formatDate(log.timestamp)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
