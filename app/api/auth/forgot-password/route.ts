import { NextRequest, NextResponse } from "next/server";
import { apiRequest, ApiError } from "@/lib/api-client";
import { MessageResponse } from "@/lib/types";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    await apiRequest<MessageResponse>("/api/v1/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify(body),
    });
    return NextResponse.json({
      message:
        "If an account exists with that email, you will receive reset instructions.",
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
