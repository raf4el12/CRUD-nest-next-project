/**
 * Settings Types
 */

export type SettingsTab = 
  | 'store-details' 
  | 'payments' 
  | 'checkout' 
  | 'shipping' 
  | 'locations' 
  | 'notifications';

export interface StoreProfile {
  storeName: string;
  phone: string;
  contactEmail: string;
  senderEmail: string;
  logo?: string;
}

export interface BillingAddress {
  legalName: string;
  country: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
}

export interface TimeZoneSettings {
  timezone: string;
  orderPrefix: string;
  orderSuffix: string;
}

export interface CurrencySettings {
  currency: string;
  currencyFormat: 'symbol-first' | 'symbol-last';
}

export interface PaymentProvider {
  id: string;
  name: string;
  description: string;
  icon?: string;
  isEnabled: boolean;
  isConfigured: boolean;
}

export interface ShippingZone {
  id: string;
  name: string;
  countries: string[];
  rates: ShippingRate[];
}

export interface ShippingRate {
  id: string;
  name: string;
  condition: string;
  price: number;
}

export interface StoreLocation {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  phone?: string;
  isDefault: boolean;
}

export interface NotificationSetting {
  id: string;
  title: string;
  description: string;
  email: boolean;
  push: boolean;
}
