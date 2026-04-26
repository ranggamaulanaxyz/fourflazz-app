import { mockOrders } from "@/lib/mock-data";
import OrderDetailClient from "./order-detail-client";

// Required for static export with dynamic routes
export function generateStaticParams() {
  return mockOrders.map((order) => ({
    id: order.id,
  }));
}

export default function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return <OrderDetailClient params={params} />;
}
