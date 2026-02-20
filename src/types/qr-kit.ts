export interface BusinessQrKitItem {
  transactionId: string;
  businessId: string;
  businessName: string;
  businessFirespotId: string;
  storeId: string | null;
  amount: number;
  description: string | null;
  transactionReference: string;
  transactionStatus: string;
  activated: boolean;
  createdAt: string;
  expiresAt: string;
}

export interface BusinessQrKitsResponse {
  message: string;
  status: string;
  data: {
    content: BusinessQrKitItem[];
    totalElements: number;
    totalPages: number;
    currentPage: number;
  };
  success: boolean;
}

export interface BusinessQrKitsQuery {
  businessId: string;
  page?: number;
  size?: number;
}