import Link from "next/link";
import type { ReactNode } from "react";

import { requireRole } from "@/server/auth/current-user";

export default async function AdminTemplate({ children }: { children: ReactNode }) {
  const user = await requireRole("OWNER", "STAFF");
  const ownerLinks = user.role === "OWNER" ? [
    ["Menu", "/admin/menu/products"], ["Hours", "/admin/settings/hours"], ["Zones", "/admin/settings/delivery-zones"],
    ["Promos", "/admin/promos"], ["Staff", "/admin/staff"], ["Settings", "/admin/settings/general"], ["Audit", "/admin/audit"],
  ] : [];
  return <><header className="border-b bg-surface"><div className="mx-auto flex max-w-7xl items-center gap-2 overflow-x-auto px-4 py-3"><Link href="/admin" className="mr-3 shrink-0 font-display text-lg font-bold text-primary">Sahar Admin</Link><nav aria-label="Admin"><ul className="flex items-center gap-1"><li><Link className="inline-flex min-h-11 items-center rounded-lg px-3 text-sm font-semibold hover:bg-background" href="/admin">Queue</Link></li><li><Link className="inline-flex min-h-11 items-center rounded-lg px-3 text-sm font-semibold hover:bg-background" href="/admin/orders">Orders</Link></li><li><Link className="inline-flex min-h-11 items-center rounded-lg px-3 text-sm font-semibold hover:bg-background" href="/admin/availability">Availability</Link></li>{ownerLinks.map(([label, href]) => <li key={href}><Link className="inline-flex min-h-11 items-center rounded-lg px-3 text-sm font-semibold hover:bg-background" href={href}>{label}</Link></li>)}</ul></nav></div></header>{children}</>;
}
