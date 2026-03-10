/**
 * Standard API response wrapper from the backend.
 * - code "00" = success; use `data` for the payload.
 * - On non-success, show `message` (and optionally `code`) to the user.
 */
export interface BackofficeApiResponse<T> {
  code: string;
  message: string;
  data: T | null;
  meta?: unknown;
}

export const API_CODE_SUCCESS = "00";

export function isSuccessResponse<T>(
  res: BackofficeApiResponse<T>
): res is BackofficeApiResponse<T> & { code: "00"; data: T } {
  return res.code === API_CODE_SUCCESS && res.data != null;
}
