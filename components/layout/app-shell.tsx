"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { Header } from "./header";
import { BottomNav } from "./bottom-nav";

export function AppShell({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login/");
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 rounded-xl gradient-wallet animate-pulse" />
          <p className="text-sm text-muted-foreground animate-pulse">
            Memuat...
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 pb-20 md:pb-6">{children}</main>
      <BottomNav />
    </div>
  );
}
