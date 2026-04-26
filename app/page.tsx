"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";

export default function RootPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      router.replace(isAuthenticated ? "/dashboard/" : "/login/");
    }
  }, [isLoading, isAuthenticated, router]);

  return (
    <div className="flex flex-1 items-center justify-center min-h-screen">
      <div className="flex flex-col items-center gap-3">
        <div className="h-12 w-12 rounded-xl gradient-wallet animate-pulse" />
        <p className="text-sm text-muted-foreground">Memuat FourFlazz...</p>
      </div>
    </div>
  );
}
