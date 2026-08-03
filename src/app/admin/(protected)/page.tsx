import { AdminQueue } from "@/components/admin/admin-queue";
import { getPublicMenu } from "@/server/services/catalog";
import { getAdminOrders } from "@/server/services/ordering";

export default async function AdminPage() {
  const [orders, categories] = await Promise.all([getAdminOrders(), getPublicMenu("EN")]);
  const products = categories.flatMap((category) =>
    category.products.map((product) => ({ id: product.id, name: product.name, available: product.available })),
  );
  return <AdminQueue orders={orders} products={products} />;
}
