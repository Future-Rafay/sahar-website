import { requireRole } from "@/server/auth/current-user";
import { apiError, assertSameOrigin } from "@/server/http";
import { AdminError, cancelOrder } from "@/server/services/admin";
import { cancelOrderSchema } from "@/server/validators/admin";

export async function POST(request: Request, { params }: { params: Promise<{ orderNumber: string }> }) {
  try {
    assertSameOrigin(request);
    const actor = await requireRole("OWNER", "STAFF");
    const orderNumber = (await params).orderNumber;
    const { reason } = cancelOrderSchema.parse({ ...(await request.json()), orderNumber });
    await cancelOrder(actor.id, orderNumber, reason);
    return Response.json({ status: "CANCELLED" });
  } catch (error) {
    if (error instanceof AdminError) return Response.json({ error: error.code }, { status: error.code === "ORDER_NOT_FOUND" ? 404 : 400 });
    return apiError(error);
  }
}
