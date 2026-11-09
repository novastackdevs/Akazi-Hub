/** Shared, framework-agnostic contracts and utilities for Akazi Hub. */

export const API_VERSION = 'v1' as const;

export type ApiError = {
  code: string;
  message: string;
  requestId?: string;
};

export type Paginated<T> = {
  items: T[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
};
