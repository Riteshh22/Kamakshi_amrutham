import { supabase } from './supabase';
import { UserProfile } from '@/types/user';
import { SubscriptionPlan, Subscription } from '@/types/subscription';
import { SubscriptionPause, CreateSubscriptionPauseInput } from '@/types/subscription-pause';
import { Payment } from '@/types/payment';
import { DailyOrder, OrderStatus } from '@/types/order';
import { Feedback, CreateFeedbackInput } from '@/types/feedback';
import { Complaint, CreateComplaintInput, UpdateComplaintStatusInput } from '@/types/complaint';
import { Notification } from '@/types/notification';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

class APIError extends Error {
  status: number;
  data: any;

  constructor(status: number, message: string, data?: any) {
    super(message);
    this.status = status;
    this.data = data;
    this.name = 'APIError';
  }
}

async function apiFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  // Admin pages: use the backend-signed token stored after email-only login
  // Customer pages: use the Supabase session token
  const adminToken =
    typeof window !== 'undefined' ? sessionStorage.getItem('admin_access_token') : null;

  let token: string | null = adminToken;
  if (!token) {
    const { data: sessionData } = await supabase.auth.getSession();
    token = sessionData?.session?.access_token ?? null;
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const url = `${API_BASE_URL}${endpoint}`;

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch {
        errorData = { message: response.statusText };
      }

      const message = errorData.detail || errorData.message || `HTTP Error ${response.status}`;

      if (response.status === 401) {
        throw new APIError(401, 'Unauthorized access. Please log in.', errorData);
      } else if (response.status === 403) {
        throw new APIError(403, 'Forbidden access. You do not have permission.', errorData);
      } else if (response.status === 404) {
        throw new APIError(404, 'Requested resource not found.', errorData);
      } else if (response.status === 422) {
        throw new APIError(422, message, errorData);
      } else {
        throw new APIError(response.status, message, errorData);
      }
    }

    if (response.status === 240 || response.status === 204) {
      return {} as T;
    }

    return await response.json();
  } catch (error) {
    if (error instanceof APIError) {
      throw error;
    }
    throw new APIError(500, (error as Error).message || 'Network communication error');
  }
}

// -------------------------------------------------------------
// PROFILE APIs
// -------------------------------------------------------------
export async function getProfile(): Promise<UserProfile> {
  return apiFetch<UserProfile>('/api/profile');
}

export async function updateProfile(data: Partial<UserProfile>): Promise<UserProfile> {
  return apiFetch<UserProfile>('/api/profile', {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

// -------------------------------------------------------------
// PLANS & SUBSCRIPTIONS APIs
// -------------------------------------------------------------
export async function getPlans(): Promise<SubscriptionPlan[]> {
  return apiFetch<SubscriptionPlan[]>('/api/plans');
}

export async function getCurrentSubscription(): Promise<Subscription | null> {
  return apiFetch<Subscription | null>('/api/subscriptions/current');
}

export async function getSubscriptionHistory(): Promise<Subscription[]> {
  return apiFetch<Subscription[]>('/api/subscriptions/history');
}

export async function createSubscription(planId: string): Promise<Subscription> {
  return apiFetch<Subscription>('/api/subscriptions', {
    method: 'POST',
    body: JSON.stringify({ plan_id: planId }),
  });
}

export async function cancelSubscription(id: string): Promise<Subscription> {
  return apiFetch<Subscription>(`/api/subscriptions/${id}/cancel`, {
    method: 'POST',
  });
}

export async function renewSubscription(id: string): Promise<Subscription> {
  return apiFetch<Subscription>(`/api/subscriptions/${id}/renew`, {
    method: 'POST',
  });
}

export async function pauseSubscription(id: string, pauseData: CreateSubscriptionPauseInput): Promise<SubscriptionPause> {
  return apiFetch<SubscriptionPause>(`/api/subscriptions/${id}/pause`, {
    method: 'POST',
    body: JSON.stringify(pauseData),
  });
}

export async function getSubscriptionPauses(id: string): Promise<SubscriptionPause[]> {
  return apiFetch<SubscriptionPause[]>(`/api/subscriptions/${id}/pauses`);
}

export async function resumeSubscriptionPause(id: string, pauseId: string): Promise<{ success: boolean }> {
  return apiFetch<{ success: boolean }>(`/api/subscriptions/${id}/pause/${pauseId}`, {
    method: 'DELETE',
  });
}

// -------------------------------------------------------------
// ORDERS APIs
// -------------------------------------------------------------
export async function getTodayOrder(): Promise<DailyOrder | null> {
  return apiFetch<DailyOrder | null>('/api/orders/today');
}

export async function getOrders(): Promise<DailyOrder[]> {
  return apiFetch<DailyOrder[]>('/api/orders');
}

export async function getOrderDetails(id: string): Promise<DailyOrder> {
  return apiFetch<DailyOrder>(`/api/orders/${id}`);
}

export async function confirmOrder(id: string): Promise<DailyOrder> {
  return apiFetch<DailyOrder>(`/api/orders/${id}/confirm`, {
    method: 'POST',
  });
}

export async function skipOrder(id: string): Promise<DailyOrder> {
  return apiFetch<DailyOrder>(`/api/orders/${id}/skip`, {
    method: 'POST',
  });
}

// -------------------------------------------------------------
// FEEDBACK APIs
// -------------------------------------------------------------
export async function submitFeedback(data: CreateFeedbackInput): Promise<Feedback> {
  return apiFetch<Feedback>('/api/feedback', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function getMyFeedback(): Promise<Feedback[]> {
  return apiFetch<Feedback[]>('/api/feedback/my');
}

// -------------------------------------------------------------
// COMPLAINTS APIs
// -------------------------------------------------------------
export async function submitComplaint(data: CreateComplaintInput): Promise<Complaint> {
  return apiFetch<Complaint>('/api/complaints', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function getMyComplaints(): Promise<Complaint[]> {
  return apiFetch<Complaint[]>('/api/complaints/my');
}

export async function getComplaintDetails(id: string): Promise<Complaint> {
  return apiFetch<Complaint>(`/api/complaints/${id}`);
}

// -------------------------------------------------------------
// NOTIFICATIONS APIs
// -------------------------------------------------------------
export async function getNotifications(): Promise<Notification[]> {
  return apiFetch<Notification[]>('/api/notifications');
}

export async function markNotificationRead(id: string): Promise<Notification> {
  return apiFetch<Notification>(`/api/notifications/${id}/read`, {
    method: 'PUT',
  });
}

export async function markAllNotificationsRead(): Promise<{ success: boolean }> {
  return apiFetch<{ success: boolean }>('/api/notifications/read-all', {
    method: 'PUT',
  });
}

// -------------------------------------------------------------
// ADMIN APIs
// -------------------------------------------------------------
export async function getAdminDashboard(): Promise<any> {
  return apiFetch<any>('/api/admin/dashboard');
}

export async function getAdminOrdersToday(params?: { area?: string; payment_status?: string; delivery_status?: string; search?: string }): Promise<DailyOrder[]> {
  const query = new URLSearchParams(params as any).toString();
  return apiFetch<DailyOrder[]>(`/api/admin/orders/today${query ? `?${query}` : ''}`);
}

export async function updateAdminOrderStatus(orderId: string, status: OrderStatus): Promise<DailyOrder> {
  return apiFetch<DailyOrder>(`/api/admin/orders/${orderId}/status`, {
    method: 'PUT',
    body: JSON.stringify({ status }),
  });
}

export async function getAdminCustomers(): Promise<UserProfile[]> {
  return apiFetch<UserProfile[]>('/api/admin/customers');
}

export async function getAdminSubscriptions(statusFilter?: string): Promise<Subscription[]> {
  return apiFetch<Subscription[]>(`/api/admin/subscriptions${statusFilter ? `?status=${statusFilter}` : ''}`);
}

export async function getAdminPayments(): Promise<Payment[]> {
  return apiFetch<Payment[]>('/api/admin/payments');
}

export async function getAdminDeliveries(): Promise<any[]> {
  return apiFetch<any[]>('/api/admin/deliveries');
}

export async function getAdminFeedback(ratingFilter?: number): Promise<Feedback[]> {
  return apiFetch<Feedback[]>(`/api/admin/feedback${ratingFilter ? `?rating=${ratingFilter}` : ''}`);
}

export async function getAdminComplaints(): Promise<Complaint[]> {
  return apiFetch<Complaint[]>('/api/admin/complaints');
}

export async function updateAdminComplaint(id: string, data: UpdateComplaintStatusInput): Promise<Complaint> {
  return apiFetch<Complaint>(`/api/admin/complaints/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}
