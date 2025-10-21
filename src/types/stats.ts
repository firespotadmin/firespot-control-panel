export interface StatsResponse {
  message: string;
  status: string;
  success: boolean;
  data: StatsDataWrapper;
}

export interface StatsDataWrapper {
  success: boolean;
  message: string;
  status: string;
  data: PlatformStats;
}

export interface PlatformStats {
  users: UserStats;
  businesses: BusinessStats;
  transactions: TransactionStats;
  customers: CustomerStats;
  feedback: FeedbackStats;
}

export interface UserStats {
  totalUsers: number;
  inactiveUsers: number;
  unverifiedUsers: number;
  activeUsers: number;
  guestUsers: number;
  registeredUsers: number;
  newUsersLast30Days: number;
}

export interface BusinessStats {
  statementsGenerated: number;
  activeBusinesses: number;
  newSignUps: number;
  totalBusinesses: number;
  verifiedBusinesses: number;
}

export interface TransactionStats {
  cardsProcessed: number;
  pendingTransactions: number;
  grossMerchandiseVolume: number;
  walletFloat: number;
  failedTransactions: number;
  totalTransactions: number;
  grossRevenue: number;
  transfersProcessed: number;
  successfulTransactions: number;
}

export interface CustomerStats {
  customerStatementsGenerated: number;
  customersPaid: number;
  customersSignedUp: number;
}

export interface FeedbackStats {
  feedbackSentToBusinesses: number;
  businessesRated: number;
}
