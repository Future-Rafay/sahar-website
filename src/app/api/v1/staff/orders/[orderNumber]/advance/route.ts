import { z } from "zod";

import { requireRole } from "@/server/auth/current-user";
import { apiError, assertSameOrigin } from "@/server/http";
import { advanceOrder } from "@/server/services/ordering";

export async function PATCH(request: Request, { params }: { params: Promise<{ orderNumber: string }> }) {
  try {
    assertSameOrigin(request);
    const user = await requireRole("OWNER", "STAFF");
    const { version } = z.object({ version: z.number().int().min(0) }).parse(await request.json());
    return Response.json(await advanceOrder((await params).orderNumber, version, user.id));
  } catch (error) {
    return apiError(error);
  }
}
