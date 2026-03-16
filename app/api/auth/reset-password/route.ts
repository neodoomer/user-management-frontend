import { NextRequest, NextResponse } from "next/server";
import { apiRequest, ApiError } from "@/lib/api-client";
import { MessageResponse } from "@/lib/types";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    await apiRequest<MessageResponse>("/api/v1/auth/reset-password", {
      method: "POST",
      body: JSON.stringify(body),
    });
    return NextResponse.json({
      message: "Your password has been reset. You can sign in with your new password.",
    });
  } catch (err) {
    if (err instanceof ApiError) {
      return NextResponse.json(
        { error: err.message, details: err.details },
        { status: err.status }
      );
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
