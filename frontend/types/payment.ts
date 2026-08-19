export type PaymentStatus = 'paid' | 'pending' | 'failed' | 'refunded';

export interface Payment {
  id: string;
  user_id: string;
  subscription_id: string;
  amount: number;
  payment_method: string;
  transaction_id: string;
  status: PaymentStatus;
  paid_at: string;
  created_at: string;
  customer_name?: string;
  plan_name?: string;
}
