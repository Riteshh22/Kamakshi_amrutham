export interface Feedback {
  id: string;
  user_id: string;
  order_id: string;
  rating: number; // 1 - 5 stars
  comment?: string;
  created_at: string;
  customer_name?: string;
  order_date?: string;
}

export interface CreateFeedbackInput {
  order_id: string;
  rating: number;
  comment?: string;
}
