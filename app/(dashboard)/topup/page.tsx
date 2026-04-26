"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { mockWallet } from "@/lib/mock-data";
import { formatRupiah } from "@/lib/format";
import { toast } from "sonner";
import {
  ArrowUpCircle,
  Wallet,
  CheckCircle2,
  Loader2,
  CreditCard,
  QrCode,
  Building2,
} from "lucide-react";

const presetAmounts = [50000, 100000, 200000, 300000, 500000, 1000000];

const paymentMethods = [
  { id: "qris", label: "QRIS", icon: QrCode, description: "Scan QR code" },
  {
    id: "bank",
    label: "Bank Transfer",
    icon: Building2,
    description: "Virtual Account",
  },
  {
    id: "card",
    label: "Kartu Kredit",
    icon: CreditCard,
    description: "Visa / Mastercard",
  },
];

export default function TopUpPage() {
  const [amount, setAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState("");
  const [selectedMethod, setSelectedMethod] = useState("qris");
  const [showConfirm, setShowConfirm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [processing, setProcessing] = useState(false);

  const effectiveAmount = amount ?? (parseInt(customAmount) || 0);

  const handlePreset = (value: number) => {
    setAmount(value);
    setCustomAmount("");
  };

  const handleCustomChange = (value: string) => {
    const num = value.replace(/\D/g, "");
    setCustomAmount(num);
    setAmount(null);
  };

  const handleConfirm = async () => {
    if (effectiveAmount < 10000) {
      toast.error("Minimal top up Rp 10.000");
      return;
    }
    setShowConfirm(true);
  };

  const handleProcess = async () => {
    setProcessing(true);
    // Simulate payment processing
    await new Promise((r) => setTimeout(r, 1500));
    setProcessing(false);
    setShowConfirm(false);
    setShowSuccess(true);
    toast.success(`Top up ${formatRupiah(effectiveAmount)} berhasil!`);
  };

  return (
    <div className="mx-auto max-w-lg px-4 py-6 space-y-6 animate-fade-in-up">
      {/* Current Balance */}
      <Card className="border-border/50 bg-card/80">
        <CardContent className="flex items-center gap-3 p-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Wallet className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Saldo saat ini</p>
            <p className="text-lg font-bold">
              {formatRupiah(mockWallet.balance)}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Amount Selection */}
      <Card className="border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <ArrowUpCircle className="h-4 w-4 text-primary" />
            Pilih Nominal
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Preset Buttons */}
          <div className="grid grid-cols-3 gap-2">
            {presetAmounts.map((preset) => (
              <Button
                key={preset}
                variant={amount === preset ? "default" : "outline"}
                className={`h-12 text-sm font-semibold tap-scale ${
                  amount === preset
                    ? "glow-primary"
                    : "hover:border-primary/30"
                }`}
                onClick={() => handlePreset(preset)}
              >
                {formatRupiah(preset)}
              </Button>
            ))}
          </div>

          {/* Custom Amount */}
          <div className="space-y-2">
            <Label htmlFor="custom-amount" className="text-xs text-muted-foreground">
              Atau masukkan nominal lain
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                Rp
              </span>
              <Input
                id="custom-amount"
                type="text"
                placeholder="0"
                value={customAmount}
                onChange={(e) => handleCustomChange(e.target.value)}
                className="h-12 pl-10 text-lg font-semibold"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Method */}
      <Card className="border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <CreditCard className="h-4 w-4 text-primary" />
            Metode Pembayaran
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {paymentMethods.map((method) => {
            const Icon = method.icon;
            const isSelected = selectedMethod === method.id;
            return (
              <button
                key={method.id}
                onClick={() => setSelectedMethod(method.id)}
                className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all tap-scale ${
                  isSelected
                    ? "border-primary/50 bg-primary/5"
                    : "border-border/50 hover:border-primary/20"
                }`}
              >
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                    isSelected
                      ? "bg-primary/10 text-primary"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium">{method.label}</p>
                  <p className="text-xs text-muted-foreground">
                    {method.description}
                  </p>
                </div>
                {isSelected && (
                  <CheckCircle2 className="h-5 w-5 text-primary ml-auto" />
                )}
              </button>
            );
          })}
        </CardContent>
      </Card>

      {/* Submit Button */}
      <Button
        onClick={handleConfirm}
        disabled={effectiveAmount < 10000}
        className="w-full h-12 text-sm font-semibold"
        size="lg"
      >
        <ArrowUpCircle className="mr-2 h-4 w-4" />
        Top Up {effectiveAmount > 0 ? formatRupiah(effectiveAmount) : ""}
      </Button>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Konfirmasi Top Up</DialogTitle>
            <DialogDescription>
              Pastikan nominal dan metode pembayaran sudah benar
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-4">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Nominal</span>
              <span className="font-semibold">
                {formatRupiah(effectiveAmount)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Metode</span>
              <span className="font-medium">
                {
                  paymentMethods.find((m) => m.id === selectedMethod)?.label
                }
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Biaya Admin</span>
              <span className="font-medium text-emerald-400">Gratis</span>
            </div>
            <div className="border-t pt-3 flex justify-between text-sm">
              <span className="font-semibold">Total</span>
              <span className="font-bold text-primary">
                {formatRupiah(effectiveAmount)}
              </span>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirm(false)}>
              Batal
            </Button>
            <Button onClick={handleProcess} disabled={processing}>
              {processing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Memproses...
                </>
              ) : (
                "Bayar Sekarang"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Success Dialog */}
      <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
        <DialogContent className="sm:max-w-sm text-center">
          <div className="flex flex-col items-center gap-4 py-6">
            <div className="flex h-16 w-16 items-center justify-center rounded-full gradient-success glow-success">
              <CheckCircle2 className="h-8 w-8 text-white" />
            </div>
            <DialogHeader>
              <DialogTitle className="text-lg font-bold mb-1">
                Top Up Berhasil!
              </DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground">
                {formatRupiah(effectiveAmount)} telah ditambahkan ke saldo Anda
              </DialogDescription>
            </DialogHeader>
            <Button
              className="w-full mt-2"
              onClick={() => setShowSuccess(false)}
            >
              Selesai
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
