import { NextResponse } from "next/server";
import { ZodError } from "zod";

import { getEmailEnv } from "@/config/env";
import { OrderError } from "@/server/services/ordering";

export function assertSameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (origin && origin !== new URL(getEmailEnv().APP_URL).origin) throw new OrderError("INVALID_ORIGIN");
}

export function apiError(error: unknown) {
  if (error instanceof ZodError) return NextResponse.json({ error: "INVALID_INPUT", details: error.issues }, { status: 400 });
  if (error instanceof OrderError) {
    const status = error.code.endsWith("NOT_FOUND") ? 404 : error.code === "ORDER_CHANGED" ? 409 : 400;
    return NextResponse.json({ error: error.code }, { status });
  }
  if (error instanceof Error && error.message === "FORBIDDEN") return NextResponse.json({ error: "FORBIDDEN" }, { status: 403 });
  throw error;
}
