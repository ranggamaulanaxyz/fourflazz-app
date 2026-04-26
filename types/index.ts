// ─── User & Auth ─────────────────────────────
export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: "customer";
  createdAt: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  phone: string;
  password: string;
  passwordConfirmation: string;
}

// ─── Wallet ──────────────────────────────────
export interface Wallet {
  id: string;
  userId: string;
  balance: number;
}

export type WalletTransactionType =
  | "topup"
  | "debit"
  | "refund"
  | "adjustment";

export interface WalletTransaction {
  id: string;
  walletId: string;
  type: WalletTransactionType;
  amount: number;
  balanceAfter: number;
  description: string;
  referenceId?: string;
  referenceType?: "order" | "topup" | "refund";
  createdAt: string;
}

// ─── Provider ────────────────────────────────
export interface Provider {
  id: string;
  name: string;
  code: string;
  prefixes: string[];
  color: string;
  icon: string;
}

// ─── Product ─────────────────────────────────
export type ProductCategory = "pulsa" | "data" | "pln" | "voucher";

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  providerId: string;
  providerName: string;
  price: number;
  basePrice: number;
  description: string;
  isActive: boolean;
}

// ─── Order ───────────────────────────────────
export type OrderStatus =
  | "created"
  | "debited"
  | "processing"
  | "pending_vendor"
  | "manual_processing"
  | "success"
  | "failed"
  | "refunded";

export interface Order {
  id: string;
  userId: string;
  productId: string;
  productName: string;
  category: ProductCategory;
  providerName: string;
  destination: string;
  price: number;
  status: OrderStatus;
  vendorName?: string;
  vendorRef?: string;
  serialNumber?: string;
  statusLogs: OrderStatusLog[];
  refundId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderStatusLog {
  status: OrderStatus;
  message: string;
  timestamp: string;
}

// ─── Top Up ──────────────────────────────────
export type TopUpStatus = "pending" | "success" | "failed" | "expired";

export interface TopUp {
  id: string;
  userId: string;
  amount: number;
  status: TopUpStatus;
  paymentMethod: string;
  paymentUrl?: string;
  createdAt: string;
  paidAt?: string;
}
