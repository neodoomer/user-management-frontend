import { getToken } from "@/lib/auth";
import { apiRequest, ApiError } from "@/lib/api-client";
import { ListUsersResponse } from "@/lib/types";
import { UsersTable } from "@/components/users-table";
import { Pagination } from "@/components/pagination";

interface DashboardPageProps {
  searchParams: Promise<{ page?: string; limit?: string }>;
}

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  const params = await searchParams;
  const page = Math.max(1, parseInt(params.page || "1", 10));
  const limit = Math.min(100, Math.max(1, parseInt(params.limit || "10", 10)));

  const token = await getToken();

  try {
    const data = await apiRequest<ListUsersResponse>(
      `/api/v1/users?page=${page}&limit=${limit}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      }
    );

    return (
      <div>
        <h2 className="mb-4 text-xl font-semibold">Users</h2>
        <UsersTable users={data.data} />
        <Pagination meta={data.meta} />
      </div>
    );
  } catch (err) {
    if (err instanceof ApiError && err.status === 403) {
      return (
        <div className="flex flex-col items-center justify-center py-16">
          <h2 className="text-xl font-semibold">Access Denied</h2>
          <p className="mt-2 text-muted-foreground">
            You need admin privileges to view this page.
          </p>
        </div>
      );
    }

    return (
      <div className="flex flex-col items-center justify-center py-16">
        <h2 className="text-xl font-semibold text-destructive">Error</h2>
        <p className="mt-2 text-muted-foreground">
          Failed to load users. Please try again later.
        </p>
      </div>
    );
  }
}
