export type OrderStatus =
  | 'pending'
  | 'preparing'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled'
  | 'skipped';

export interface DailyOrder {
  id: string;
  user_id: string;
  subscription_id: string;
  date: string;
  status: OrderStatus;
  received_status: boolean;
  delivery_address: string;
  area: string;
  created_at: string;
  // Joined fields for admin UI
  customer_name?: string;
  phone?: string;
  subscription_plan_name?: string;
  payment_status?: string;
}
