export interface ApiResponse {
  data: T[];
  links: any;
  meta: PageMeta
}

export interface PageMeta {
  current_page: number;
  from: number;
  last_page: number;
  path: string;
  per_page: number;
  to: number;
  total: number;
}