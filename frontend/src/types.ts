// Setting type
export interface Setting {
  id: string;
  data: Record<string, any>;
  created_at: string;
  updated_at: string;
}
// Added pagination type
export interface PaginationInfo {
  total: number;
  limit: number;
  offset: number;
}

// Added Response page type with Setting and PaginationInfo
export interface SettingsResponse {
  setting_list: Setting[];
  pagination: PaginationInfo;
}