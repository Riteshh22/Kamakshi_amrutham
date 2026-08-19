export type UserRole = 'customer' | 'admin';

export interface UserProfile {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  delivery_address: string;
  area: string;
  pincode: string;
  role: UserRole;
  created_at: string;
}
