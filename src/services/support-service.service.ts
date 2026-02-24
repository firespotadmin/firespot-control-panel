import axiosInstance from "@/security/api-secured";
import type {
  SupportTicketQuery,
  SupportTicketResponsePayload,
  SupportTicketStatusUpdatePayload,
} from "@/types/support";

export const getSupportTickets = async ({
  page,
  size,
  search = "",
  status = "",
}: SupportTicketQuery) => {
  try {
    const params = new URLSearchParams();
    params.append("page", String(page));
    params.append("size", String(size));
    if (search) params.append("search", search);
    if (status) params.append("status", status);

    const response = await axiosInstance.get(`/api/v1/admin/support?${params.toString()}`);
    return response.data;
  } catch (error: any) {
    return error?.response?.data || error?.response || error;
  }
};

export const updateSupportTicketStatus = async ({
  ticketId,
  payload,
}: {
  ticketId: string;
  payload: SupportTicketStatusUpdatePayload;
}) => {
  try {
    const response = await axiosInstance.patch(`/api/v1/admin/support/${ticketId}/status`, payload);
    return response.data;
  } catch (error: any) {
    return error?.response?.data || error?.response || error;
  }
};

export const respondToSupportTicket = async ({
  ticketId,
  payload,
}: {
  ticketId: string;
  payload: SupportTicketResponsePayload;
}) => {
  try {
    const response = await axiosInstance.post(`/api/v1/admin/support/${ticketId}/respond`, payload);
    return response.data;
  } catch (error: any) {
    return error?.response?.data || error?.response || error;
  }
};
