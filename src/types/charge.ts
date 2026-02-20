export interface BusinessCharge {
  id: string;
  title: string;
  percentageRate: number;
  transactionChargeType: string;
}

export interface BusinessChargesResponse {
  message: string;
  status: string;
  data: BusinessCharge[];
  success: boolean;
}

export interface BusinessChargesQuery {
  businessId: string;
}