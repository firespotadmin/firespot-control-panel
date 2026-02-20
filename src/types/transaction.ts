export interface BusinessTransaction {
  id: string;
  createdAt: string;
  updatedAt: string;
  customerId: string | null;
  customerUserId: string | null;
  storeId: string;
  businessId: string;
  productIds: string[];
  amount: number;
  transactionReference: string;
  description: string | null;
  paymentMethod: string;
  transactionStatus: "SUCCESS" | "PENDING" | "FAILED" | "REFUNDED";
  activated: boolean;
  initiatedAt: string;
  activatedAt: string | null;
  expiresAt: string;
  paidAt: string | null;
  settledAt: string | null;
  refundedAt: string | null;
}

export interface BusinessTransactionsResponse {
  message: string;
  status: string;
  data: {
    totalPages: number;
    content: BusinessTransaction[];
    currentPage: number;
    totalElements: number;
  };
  success: boolean;
}

export interface BusinessTransactionsQuery {
  businessId: string;
  from?: string;
  to?: string;
  status?: string;
  location?: string;
  search?: string;
  page?: number;
  size?: number;
}

export interface TransactionStatsData {
  totalTransactions: number;
  gross: number;
  totalSuccessful: number;
  totalPending: number;
  totalFailed: number;
}

export interface TransactionStatsResponse {
  message: string;
  status: string;
  data: TransactionStatsData;
  success: boolean;
}

export interface AdminTransaction {
  id: string;
  businessId: string;
  transactionReference: string;
  transactionStatus: string;
  amount: number;
  createdAt: string;
}

export interface AdminTransactionsPage {
  content: AdminTransaction[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

export interface AdminAllTransactionsData {
  data: AdminTransaction[] | AdminTransactionsPage;
  numberOfPages: number;
  numberOfItems: number;
}

export interface AdminAllTransactionsResponse {
  message: string;
  data: AdminAllTransactionsData;
}

export interface AdminAllTransactionsQuery {
  page: number;
  size: number;
  status?: string;
  search?: string;
}