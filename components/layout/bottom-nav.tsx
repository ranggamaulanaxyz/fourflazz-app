"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, ShoppingCart, ClipboardList, UserCircle } from "lucide-react";

const tabs = [
  { href: "/dashboard/", label: "Beranda", icon: Home },
  { href: "/purchase/", label: "Beli", icon: ShoppingCart },
  { href: "/orders/", label: "Riwayat", icon: ClipboardList },
  { href: "/profile/", label: "Akun", icon: UserCircle },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden glass border-t border-border/50">
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto">
        {tabs.map((tab) => {
          const isActive = pathname.startsWith(tab.href.replace(/\/$/, ""));
          const Icon = tab.icon;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg transition-all tap-scale ${
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <div className="relative">
                <Icon
                  className={`h-5 w-5 transition-transform ${
                    isActive ? "scale-110" : ""
                  }`}
                />
                {isActive && (
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 h-0.5 w-4 rounded-full bg-primary" />
                )}
              </div>
              <span className="text-[10px] font-medium">{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
