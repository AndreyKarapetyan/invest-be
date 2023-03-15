export interface PaginatedResponse<T> {
  count: number;
  take: number;
  skip: number;
  data: T[];
}