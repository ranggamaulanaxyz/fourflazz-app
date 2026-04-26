"use client";

import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { mockUser } from "@/lib/mock-data";
import { formatDate } from "@/lib/format";
import { toast } from "sonner";
import {
  UserCircle,
  Mail,
  Phone,
  Calendar,
  Shield,
  LogOut,
  Key,
} from "lucide-react";

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    toast.success("Berhasil keluar");
    router.push("/login/");
  };

  const handleChangePassword = () => {
    toast.info("Fitur ganti password akan segera tersedia");
  };

  const initials =
    user?.name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) ?? "U";

  return (
    <div className="mx-auto max-w-lg px-4 py-6 space-y-6 animate-fade-in-up">
      {/* Header */}
      <div className="text-center">
        <Avatar className="h-20 w-20 mx-auto border-4 border-primary/20 shadow-lg">
          <AvatarFallback className="bg-primary/10 text-primary text-2xl font-bold">
            {initials}
          </AvatarFallback>
        </Avatar>
        <h1 className="text-xl font-bold mt-4">{user?.name}</h1>
        <p className="text-sm text-muted-foreground">{user?.email}</p>
      </div>

      {/* Profile Info */}
      <Card className="border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <UserCircle className="h-4 w-4 text-primary" />
            Informasi Akun
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
              <UserCircle className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-muted-foreground">Nama Lengkap</p>
              <p className="text-sm font-medium">{user?.name}</p>
            </div>
          </div>

          <Separator />

          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
              <Mail className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-muted-foreground">Email</p>
              <p className="text-sm font-medium">{user?.email}</p>
            </div>
          </div>

          <Separator />

          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
              <Phone className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-muted-foreground">Nomor HP</p>
              <p className="text-sm font-medium">{user?.phone ?? mockUser.phone}</p>
            </div>
          </div>

          <Separator />

          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
              <Shield className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-muted-foreground">Role</p>
              <p className="text-sm font-medium capitalize">Customer</p>
            </div>
          </div>

          <Separator />

          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-muted-foreground">Bergabung Sejak</p>
              <p className="text-sm font-medium">
                {formatDate(mockUser.createdAt)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="space-y-3">
        <Button
          variant="outline"
          className="w-full justify-start h-12"
          onClick={handleChangePassword}
        >
          <Key className="mr-3 h-4 w-4" />
          Ganti Password
        </Button>

        <Button
          variant="outline"
          className="w-full justify-start h-12 text-destructive hover:text-destructive border-destructive/20 hover:bg-destructive/5"
          onClick={handleLogout}
        >
          <LogOut className="mr-3 h-4 w-4" />
          Keluar dari Akun
        </Button>
      </div>

      {/* App Info */}
      <div className="text-center pt-4">
        <p className="text-xs text-muted-foreground">
          FourFlazz v1.0.0 — Platform Produk Digital
        </p>
      </div>
    </div>
  );
}
