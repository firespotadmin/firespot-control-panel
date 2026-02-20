export interface CustomerPhoneNumber {
  countryCode?: string;
  number?: string;
}

export interface CustomerRecord {
  id: string;
  createdAt: string;
  updatedAt: string;
  firstName: string | null;
  lastName: string | null;
  emailAddress: string;
  password: string;
  phoneNumber: CustomerPhoneNumber | null;
  role: string[];
  accountStatus: string;
  storeId: string | null;
  businessId: string | null;
  profilePictureUrl: string | null;
}

export interface CustomersResponse {
  message: string;
  status: string;
  data: CustomerRecord[];
  success: boolean;
}

export interface CustomersQuery {
  from?: string;
  to?: string;
  status?: string;
  search?: string;
  page?: number;
  size?: number;
}

export interface CustomerStatsData {
  totalActive: number;
  totalSignUps: number;
  totalStatementsGenerated: number;
  totalVerified: number;
  totalUnverified: number;
}

export interface CustomerStatsResponse {
  message: string;
  status: string;
  data: CustomerStatsData;
  success: boolean;
}