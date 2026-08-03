"use client";

import { useState } from "react";

import { adminAction } from "@/app/admin/(protected)/actions";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function DeleteDialog({ intent, id, kind, returnTo, label = "Delete", description = "This removes the item from future use. Existing order history is preserved." }: { intent: string; id: string; kind?: string; returnTo: string; label?: string; description?: string }) {
  return <Dialog><DialogTrigger asChild><Button variant="destructive">{label}</Button></DialogTrigger><DialogContent><DialogTitle>Confirm {label.toLowerCase()}</DialogTitle><DialogDescription>{description}</DialogDescription><form action={adminAction} className="mt-6"><input type="hidden" name="intent" value={intent} /><input type="hidden" name="id" value={id} />{kind && <input type="hidden" name="kind" value={kind} />}<input type="hidden" name="returnTo" value={returnTo} /><div className="flex flex-wrap justify-end gap-3"><DialogClose asChild><Button variant="outline">Keep it</Button></DialogClose><Button type="submit" variant="destructive">Confirm {label.toLowerCase()}</Button></div></form></DialogContent></Dialog>;
}

export function CancelOrderDialog({ orderNumber, returnTo }: { orderNumber: string; returnTo: string }) {
  return <Dialog><DialogTrigger asChild><Button variant="destructive">Cancel order</Button></DialogTrigger><DialogContent><DialogTitle>Cancel {orderNumber}</DialogTitle><DialogDescription>This action is separate from routine status controls. Paid Stripe orders require the owner refund flow.</DialogDescription><form action={adminAction} className="mt-6 space-y-5"><input type="hidden" name="intent" value="cancel_order" /><input type="hidden" name="orderNumber" value={orderNumber} /><input type="hidden" name="returnTo" value={returnTo} /><div><Label htmlFor={`cancel-reason-${orderNumber}`}>Reason</Label><Input id={`cancel-reason-${orderNumber}`} name="reason" minLength={3} maxLength={500} required className="mt-1" /></div><div className="flex flex-wrap justify-end gap-3"><DialogClose asChild><Button variant="outline">Keep order</Button></DialogClose><Button type="submit" variant="destructive">Confirm cancellation</Button></div></form></DialogContent></Dialog>;
}

export function RefundDialog({ orderNumber, remainingRappen, refundKey, returnTo }: { orderNumber: string; remainingRappen: number; refundKey: string; returnTo: string }) {
  const [amountRappen, setAmountRappen] = useState(remainingRappen);
  const maximum = (remainingRappen / 100).toFixed(2);
  const exact = (Math.max(0, amountRappen) / 100).toFixed(2);
  return <Dialog><DialogTrigger asChild><Button variant="destructive">Refund</Button></DialogTrigger><DialogContent><DialogTitle>Refund {orderNumber}</DialogTitle><DialogDescription>The maximum refundable amount is CHF {maximum}. Enter the exact amount and a reason. Cancelling requires the full remaining refund.</DialogDescription><form action={adminAction} className="mt-6 space-y-5"><input type="hidden" name="intent" value="refund" /><input type="hidden" name="orderNumber" value={orderNumber} /><input type="hidden" name="refundKey" value={refundKey} /><input type="hidden" name="returnTo" value={returnTo} /><div><Label htmlFor={`refund-amount-${orderNumber}`}>Amount in rappen</Label><Input id={`refund-amount-${orderNumber}`} name="amountRappen" type="number" min={1} max={remainingRappen} value={amountRappen} onChange={(event) => setAmountRappen(event.currentTarget.valueAsNumber || 0)} required className="mt-1" /><p className="mt-1 text-xs text-muted">{amountRappen} rappen = CHF {exact}</p></div><div><Label htmlFor={`refund-reason-${orderNumber}`}>Reason</Label><Input id={`refund-reason-${orderNumber}`} name="reason" minLength={3} maxLength={500} required className="mt-1" /></div><label className="flex min-h-11 items-center gap-2 text-sm font-medium"><input type="checkbox" name="cancelOrder" className="size-5 accent-destructive" />Cancel the order after the full refund is accepted</label><div className="flex flex-wrap justify-end gap-3 border-t pt-4"><DialogClose asChild><Button variant="outline">Do not refund</Button></DialogClose><Button type="submit" variant="destructive" disabled={amountRappen < 1 || amountRappen > remainingRappen}>Confirm refund of CHF {exact}</Button></div></form></DialogContent></Dialog>;
}
