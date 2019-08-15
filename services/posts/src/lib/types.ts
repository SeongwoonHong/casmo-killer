export interface ErrorData {
  message: string;
  success?: boolean;
}

export interface ErrorWithStatus extends Error {
  status?: number;
}

export interface QueryParamsObject {
  exclude_fields: string[];
  search_field: string;
  search_values: string[];
  return_fields: string[];
}
