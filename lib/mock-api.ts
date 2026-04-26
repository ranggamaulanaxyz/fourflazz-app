import type {
  User,
  Wallet,
  WalletTransaction,
  Product,
  Order,
  TopUp,
  ProductCategory,
} from "@/types";
import {
  mockUser,
  mockWallet,
  mockWalletTransactions,
  mockProducts,
  mockOrders,
  mockTopUps,
} from "./mock-data";

/**
 * Simulate async API call with a short delay.
 */
function delay(ms: number = 300): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ─── Auth ────────────────────────────────────

export async function apiLogin(
  email: string,
  _password: string
): Promise<User> {
  await delay(500);
  // Mock: accept any credentials
  return { ...mockUser, email };
}

export async function apiRegister(data: {
  name: string;
  email: string;
  phone: string;
}): Promise<User> {
  await delay(500);
  return {
    ...mockUser,
    id: "usr_" + Date.now(),
    name: data.name,
    email: data.email,
    phone: data.phone,
  };
}

export async function apiGetUser(): Promise<User> {
  await delay(200);
  return { ...mockUser };
}

// ─── Wallet ──────────────────────────────────

export async function apiGetWallet(): Promise<Wallet> {
  await delay(200);
  return { ...mockWallet };
}

export async function apiGetWalletTransactions(): Promise<
  WalletTransaction[]
> {
  await delay(300);
  return [...mockWalletTransactions];
}

// ─── Top Up ──────────────────────────────────

export async function apiCreateTopUp(amount: number): Promise<TopUp> {
  await delay(500);
  const topUp: TopUp = {
    id: "top_" + Date.now(),
    userId: mockUser.id,
    amount,
    status: "success",
    paymentMethod: "Mayar — QRIS",
    createdAt: new Date().toISOString(),
    paidAt: new Date().toISOString(),
  };
  return topUp;
}

export async function apiGetTopUpHistory(): Promise<TopUp[]> {
  await delay(300);
  return [...mockTopUps];
}

// ─── Products ────────────────────────────────

export async function apiGetProducts(filters?: {
  providerId?: string;
  category?: ProductCategory;
}): Promise<Product[]> {
  await delay(300);
  let products = mockProducts.filter((p) => p.isActive);

  if (filters?.providerId) {
    products = products.filter((p) => p.providerId === filters.providerId);
  }
  if (filters?.category) {
    products = products.filter((p) => p.category === filters.category);
  }

  return products;
}

// ─── Orders ──────────────────────────────────

export async function apiCreateOrder(
  productId: string,
  destination: string
): Promise<Order> {
  await delay(800);
  const product = mockProducts.find((p) => p.id === productId);
  if (!product) throw new Error("Produk tidak ditemukan");

  const now = new Date().toISOString();
  const order: Order = {
    id: "ord_" + Date.now(),
    userId: mockUser.id,
    productId: product.id,
    productName: product.name,
    category: product.category,
    providerName: product.providerName,
    destination,
    price: product.price,
    status: "success",
    vendorName: "KMSP",
    vendorRef: "KMSP-" + Date.now(),
    serialNumber: "SN" + Date.now(),
    statusLogs: [
      { status: "created", message: "Order dibuat", timestamp: now },
      {
        status: "debited",
        message: `Saldo dipotong Rp ${product.price.toLocaleString("id-ID")}`,
        timestamp: now,
      },
      {
        status: "processing",
        message: "Dikirim ke vendor KMSP",
        timestamp: now,
      },
      {
        status: "success",
        message: "Transaksi berhasil",
        timestamp: now,
      },
    ],
    createdAt: now,
    updatedAt: now,
  };
  return order;
}

export async function apiGetOrders(): Promise<Order[]> {
  await delay(300);
  return [...mockOrders];
}

export async function apiGetOrderById(id: string): Promise<Order | null> {
  await delay(300);
  return mockOrders.find((o) => o.id === id) ?? null;
}
