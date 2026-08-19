export type SubscriptionStatus = 'active' | 'expired' | 'cancelled' | 'paused';

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  duration_days: number;
  description: string;
  features: string[];
}

export interface Subscription {
  id: string;
  user_id: string;
  plan_id: string;
  status: SubscriptionStatus;
  start_date: string;
  end_date: string;
  created_at: string;
  plan?: SubscriptionPlan;
}
