import {
  getSupportTickets,
  respondToSupportTicket,
  updateSupportTicketStatus,
} from "@/services/support-service.service";
import type {
  SupportTicketQuery,
  SupportTicketResponsePayload,
  SupportTicketStatusUpdatePayload,
} from "@/types/support";

export const useGetSupportTickets = async (params: SupportTicketQuery) => {
  const response = await getSupportTickets(params);
  return response;
};

export const useUpdateSupportTicketStatus = async ({
  ticketId,
  payload,
}: {
  ticketId: string;
  payload: SupportTicketStatusUpdatePayload;
}) => {
  const response = await updateSupportTicketStatus({ ticketId, payload });
  return response;
};

export const useRespondToSupportTicket = async ({
  ticketId,
  payload,
}: {
  ticketId: string;
  payload: SupportTicketResponsePayload;
}) => {
  const response = await respondToSupportTicket({ ticketId, payload });
  return response;
};
