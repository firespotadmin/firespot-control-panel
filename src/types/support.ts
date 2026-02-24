export type SupportTicketStatus =
  | "OPEN"
  | "IN_PROGRESS"
  | "RESOLVED"
  | "CLOSED";

export interface SupportTicket {
  id: string;
  createdAt: string;
  updatedAt?: string;
  email: string;
  name?: string;
  subject: string;
  message: string;
  status: SupportTicketStatus;
  response?: string | null;
  respondedAt?: string | null;
}

export interface SupportTicketQuery {
  page: number;
  size: number;
  search?: string;
  status?: string;
}

export interface SupportTicketListResponse {
  message?: string;
  status?: string;
  success?: boolean;
  data?: {
    content?: SupportTicket[];
    totalPages?: number;
    currentPage?: number;
    totalElements?: number;
  };
}

export interface SupportTicketStatusUpdatePayload {
  status: SupportTicketStatus;
}

export interface SupportTicketResponsePayload {
  response: string;
}
