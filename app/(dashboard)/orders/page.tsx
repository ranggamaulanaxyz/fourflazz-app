"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { OrderStatusBadge } from "@/components/order-status-badge";
import { mockOrders } from "@/lib/mock-data";
import { formatRupiah, formatDate } from "@/lib/format";
import type { Order, OrderStatus } from "@/types";
import { ClipboardList, Package } from "lucide-react";

type FilterTab = "all" | "success" | "processing" | "failed";

const filterTabs: { value: FilterTab; label: string }[] = [
  { value: "all", label: "Semua" },
  { value: "success", label: "Berhasil" },
  { value: "processing", label: "Proses" },
  { value: "failed", label: "Gagal" },
];

const statusMap: Record<FilterTab, OrderStatus[]> = {
  all: [],
  success: ["success"],
  processing: ["created", "debited", "processing", "pending_vendor", "manual_processing"],
  failed: ["failed", "refunded"],
};

export default function OrdersPage() {
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState<FilterTab>("all");

  useEffect(() => {
    const timer = setTimeout(() => {
      setOrders(mockOrders);
      setLoading(false);
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  const filteredOrders =
    filter === "all"
      ? orders
      : orders.filter((o) => statusMap[filter].includes(o.status));

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 space-y-6 animate-fade-in-up">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold flex items-center gap-2">
          <ClipboardList className="h-5 w-5 text-primary" />
          Riwayat Order
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Pantau semua transaksi pembelian Anda
        </p>
      </div>

      {/* Filter Tabs */}
      <Tabs value={filter} onValueChange={(v) => setFilter(v as FilterTab)}>
        <TabsList className="w-full h-auto flex-wrap gap-1 bg-transparent p-0">
          {filterTabs.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="px-4 py-2 rounded-lg border border-border/50 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:border-primary text-xs font-medium"
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {/* Orders List */}
      <div className="space-y-2">
        {loading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <Card key={i} className="p-4 border-border/50">
              <div className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-lg" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-3.5 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
                <div className="space-y-2 text-right">
                  <Skeleton className="h-5 w-16 rounded-full ml-auto" />
                  <Skeleton className="h-3 w-20" />
                </div>
              </div>
            </Card>
          ))
        ) : filteredOrders.length === 0 ? (
          <Card className="p-8 border-border/50 text-center">
            <Package className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">
              Tidak ada order di kategori ini
            </p>
          </Card>
        ) : (
          filteredOrders.map((order) => (
            <Link key={order.id} href={`/orders/${order.id}/`}>
              <Card className="p-4 border-border/50 hover:border-primary/30 hover:shadow-md transition-all tap-scale cursor-pointer">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate">
                      {order.productName}
                    </p>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      <span className="text-xs text-muted-foreground font-mono">
                        {order.destination}
                      </span>
                      <span className="text-xs text-muted-foreground">•</span>
                      <span className="text-xs text-muted-foreground">
                        {order.providerName}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatDate(order.createdAt)}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <OrderStatusBadge status={order.status} />
                    <span className="text-sm font-bold">
                      {formatRupiah(order.price)}
                    </span>
                  </div>
                </div>
              </Card>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
