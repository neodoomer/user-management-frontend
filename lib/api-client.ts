import { ErrorResponse } from "./types";

const API_URL = process.env.API_URL || "http://localhost";

export class ApiError extends Error {
  status: number;
  details?: string[];

  constructor(status: number, message: string, details?: string[]) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

export async function apiRequest<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_URL}${path}`;

  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!res.ok) {
    const body: ErrorResponse = await res.json().catch(() => ({
      error: "An unexpected error occurred",
    }));
    throw new ApiError(res.status, body.error, body.details);
  }

  return res.json() as Promise<T>;
}
