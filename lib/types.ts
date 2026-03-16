export interface User {
  id: string;
  email: string;
  username: string;
  role: string;
  created_at: string;
  updated_at: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface ListUsersResponse {
  data: User[];
  meta: PaginationMeta;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
}

export interface MessageResponse {
  message: string;
}

export interface ErrorResponse {
  error: string;
  details?: string[];
}
