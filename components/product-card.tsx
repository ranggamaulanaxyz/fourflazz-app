"use client";

import { formatRupiah } from "@/lib/format";
import type { Product } from "@/types";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";

interface ProductCardProps {
  product: Product;
  onBuy: (product: Product) => void;
}

export function ProductCard({ product, onBuy }: ProductCardProps) {
  return (
    <Card className="group relative overflow-hidden border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 tap-scale">
      <div className="p-4">
        {/* Top row */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold truncate group-hover:text-primary transition-colors">
              {product.name}
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              {product.providerName}
            </p>
          </div>
          <Badge
            variant="secondary"
            className="text-[10px] uppercase shrink-0"
          >
            {product.category}
          </Badge>
        </div>

        {/* Description */}
        <p className="text-xs text-muted-foreground mb-3 line-clamp-1">
          {product.description}
        </p>

        {/* Price + Buy */}
        <div className="flex items-center justify-between">
          <p className="text-base font-bold text-primary">
            {formatRupiah(product.price)}
          </p>
          <Button
            size="sm"
            onClick={() => onBuy(product)}
            className="h-8 px-3 text-xs gap-1.5 rounded-lg"
          >
            <ShoppingCart className="h-3.5 w-3.5" />
            Beli
          </Button>
        </div>
      </div>
    </Card>
  );
}
