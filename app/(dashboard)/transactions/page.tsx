"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { mockWalletTransactions, mockWallet } from "@/lib/mock-data";
import { formatRupiah, formatDate } from "@/lib/format";
import type { WalletTransaction, WalletTransactionType } from "@/types";
import {
  TrendingUp,
  ArrowDownLeft,
  ArrowUpRight,
  RotateCcw,
  Wallet,
  Settings,
} from "lucide-react";

type FilterType = "all" | WalletTransactionType;

const filterTabs: { value: FilterType; label: string }[] = [
  { value: "all", label: "Semua" },
  { value: "topup", label: "Top Up" },
  { value: "debit", label: "Pembelian" },
  { value: "refund", label: "Refund" },
];

const txTypeIcon: Record<string, typeof ArrowDownLeft> = {
  topup: ArrowDownLeft,
  debit: ArrowUpRight,
  refund: RotateCcw,
  adjustment: Settings,
};

const txTypeColor: Record<string, string> = {
  topup: "text-emerald-400 bg-emerald-500/10",
  debit: "text-red-400 bg-red-500/10",
  refund: "text-cyan-400 bg-cyan-500/10",
  adjustment: "text-amber-400 bg-amber-500/10",
};

export default function TransactionsPage() {
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [filter, setFilter] = useState<FilterType>("all");

  useEffect(() => {
    const timer = setTimeout(() => {
      setTransactions(mockWalletTransactions);
      setLoading(false);
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  const filtered =
    filter === "all"
      ? transactions
      : transactions.filter((tx) => tx.type === filter);

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 space-y-6 animate-fade-in-up">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          Mutasi Saldo
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Riwayat semua perubahan saldo wallet Anda
        </p>
      </div>

      {/* Current Balance */}
      <Card className="border-border/50 bg-card/80">
        <div className="flex items-center gap-3 p-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Wallet className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Saldo saat ini</p>
            <p className="text-lg font-bold">
              {formatRupiah(mockWallet.balance)}
            </p>
          </div>
        </div>
      </Card>

      {/* Filter Tabs */}
      <Tabs value={filter} onValueChange={(v) => setFilter(v as FilterType)}>
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

      {/* Transaction List */}
      <Card className="border-border/50 divide-y divide-border/50">
        {loading
          ? Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 p-4">
                <Skeleton className="h-10 w-10 rounded-lg" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-3.5 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
                <div className="text-right space-y-2">
                  <Skeleton className="h-4 w-24 ml-auto" />
                  <Skeleton className="h-3 w-16 ml-auto" />
                </div>
              </div>
            ))
          : filtered.length === 0
          ? (
            <div className="p-8 text-center">
              <Wallet className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">
                Tidak ada transaksi di kategori ini
              </p>
            </div>
          )
          : filtered.map((tx) => {
              const Icon = txTypeIcon[tx.type] ?? ArrowUpRight;
              const color = txTypeColor[tx.type] ?? "text-muted-foreground bg-muted";
              return (
                <div
                  key={tx.id}
                  className="flex items-center gap-3 p-4 hover:bg-accent/30 transition-colors"
                >
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-xl shrink-0 ${color}`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {tx.description}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {formatDate(tx.createdAt)}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p
                      className={`text-sm font-bold tabular-nums ${
                        tx.amount > 0 ? "text-emerald-400" : "text-red-400"
                      }`}
                    >
                      {tx.amount > 0 ? "+" : ""}
                      {formatRupiah(tx.amount)}
                    </p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">
                      Saldo: {formatRupiah(tx.balanceAfter)}
                    </p>
                  </div>
                </div>
              );
            })}
      </Card>
    </div>
  );
}
