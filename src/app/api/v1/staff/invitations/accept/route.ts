import { NextResponse } from "next/server";
import { ZodError } from "zod";

import { acceptStaffInvitation } from "@/server/services/staff-invitations";

export async function POST(request: Request) {
  try {
    const user = await acceptStaffInvitation(await request.json());
    return NextResponse.json({ user });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: "The invitation details are invalid." }, { status: 400 });
    }
    if (error instanceof Error && error.message === "INVALID_OR_EXPIRED_INVITATION") {
      return NextResponse.json({ error: "This invitation is invalid or expired." }, { status: 410 });
    }

    throw error;
  }
}
