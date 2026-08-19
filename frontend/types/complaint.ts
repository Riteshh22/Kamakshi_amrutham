export type ComplaintStatus = 'pending' | 'in_progress' | 'resolved' | 'rejected';

export interface Complaint {
  id: string;
  user_id: string;
  order_id: string;
  description: string;
  status: ComplaintStatus;
  admin_response?: string;
  created_at: string;
  customer_name?: string;
  order_date?: string;
}

export interface CreateComplaintInput {
  order_id: string;
  description: string;
}

export interface UpdateComplaintStatusInput {
  status: ComplaintStatus;
  admin_response?: string;
}
