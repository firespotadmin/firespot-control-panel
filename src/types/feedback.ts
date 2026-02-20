export interface BusinessFeedbackItem {
  feedBackId: string;
  customerName: string;
  profilePictureUrl: string | null;
  comment: string | null;
  rating: number;
  dateTime: string;
}

export interface BusinessFeedbackData {
  totalNumberOfItem: number;
  totalNumberOfPages: number;
  averageFeedbackRating: number;
  feedbacks: Record<string, BusinessFeedbackItem[]> | null;
}

export interface BusinessFeedbackResponse {
  message: string;
  status: string;
  data: BusinessFeedbackData;
  success: boolean;
}

export interface BusinessFeedbackQuery {
  businessId: string;
  from?: string;
  to?: string;
  search?: string;
  rating?: string;
  page?: number;
  size?: number;
}