import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { apiRequest, ApiError } from "@/lib/api-client";
import { AuthResponse } from "@/lib/types";

const COOKIE_NAME = "token";
const COOKIE_MAX_AGE = 15 * 60;

function isCookieSecure() {
  return process.env.COOKIE_SECURE === "true";
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const data = await apiRequest<AuthResponse>("/api/v1/auth/signup", {
      method: "POST",
      body: JSON.stringify(body),
    });

    const cookieStore = await cookies();
    cookieStore.set(COOKIE_NAME, data.token, {
      httpOnly: true,
      secure: isCookieSecure(),
      sameSite: "lax",
      path: "/",
      maxAge: COOKIE_MAX_AGE,
    });

    return NextResponse.json({ user: data.user });
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
