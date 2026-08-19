export interface SubscriptionPause {
  id: string;
  user_id: string;
  subscription_id: string;
  start_date: string;
  end_date: string;
  reason?: string;
  created_at: string;
}

export interface CreateSubscriptionPauseInput {
  subscription_id: string;
  start_date: string;
  end_date: string;
  reason?: string;
}
