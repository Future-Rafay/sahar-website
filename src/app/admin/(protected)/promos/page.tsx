import { adminAction } from "@/app/admin/(protected)/actions";
import { AdminPage, Check, Field, Notice, SaveBar, SelectField } from "@/components/admin/admin-ui";
import { Card } from "@/components/ui/card";
import { getPromosAdminData } from "@/server/services/admin";

export default async function PromosPage({ searchParams }: { searchParams: Promise<{ saved?: string; error?: string }> }) {
  const [promos, feedback] = await Promise.all([getPromosAdminData(), searchParams]);
  const returnTo = "/admin/promos";
  return <AdminPage title="Promo codes" description="Fixed or percentage discounts applied to item subtotal only."><Notice {...feedback} /><Card><h2 className="font-display text-xl font-semibold">Add promo</h2><PromoForm returnTo={returnTo} /></Card><div className="mt-5 space-y-5">{promos.map((promo) => <Card key={promo.id}><div className="mb-4 flex items-center justify-between gap-4"><h2 className="font-display text-xl font-semibold">{promo.code}</h2><span className="text-sm text-muted">{promo._count.redemptions} redemptions</span></div><PromoForm returnTo={returnTo} promo={promo} /></Card>)}</div></AdminPage>;
}

function PromoForm({ returnTo, promo }: { returnTo: string; promo?: Awaited<ReturnType<typeof getPromosAdminData>>[number] }) {
  const prefix = promo?.id ?? "new-promo";
  return <form action={adminAction} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"><input type="hidden" name="intent" value="promo" />{promo && <input type="hidden" name="id" value={promo.id} />}<Field id={`${prefix}-code`} label="Code" name="code" defaultValue={promo?.code ?? ""} required /><SelectField label="Type" name="type" defaultValue={promo?.type ?? "FIXED"}><option value="FIXED">Fixed rappen</option><option value="PERCENT">Percentage basis points</option></SelectField><Field id={`${prefix}-value`} label="Value" name="value" type="number" min="1" defaultValue={promo?.value ?? ""} required /><Field id={`${prefix}-minimum`} label="Minimum subtotal" name="minimumSubtotalRappen" type="number" min="0" defaultValue={promo?.minimumSubtotalRappen ?? 0} required /><Field id={`${prefix}-start`} label="Starts at (ISO/UTC, optional)" name="startsAt" defaultValue={promo?.startsAt?.toISOString() ?? ""} /><Field id={`${prefix}-end`} label="Ends at (ISO/UTC, optional)" name="endsAt" defaultValue={promo?.endsAt?.toISOString() ?? ""} /><Field id={`${prefix}-total`} label="Total use limit" name="totalUsageLimit" type="number" min="1" defaultValue={promo?.totalUsageLimit ?? ""} /><Field id={`${prefix}-customer`} label="Per-customer limit" name="perCustomerLimit" type="number" min="1" defaultValue={promo?.perCustomerLimit ?? ""} /><Check label="Active" name="active" defaultChecked={promo?.active ?? true} /><div className="sm:col-span-2 lg:col-span-4"><SaveBar returnTo={returnTo} label={promo ? "Save promo" : "Add promo"} /></div></form>;
}
