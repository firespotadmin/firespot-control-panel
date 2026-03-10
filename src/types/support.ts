export type { BackofficeApiResponse } from "@/types/api";

// Ticket status (from backend)
export type TicketStatus = "OPEN" | "REPLIED" | "CLOSED";

// Sync
export interface SyncResponse {
  message: string;
  ticketsCreated: number;
}

// List
export interface TicketSummary {
  id: string;
  ticketNumber: string;
  senderEmail: string;
  subject: string;
  status: TicketStatus;
  createdAt: string; // ISO 8601
  unread: boolean;
}

export interface TicketListResponse {
  tickets: TicketSummary[];
  total: number;
  page: number;
  size: number;
}

// Detail
export interface MessageItem {
  from: string;
  message: string;
  date: string; // ISO 8601
}

export interface TicketDetail {
  id: string;
  ticketNumber: string;
  senderEmail: string;
  subject: string;
  status: TicketStatus;
  messages: MessageItem[];
  createdAt: string;
  updatedAt: string;
}

// Request bodies
export interface ReplyRequest {
  message: string;
}

export interface SendEmailRequest {
  to: string;
  subject: string;
  message: string;
}
