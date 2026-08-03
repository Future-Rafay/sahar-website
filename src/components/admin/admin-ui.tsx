import Link from "next/link";
import { useId, type ComponentProps, type ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/cn";

export function AdminPage({ title, description, children, actions }: { title: string; description?: string; children: ReactNode; actions?: ReactNode }) {
  return <div className="mx-auto max-w-7xl px-4 py-8"><div className="flex flex-wrap items-end justify-between gap-4"><div><h1 className="font-display text-3xl font-bold">{title}</h1>{description && <p className="mt-1 text-sm text-muted">{description}</p>}</div>{actions}</div><div className="mt-7">{children}</div></div>;
}

export function Notice({ saved, error }: { saved?: string; error?: string }) {
  if (!saved && !error) return null;
  return <p role={error ? "alert" : "status"} className={cn("mb-5 rounded-xl border p-3 text-sm", error ? "border-destructive text-destructive" : "border-success text-success")}>{error ? error.replaceAll("_", " ") : "Changes saved."}</p>;
}

export function Field({ label, name, className, ...props }: { label: string; name: string } & ComponentProps<typeof Input>) {
  const generatedId = useId();
  const inputId = props.id ?? `${name}-${generatedId}`;
  return <div className={className}><Label htmlFor={inputId}>{label}</Label><Input {...props} id={inputId} name={name} className="mt-1" /></div>;
}

export function TextareaField({ label, name, defaultValue, rows = 3, id }: { label: string; name: string; defaultValue?: string | null; rows?: number; id?: string }) {
  const generatedId = useId();
  const inputId = id ?? `${name}-${generatedId}`;
  return <div><Label htmlFor={inputId}>{label}</Label><textarea id={inputId} name={name} defaultValue={defaultValue ?? ""} rows={rows} className="mt-1 min-h-11 w-full rounded-[var(--radius-control)] border bg-surface px-3 py-2 text-sm" /></div>;
}

export function SelectField({ label, name, defaultValue, children, id }: { label: string; name: string; defaultValue?: string; children: ReactNode; id?: string }) {
  const generatedId = useId();
  const inputId = id ?? `${name}-${generatedId}`;
  return <div><Label htmlFor={inputId}>{label}</Label><select id={inputId} name={name} defaultValue={defaultValue} className="mt-1 min-h-11 w-full rounded-[var(--radius-control)] border bg-surface px-3 py-2 text-sm">{children}</select></div>;
}

export function Check({ label, name, defaultChecked = false }: { label: string; name: string; defaultChecked?: boolean }) {
  return <label className="flex min-h-11 items-center gap-2 text-sm font-medium"><input type="checkbox" name={name} defaultChecked={defaultChecked} className="size-5 accent-primary" />{label}</label>;
}

export function SaveBar({ returnTo, label = "Save changes" }: { returnTo: string; label?: string }) {
  return <div className="flex justify-end border-t pt-4"><input type="hidden" name="returnTo" value={returnTo} /><Button type="submit">{label}</Button></div>;
}

export function Empty({ children }: { children: ReactNode }) { return <Card><p className="text-sm text-muted">{children}</p></Card>; }

export function EditLink({ href, children = "Manage" }: { href: string; children?: ReactNode }) { return <Link href={href} className="inline-flex min-h-11 items-center rounded-[var(--radius-control)] border bg-surface px-4 text-sm font-semibold hover:bg-background">{children}</Link>; }

