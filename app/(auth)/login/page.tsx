"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Zap, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace("/dashboard/");
    }
  }, [isLoading, isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Masukkan email dan password");
      return;
    }
    setLoading(true);
    try {
      await login(email, password);
      toast.success("Login berhasil! Selamat datang.");
      router.push("/dashboard/");
    } catch {
      toast.error("Login gagal. Coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-border/30 shadow-2xl shadow-primary/5 bg-card/80 backdrop-blur-xl">
      <CardHeader className="text-center pb-4">
        {/* Logo */}
        <div className="flex justify-center mb-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl gradient-wallet text-white shadow-lg glow-primary">
            <Zap className="h-7 w-7" />
          </div>
        </div>
        <CardTitle className="text-2xl font-bold">Masuk ke FourFlazz</CardTitle>
        <CardDescription>
          Beli pulsa, data & produk digital dengan mudah
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} id="login-form">
          <div className="grid gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="nama@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                className="h-11"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Masukkan password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                className="h-11"
              />
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex-col gap-3 pt-0">
        <Button
          type="submit"
          form="login-form"
          className="w-full h-11 text-sm font-semibold"
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Masuk...
            </>
          ) : (
            "Masuk"
          )}
        </Button>
        <p className="text-sm text-muted-foreground">
          Belum punya akun?{" "}
          <Link
            href="/register/"
            className="text-primary hover:underline font-medium"
          >
            Daftar sekarang
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
