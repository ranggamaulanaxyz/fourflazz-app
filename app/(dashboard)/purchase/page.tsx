"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { ProductCard } from "@/components/product-card";
import { ProviderIcon } from "@/components/provider-icon";
import {
  detectProvider,
  isValidPhone,
  PROVIDERS,
} from "@/lib/provider-detection";
import { mockProducts, mockWallet } from "@/lib/mock-data";
import { formatRupiah } from "@/lib/format";
import { toast } from "sonner";
import type { Product, ProductCategory, Provider } from "@/types";
import {
  Search,
  Smartphone,
  Wifi,
  Zap,
  Gift,
  Package,
  CheckCircle2,
  Loader2,
  AlertCircle,
} from "lucide-react";

const categoryTabs: { value: ProductCategory | "all"; label: string; icon: typeof Package }[] = [
  { value: "all", label: "Semua", icon: Package },
  { value: "pulsa", label: "Pulsa", icon: Smartphone },
  { value: "data", label: "Data", icon: Wifi },
  { value: "pln", label: "Token PLN", icon: Zap },
  { value: "voucher", label: "Voucher", icon: Gift },
];

export default function PurchasePage() {
  const searchParams = useSearchParams();
  const initialCat = searchParams.get("cat") as ProductCategory | null;

  const [phone, setPhone] = useState("");
  const [provider, setProvider] = useState<Provider | null>(null);
  const [category, setCategory] = useState<ProductCategory | "all">(
    initialCat ?? "all"
  );
  const [loading, setLoading] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [purchasing, setPurchasing] = useState(false);

  // Detect provider on phone change
  useEffect(() => {
    if (phone.length >= 4) {
      const detected = detectProvider(phone);
      setProvider(detected);
    } else {
      setProvider(null);
    }
  }, [phone]);

  // Filter products
  const products = useMemo(() => {
    let filtered = mockProducts.filter((p) => p.isActive);

    // For pulsa/data, filter by provider
    if (
      provider &&
      (category === "all" || category === "pulsa" || category === "data")
    ) {
      filtered = filtered.filter(
        (p) =>
          p.providerId === provider.id ||
          p.category === "pln" ||
          p.category === "voucher"
      );
    }

    if (category !== "all") {
      filtered = filtered.filter((p) => p.category === category);
    }

    return filtered;
  }, [provider, category]);

  const handleBuy = useCallback((product: Product) => {
    setSelectedProduct(product);
    setShowConfirm(true);
  }, []);

  const handlePurchase = async () => {
    if (!selectedProduct) return;

    if (
      (selectedProduct.category === "pulsa" ||
        selectedProduct.category === "data") &&
      !isValidPhone(phone)
    ) {
      toast.error("Masukkan nomor HP yang valid");
      return;
    }

    if (selectedProduct.price > mockWallet.balance) {
      toast.error("Saldo tidak cukup. Silakan top up terlebih dahulu.");
      return;
    }

    setPurchasing(true);
    await new Promise((r) => setTimeout(r, 1200));
    setPurchasing(false);
    setShowConfirm(false);
    setShowSuccess(true);
    toast.success("Pembelian berhasil!");
  };

  const destination =
    selectedProduct?.category === "pln"
      ? phone || "Nomor Meter"
      : selectedProduct?.category === "voucher"
      ? "Email"
      : phone;

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 space-y-6 animate-fade-in-up">
      {/* Phone Number Input */}
      <Card className="border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Search className="h-4 w-4 text-primary" />
            Nomor Tujuan
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex gap-3">
            <div className="flex-1">
              <Input
                id="phone-input"
                type="tel"
                placeholder="Masukkan nomor HP / ID Pelanggan"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="h-12 text-base"
              />
            </div>
          </div>

          {/* Provider Detection */}
          {provider && (
            <div className="flex items-center gap-3 p-3 rounded-xl bg-primary/5 border border-primary/10 animate-fade-in-up">
              <ProviderIcon provider={provider} size="sm" />
              <div>
                <p className="text-sm font-semibold">{provider.name}</p>
                <p className="text-xs text-muted-foreground">
                  Provider terdeteksi
                </p>
              </div>
              <CheckCircle2 className="h-5 w-5 text-emerald-400 ml-auto" />
            </div>
          )}

          {phone.length >= 4 && !provider && (
            <div className="flex items-center gap-3 p-3 rounded-xl bg-amber-500/5 border border-amber-500/10">
              <AlertCircle className="h-5 w-5 text-amber-400" />
              <p className="text-sm text-amber-400">
                Provider tidak dikenali. Cek nomor Anda.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Category Tabs */}
      <Tabs
        value={category}
        onValueChange={(v) => setCategory(v as ProductCategory | "all")}
      >
        <TabsList className="w-full h-auto flex-wrap gap-1 bg-transparent p-0">
          {categoryTabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-border/50 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:border-primary text-xs font-medium"
              >
                <Icon className="h-3.5 w-3.5" />
                {tab.label}
              </TabsTrigger>
            );
          })}
        </TabsList>
      </Tabs>

      {/* Products Grid */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-muted-foreground">
            {products.length} Produk Tersedia
          </h2>
        </div>
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="p-4 border-border/50">
                <Skeleton className="h-4 w-3/4 mb-2" />
                <Skeleton className="h-3 w-1/2 mb-3" />
                <Skeleton className="h-3 w-full mb-3" />
                <div className="flex justify-between">
                  <Skeleton className="h-5 w-20" />
                  <Skeleton className="h-8 w-16 rounded-lg" />
                </div>
              </Card>
            ))}
          </div>
        ) : products.length === 0 ? (
          <Card className="p-8 border-border/50 text-center">
            <Package className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">
              {provider
                ? "Tidak ada produk untuk provider ini"
                : "Masukkan nomor untuk melihat produk yang tersedia"}
            </p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onBuy={handleBuy}
              />
            ))}
          </div>
        )}
      </section>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Konfirmasi Pembelian</DialogTitle>
            <DialogDescription>
              Pastikan data sudah benar sebelum melanjutkan
            </DialogDescription>
          </DialogHeader>
          {selectedProduct && (
            <div className="space-y-3 py-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Produk</span>
                <span className="font-semibold">{selectedProduct.name}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Provider</span>
                <span className="font-medium">
                  {selectedProduct.providerName}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Nomor Tujuan</span>
                <span className="font-medium font-mono">{destination}</span>
              </div>
              <div className="border-t pt-3 flex justify-between text-sm">
                <span className="font-semibold">Harga</span>
                <span className="font-bold text-primary">
                  {formatRupiah(selectedProduct.price)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Saldo Anda</span>
                <span
                  className={`font-medium ${
                    mockWallet.balance >= selectedProduct.price
                      ? "text-emerald-400"
                      : "text-red-400"
                  }`}
                >
                  {formatRupiah(mockWallet.balance)}
                </span>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirm(false)}>
              Batal
            </Button>
            <Button onClick={handlePurchase} disabled={purchasing}>
              {purchasing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Memproses...
                </>
              ) : (
                "Beli Sekarang"
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
                Pembelian Berhasil!
              </DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground">
                {selectedProduct?.name} ke {destination}
              </DialogDescription>
            </DialogHeader>
            <Button
              className="w-full mt-2"
              onClick={() => {
                setShowSuccess(false);
                setSelectedProduct(null);
              }}
            >
              Selesai
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
