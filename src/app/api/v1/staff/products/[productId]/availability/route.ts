import { z } from "zod";

import { requireRole } from "@/server/auth/current-user";
import { apiError, assertSameOrigin } from "@/server/http";
import { setProductAvailability } from "@/server/services/ordering";

export async function PATCH(request: Request, { params }: { params: Promise<{ productId: string }> }) {
  try {
    assertSameOrigin(request);
    const user = await requireRole("OWNER", "STAFF");
    const { available } = z.object({ available: z.boolean() }).parse(await request.json());
    return Response.json(await setProductAvailability((await params).productId, available, user.id));
  } catch (error) {
    return apiError(error);
  }
}
