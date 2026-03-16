import { cookies } from "next/headers";

const COOKIE_NAME = "token";

export async function getToken(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get(COOKIE_NAME)?.value;
}

export function parseJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const payload = Buffer.from(parts[1], "base64url").toString("utf-8");
    return JSON.parse(payload);
  } catch {
    return null;
  }
}

export async function getSessionUser() {
  const token = await getToken();
  if (!token) return null;

  const payload = parseJwtPayload(token);
  if (!payload) return null;

  const exp = payload.exp as number | undefined;
  if (exp && Date.now() >= exp * 1000) return null;

  return {
    id: payload.sub as string,
    role: payload.role as string,
  };
}
