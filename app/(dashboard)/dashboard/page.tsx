"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { WalletCard } from "@/components/wallet-card";
import { OrderStatusBadge } from "@/components/order-status-badge";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { mockWallet, mockOrders, mockWalletTransactions } from "@/lib/mock-data";
import { formatRupiah, formatRelativeTime } from "@/lib/format";
import type { Order, WalletTransaction } from "@/types";
import {
  Smartphone,
  Wifi,
  Zap,
  Gift,
  ArrowRight,
  ArrowDownLeft,
  ArrowUpRight,
  RotateCcw,
} from "lucide-react";

const quickActions = [
  {
    href: "/purchase/?cat=pulsa",
    label: "Pulsa",
    icon: Smartphone,
    color: "bg-rose-500/10 text-rose-400",
  },
  {
    href: "/purchase/?cat=data",
    label: "Data",
    icon: Wifi,
    color: "bg-blue-500/10 text-blue-400",
  },
  {
    href: "/purchase/?cat=pln",
    label: "Token PLN",
    icon: Zap,
    color: "bg-amber-500/10 text-amber-400",
  },
  {
    href: "/purchase/?cat=voucher",
    label: "Voucher",
    icon: Gift,
    color: "bg-emerald-500/10 text-emerald-400",
  },
];

const txTypeIcon: Record<string, typeof ArrowDownLeft> = {
  topup: ArrowDownLeft,
  debit: ArrowUpRight,
  refund: RotateCcw,
  adjustment: RotateCcw,
};

const txTypeColor: Record<string, string> = {
  topup: "text-emerald-400",
  debit: "text-red-400",
  refund: "text-cyan-400",
  adjustment: "text-amber-400",
};

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);

  useEffect(() => {
    // Simulate API loading
    const timer = setTimeout(() => {
      setOrders(mockOrders.slice(0, 3));
      setTransactions(mockWalletTransactions.slice(0, 5));
      setLoading(false);
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 space-y-6 animate-fade-in-up">
      {/* Wallet Card */}
      <WalletCard balance={mockWallet.balance} />

      {/* Quick Actions */}
      <section>
        <h2 className="text-sm font-semibold text-muted-foreground mb-3">
          Layanan
        </h2>
        <div className="grid grid-cols-4 gap-3">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.href}
                href={action.href}
                className="flex flex-col items-center gap-2 p-3 rounded-xl bg-card border border-border/50 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all tap-scale"
              >
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-xl ${action.color}`}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <span className="text-xs font-medium text-center">
                  {action.label}
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Recent Transactions */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-muted-foreground">
            Mutasi Terakhir
          </h2>
          <Link
            href="/transactions/"
            className="text-xs text-primary hover:underline flex items-center gap-1"
          >
            Lihat semua <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
        <Card className="border-border/50 divide-y divide-border/50">
          {loading
            ? Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3 p-4">
                  <Skeleton className="h-9 w-9 rounded-lg" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-3 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                  <Skeleton className="h-4 w-20" />
                </div>
              ))
            : transactions.map((tx) => {
                const Icon = txTypeIcon[tx.type] ?? ArrowUpRight;
                const color = txTypeColor[tx.type] ?? "text-muted-foreground";
                return (
                  <div
                    key={tx.id}
                    className="flex items-center gap-3 p-4 hover:bg-accent/50 transition-colors"
                  >
                    <div
                      className={`flex h-9 w-9 items-center justify-center rounded-lg bg-muted ${color}`}
                    >
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {tx.description}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatRelativeTime(tx.createdAt)}
                      </p>
                    </div>
                    <p
                      className={`text-sm font-semibold tabular-nums ${
                        tx.amount > 0 ? "text-emerald-400" : "text-red-400"
                      }`}
                    >
                      {tx.amount > 0 ? "+" : ""}
                      {formatRupiah(tx.amount)}
                    </p>
                  </div>
                );
              })}
        </Card>
      </section>

      {/* Recent Orders */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-muted-foreground">
            Order Terakhir
          </h2>
          <Link
            href="/orders/"
            className="text-xs text-primary hover:underline flex items-center gap-1"
          >
            Lihat semua <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
        <div className="space-y-2">
          {loading
            ? Array.from({ length: 3 }).map((_, i) => (
                <Card key={i} className="p-4 border-border/50">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-9 w-9 rounded-lg" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-3 w-3/4" />
                      <Skeleton className="h-3 w-1/2" />
                    </div>
                    <Skeleton className="h-5 w-16 rounded-full" />
                  </div>
                </Card>
              ))
            : orders.map((order) => (
                <Link key={order.id} href={`/orders/${order.id}/`}>
                  <Card className="p-4 border-border/50 hover:border-primary/30 hover:shadow-md transition-all tap-scale cursor-pointer">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {order.productName}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-muted-foreground">
                            {order.destination}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            •
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {formatRelativeTime(order.createdAt)}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <OrderStatusBadge status={order.status} />
                        <span className="text-xs font-semibold text-muted-foreground">
                          {formatRupiah(order.price)}
                        </span>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
        </div>
      </section>
    </div>
  );
}
