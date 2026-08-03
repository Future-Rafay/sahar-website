import { adminAction } from "@/app/admin/(protected)/actions";
import { AdminPage, Check, EditLink, Empty, Field, Notice, SaveBar, SelectField } from "@/components/admin/admin-ui";
import { ProductsFilter } from "@/components/admin/products-filter";
import { Card } from "@/components/ui/card";
import { getMenuAdminData } from "@/server/services/admin";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; error?: string }>;
}) {
  const [{ categories, products }, feedback] = await Promise.all([
    getMenuAdminData(),
    searchParams,
  ]);
  const returnTo = "/admin/menu/products";

  return (
    <AdminPage
      title="Menu Products"
      description="Create products here, then manage prices, options, allergens, and availability on each product."
      actions={<EditLink href="/admin/menu/categories">Categories</EditLink>}
    >
      <Notice {...feedback} />

      <ProductsFilter
        products={products.map((p) => ({
          id: p.id,
          nameEn: p.nameEn,
          nameDe: p.nameDe,
          active: p.active,
          available: p.available,
          category: { id: p.categoryId, nameEn: p.category.nameEn },
          variants: p.variants,
          optionGroups: p.optionGroups,
        }))}
        categories={categories.map((c) => ({ id: c.id, nameEn: c.nameEn }))}
      >
        {/* Add Product Form */}
        {categories.length === 0 ? (
          <Empty>Add a category before creating products.</Empty>
        ) : (
          <Card>
            <h2 className="font-display text-xl font-semibold">Add product</h2>
            <form action={adminAction} className="mt-4 space-y-4">
              <input type="hidden" name="intent" value="product" />
              <div className="grid gap-4 sm:grid-cols-2">
                <SelectField label="Category" name="categoryId">
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.nameEn}
                    </option>
                  ))}
                </SelectField>
                <Field label="Slug" name="slug" required />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="German name" name="nameDe" required />
                <Field label="English name" name="nameEn" required />
              </div>
              <Field label="Sort order" name="sortOrder" type="number" min="0" defaultValue="0" required />
              <div className="flex flex-wrap gap-5">
                <Check label="Published" name="active" defaultChecked />
                <Check label="Available" name="available" defaultChecked />
                <Check label="Halal" name="isHalal" />
              </div>
              <input type="hidden" name="spiceLevel" value="" />
              <input type="hidden" name="allergenIds" value="" />
              <SaveBar returnTo={returnTo} label="Add product" />
            </form>
          </Card>
        )}
      </ProductsFilter>
    </AdminPage>
  );
}
