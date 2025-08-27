// src/types/api.ts
export interface PaginatedResponse<T> {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from?: number;
  to?: number;
  links?: {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
  };
}

export interface ApiSuccessResponse<T> {
  status: boolean;
  message: string;
  data: T;
}

export interface ApiErrorResponse {
  status: boolean;
  message: string;
  errors?: Record<string, string[]>;
}

export interface LoginResponse {
  token: {
    token: string;
    refreshToken?: string;
    expiresAt?: string;
  };
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    permissions?: string[];
  };
}

export interface RefreshTokenResponse {
  token: string;
  refreshToken?: string;
  expiresAt?: string;
}