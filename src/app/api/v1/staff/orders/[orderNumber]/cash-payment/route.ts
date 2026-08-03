import { requireRole } from "@/server/auth/current-user";
import { apiError, assertSameOrigin } from "@/server/http";
import { confirmCashPayment } from "@/server/services/ordering";

export async function PATCH(request: Request, { params }: { params: Promise<{ orderNumber: string }> }) {
  try {
    assertSameOrigin(request);
    const user = await requireRole("OWNER", "STAFF");
    return Response.json(await confirmCashPayment((await params).orderNumber, user.id));
  } catch (error) {
    return apiError(error);
  }
}
