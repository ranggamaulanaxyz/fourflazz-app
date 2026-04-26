"use client";

import { formatRupiah } from "@/lib/format";
import { Wallet, ArrowUpCircle, TrendingUp } from "lucide-react";
import Link from "next/link";

interface WalletCardProps {
  balance: number;
}

export function WalletCard({ balance }: WalletCardProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl gradient-wallet p-6 text-white shadow-xl glow-primary">
      {/* Background decoration */}
      <div className="absolute -right-6 -top-6 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
      <div className="absolute -left-10 -bottom-10 h-40 w-40 rounded-full bg-white/5 blur-3xl" />

      <div className="relative z-10">
        {/* Label */}
        <div className="flex items-center gap-2 text-white/70 text-sm mb-1">
          <Wallet className="h-4 w-4" />
          <span>Saldo Anda</span>
        </div>

        {/* Balance */}
        <p className="text-3xl font-bold tracking-tight mb-6">
          {formatRupiah(balance)}
        </p>

        {/* Actions */}
        <div className="flex gap-3">
          <Link
            href="/topup/"
            className="flex items-center gap-2 rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur-sm px-4 py-2.5 text-sm font-semibold transition-all tap-scale"
          >
            <ArrowUpCircle className="h-4 w-4" />
            Top Up
          </Link>
          <Link
            href="/transactions/"
            className="flex items-center gap-2 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-sm px-4 py-2.5 text-sm font-medium transition-all tap-scale"
          >
            <TrendingUp className="h-4 w-4" />
            Mutasi
          </Link>
        </div>
      </div>
    </div>
  );
}
