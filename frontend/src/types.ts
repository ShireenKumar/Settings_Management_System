export interface Setting {
  uid: string;
  data: any;
  created_at: string;
  updated_at: string;
}

export interface PaginatedResponse {
  data: Setting[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
