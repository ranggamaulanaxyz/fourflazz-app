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

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { register, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace("/dashboard/");
    }
  }, [isLoading, isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !email || !phone || !password) {
      toast.error("Lengkapi semua data");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Password tidak cocok");
      return;
    }
    if (password.length < 6) {
      toast.error("Password minimal 6 karakter");
      return;
    }

    setLoading(true);
    try {
      await register({ name, email, phone, password });
      toast.success("Registrasi berhasil! Selamat datang.");
      router.push("/dashboard/");
    } catch {
      toast.error("Registrasi gagal. Coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-border/30 shadow-2xl shadow-primary/5 bg-card/80 backdrop-blur-xl">
      <CardHeader className="text-center pb-4">
        <div className="flex justify-center mb-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl gradient-wallet text-white shadow-lg glow-primary">
            <Zap className="h-7 w-7" />
          </div>
        </div>
        <CardTitle className="text-2xl font-bold">Daftar FourFlazz</CardTitle>
        <CardDescription>
          Buat akun baru dan mulai transaksi digital
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} id="register-form">
          <div className="grid gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="name">Nama Lengkap</Label>
              <Input
                id="name"
                type="text"
                placeholder="Nama Anda"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
                className="h-11"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="reg-email">Email</Label>
              <Input
                id="reg-email"
                type="email"
                placeholder="nama@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                className="h-11"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="reg-phone">Nomor HP</Label>
              <Input
                id="reg-phone"
                type="tel"
                placeholder="08xxxxxxxxxx"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                autoComplete="tel"
                className="h-11"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="reg-password">Password</Label>
              <Input
                id="reg-password"
                type="password"
                placeholder="Minimal 6 karakter"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
                className="h-11"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="confirm-password">Konfirmasi Password</Label>
              <Input
                id="confirm-password"
                type="password"
                placeholder="Ulangi password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                autoComplete="new-password"
                className="h-11"
              />
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex-col gap-3 pt-0">
        <Button
          type="submit"
          form="register-form"
          className="w-full h-11 text-sm font-semibold"
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Mendaftar...
            </>
          ) : (
            "Daftar"
          )}
        </Button>
        <p className="text-sm text-muted-foreground">
          Sudah punya akun?{" "}
          <Link
            href="/login/"
            className="text-primary hover:underline font-medium"
          >
            Masuk di sini
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
