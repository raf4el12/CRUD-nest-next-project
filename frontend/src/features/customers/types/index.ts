/**
 * Customer Types
 */

export type CustomerStatus = 'active' | 'inactive' | 'blocked';

export interface Customer {
  id: number;
  name: string;
  email: string;
  avatar?: string;
  phone?: string;
  country?: string;
  countryCode?: string;
  city?: string;
  address?: string;
  status: CustomerStatus;
  ordersCount: number;
  totalSpent: number;
  createdAt: string;
  updatedAt: string;
}

export interface CustomerStats {
  totalCustomers: number;
  activeCustomers: number;
  newCustomersThisMonth: number;
  avgOrderValue: number;
}
