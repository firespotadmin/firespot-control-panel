export interface GeneralEntity {
  id?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Business extends GeneralEntity {
  businessName: string;
  businessImageUrl?: string;
  businessBannerImageUrl?: string;
  businessDescription?: string;

  contactInformation: ContactInformation;

  businessType?: BusinessType;
  businessMainAddress?: BusinessAddress;
  settlementBankAccount?: SettlementBankAccount;

  registrationNumber?: string;
  industry?: string;
  numberOfBranches?: string;

  accountIsDeleted: boolean;
  opening_hours?: string;
  websiteUrl?: string;

  socialMediaProfile?: SocialMediaProfile;

  verified: boolean;
  firespotId?: string;

  customerIdThatLikeBusiness?: Set<string>;
  customerUserIdThatBoughtFromBusiness?: Set<string>;

  totalAmountReceived?: number;
  averageFeedbackRating: number;
  numberOfFeedbacks: number;
  numberOfVisits?: number;

  fcmToken?: string;
}

export interface ContactInformation {
  phoneNumber?: string;
  email?: string;
}

export interface BusinessAddress {
  street?: string;
  city?: string;
  state?: string;
  country?: string;
}

export interface SettlementBankAccount {
  bankName?: string;
  accountNumber?: string;
  accountName?: string;
}

export interface SocialMediaProfile {
  facebook?: string | null;
  instagram?: string | null;
  twitter?: string | null;
  linkedin?: string | null;
  tiktok?: string | null;
  website?: string | null;
}

export interface SocialMediaProfile {
  facebook?: string | null;
  instagram?: string | null;
  twitter?: string | null;
  linkedin?: string | null;
  tiktok?: string | null;
  website?: string | null;
}

export type BusinessType =
  | "RETAIL"
  | "SERVICE"
  | "FOOD"
  | "TECH"
  | "OTHER";

  export interface DashboardStats {
  totalSignUps: number;
  totalVerified: number;
  totalUnverified: number;
  totalActive: number;
  totalStatementsGenerated: number;
}
