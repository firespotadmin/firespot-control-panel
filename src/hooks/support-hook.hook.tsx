import { useCallback, useEffect, useState } from "react";
import { useSupportUnreadContext } from "@/contexts/support-unread-context";
import {
  closeTicket as closeTicketApi,
  getTicketDetail,
  getTickets,
  getUnreadCount,
  replyToTicket as replyToTicketApi,
  sendEmail as sendEmailApi,
  syncTickets as syncTicketsApi,
} from "@/services/support-service.service";
import type { GetTicketsParams } from "@/services/support-service.service";
import type {
  ReplyRequest,
  SendEmailRequest,
  TicketDetail,
  TicketListResponse,
} from "@/types/support";

export function useSupportTickets(params: GetTicketsParams) {
  const { page, size, status, search } = params;
  const [data, setData] = useState<TicketListResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTickets = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await getTickets({ page, size, status, search });
      setData(result);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load tickets");
    } finally {
      setIsLoading(false);
    }
  }, [page, size, status, search]);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  return { data, isLoading, error, refetch: fetchTickets };
}

export function useSupportUnreadCount() {
  const context = useSupportUnreadContext();
  const [count, setCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);

  const fetchCount = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await getUnreadCount();
      setCount(result);
    } catch {
      setCount(0);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!context) fetchCount();
  }, [context, fetchCount]);

  if (context) return context;
  return { count, isLoading, refetch: fetchCount };
}

export function useTicketDetail(ticketId: string | null) {
  const [detail, setDetail] = useState<TicketDetail | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDetail = useCallback(async () => {
    if (!ticketId) {
      setDetail(null);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const result = await getTicketDetail(ticketId);
      setDetail(result);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load ticket");
      setDetail(null);
    } finally {
      setIsLoading(false);
    }
  }, [ticketId]);

  useEffect(() => {
    fetchDetail();
  }, [fetchDetail]);

  return { detail, isLoading, error, refetch: fetchDetail };
}

export async function syncTickets() {
  return syncTicketsApi();
}

export async function replyToTicket(ticketId: string, payload: ReplyRequest) {
  return replyToTicketApi(ticketId, payload);
}

export async function closeTicket(ticketId: string) {
  return closeTicketApi(ticketId);
}

export async function sendEmail(payload: SendEmailRequest) {
  return sendEmailApi(payload);
}
