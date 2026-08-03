import { adminAction } from "@/app/admin/(protected)/actions";
import { AdminPage, Empty, Notice } from "@/components/admin/admin-ui";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getMenuAdminData } from "@/server/services/admin";

export default async function AvailabilityPage({ searchParams }: { searchParams: Promise<{ saved?: string; error?: string }> }) {
  const [{ products }, feedback] = await Promise.all([getMenuAdminData(), searchParams]);
  const returnTo = "/admin/availability";
  return <AdminPage title="Product availability" description="Fast sold-out controls for owner and staff."><Notice {...feedback} />{products.length === 0 ? <Empty>No products.</Empty> : <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{products.map((product) => <Card key={product.id} className="flex items-center gap-3"><div><h2 className="font-semibold">{product.nameEn}</h2><p className={`text-sm ${product.available ? "text-success" : "text-destructive"}`}>{product.available ? "Available" : "Sold out"}</p></div><form action={adminAction} className="ml-auto"><input type="hidden" name="intent" value="product_availability" /><input type="hidden" name="id" value={product.id} /><input type="hidden" name="available" value={String(!product.available)} /><input type="hidden" name="returnTo" value={returnTo} /><Button type="submit" variant={product.available ? "outline" : "secondary"}>{product.available ? "Mark sold out" : "Mark available"}</Button></form></Card>)}</div>}</AdminPage>;
}
