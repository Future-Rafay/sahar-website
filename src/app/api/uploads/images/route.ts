import { NextResponse } from "next/server";
import { ZodError } from "zod";

import { requireRole } from "@/server/auth/current-user";
import { createImageUploadUrl } from "@/server/storage/s3";

export async function POST(request: Request) {
  try {
    await requireRole("OWNER");
    const upload = await createImageUploadUrl(await request.json());
    return NextResponse.json({ upload });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: "The image upload details are invalid." }, { status: 400 });
    }
    if (error instanceof Error && error.message === "FORBIDDEN") {
      return NextResponse.json({ error: "Forbidden." }, { status: 403 });
    }

    throw error;
  }
}
