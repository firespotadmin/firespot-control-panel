import axiosInstance from "@/security/api-secured";
import type { BackofficeApiResponse } from "@/types/api";
import type {
  ReplyRequest,
  SendEmailRequest,
  SyncResponse,
  TicketDetail,
  TicketListResponse,
} from "@/types/support";

const SUPPORT_BASE = "/api/v1/admin/support";

function assertSuccess<T>(json: BackofficeApiResponse<T>): T | null {
  if (json.code !== "00") {
    throw new Error(json.message ?? "Request failed");
  }
  return json.data ?? null;
}

export async function syncTickets(): Promise<SyncResponse> {
  const res = await axiosInstance.get<BackofficeApiResponse<SyncResponse>>(
    `${SUPPORT_BASE}/tickets/sync`
  );
  const data = assertSuccess(res.data);
  if (!data) throw new Error("No data returned");
  return data;
}

export interface GetTicketsParams {
  page?: number;
  size?: number;
  status?: string;
  search?: string;
}

export async function getTickets(
  params: GetTicketsParams = {}
): Promise<TicketListResponse> {
  const q = new URLSearchParams();
  if (params.page != null) q.set("page", String(params.page));
  if (params.size != null) q.set("size", String(params.size));
  if (params.status) q.set("status", params.status);
  if (params.search) q.set("search", params.search);
  const res = await axiosInstance.get<BackofficeApiResponse<TicketListResponse>>(
    `${SUPPORT_BASE}/tickets?${q.toString()}`
  );
  const data = assertSuccess(res.data);
  if (!data) throw new Error("No data returned");
  return data;
}

export async function getTicketDetail(ticketId: string): Promise<TicketDetail> {
  const res = await axiosInstance.get<BackofficeApiResponse<TicketDetail>>(
    `${SUPPORT_BASE}/tickets/${ticketId}`
  );
  const data = assertSuccess(res.data);
  if (!data) throw new Error("No data returned");
  return data;
}

export async function replyToTicket(
  ticketId: string,
  body: ReplyRequest
): Promise<void> {
  const res = await axiosInstance.post<BackofficeApiResponse<null>>(
    `${SUPPORT_BASE}/tickets/${ticketId}/reply`,
    body
  );
  assertSuccess(res.data);
}

export async function closeTicket(ticketId: string): Promise<void> {
  const res = await axiosInstance.patch<BackofficeApiResponse<null>>(
    `${SUPPORT_BASE}/tickets/${ticketId}/close`
  );
  assertSuccess(res.data);
}

export async function sendEmail(body: SendEmailRequest): Promise<void> {
  const res = await axiosInstance.post<BackofficeApiResponse<null>>(
    `${SUPPORT_BASE}/send-email`,
    body
  );
  assertSuccess(res.data);
}

export async function getUnreadCount(): Promise<number> {
  const res = await axiosInstance.get<BackofficeApiResponse<number>>(
    `${SUPPORT_BASE}/tickets/unread-count`
  );
  const data = assertSuccess(res.data);
  return typeof data === "number" ? data : 0;
}
