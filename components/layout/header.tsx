"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { formatRupiah } from "@/lib/format";
import { mockWallet } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import {
  Wallet,
  Menu,
  LogOut,
  User,
  Zap,
} from "lucide-react";
import { useState } from "react";

const navLinks = [
  { href: "/dashboard/", label: "Beranda" },
  { href: "/purchase/", label: "Beli" },
  { href: "/orders/", label: "Riwayat" },
  { href: "/transactions/", label: "Mutasi" },
];

export function Header() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [sheetOpen, setSheetOpen] = useState(false);

  const initials = user?.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) ?? "U";

  return (
    <header className="sticky top-0 z-50 glass border-b border-border/50">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
        {/* Logo */}
        <Link href="/dashboard/" className="flex items-center gap-2 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl gradient-wallet text-white shadow-lg group-hover:glow-primary transition-shadow">
            <Zap className="h-5 w-5" />
          </div>
          <span className="text-lg font-bold gradient-text hidden sm:block">
            FourFlazz
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = pathname.startsWith(link.href.replace(/\/$/, ""));
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {/* Wallet Badge */}
          <Link
            href="/topup/"
            className="flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1.5 text-sm font-semibold text-primary hover:bg-primary/15 transition-colors"
          >
            <Wallet className="h-4 w-4" />
            <span>{formatRupiah(mockWallet.balance)}</span>
            <span className="h-2 w-2 rounded-full bg-emerald-400 pulse-dot" />
          </Link>

          {/* User Menu (Desktop) */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild className="hidden md:flex">
              <Button
                variant="ghost"
                className="relative h-9 w-9 rounded-full"
              >
                <Avatar className="h-9 w-9 border-2 border-primary/30">
                  <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
                    {initials}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="px-2 py-1.5">
                <p className="text-sm font-medium">{user?.name}</p>
                <p className="text-xs text-muted-foreground">{user?.email}</p>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/profile/" className="cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  Profil
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={logout}
                className="text-destructive cursor-pointer"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Keluar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Mobile Menu */}
          <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <SheetHeader className="sr-only">
                <SheetTitle>Menu Navigasi</SheetTitle>
                <SheetDescription>
                  Akses cepat ke berbagai layanan FourFlazz
                </SheetDescription>
              </SheetHeader>
              <div className="flex flex-col gap-6 pt-6">
                {/* User Info */}
                <div className="flex items-center gap-3 px-2">
                  <Avatar className="h-10 w-10 border-2 border-primary/30">
                    <AvatarFallback className="bg-primary/10 text-primary text-sm font-bold">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{user?.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {user?.email}
                    </p>
                  </div>
                </div>

                {/* Nav Links */}
                <nav className="flex flex-col gap-1">
                  {navLinks.map((link) => {
                    const isActive = pathname.startsWith(
                      link.href.replace(/\/$/, "")
                    );
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setSheetOpen(false)}
                        className={`px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                          isActive
                            ? "bg-primary/10 text-primary"
                            : "text-muted-foreground hover:text-foreground hover:bg-accent"
                        }`}
                      >
                        {link.label}
                      </Link>
                    );
                  })}
                  <Link
                    href="/profile/"
                    onClick={() => setSheetOpen(false)}
                    className="px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent"
                  >
                    Profil
                  </Link>
                </nav>

                <div className="border-t pt-4">
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-destructive"
                    onClick={() => {
                      logout();
                      setSheetOpen(false);
                    }}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Keluar
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
