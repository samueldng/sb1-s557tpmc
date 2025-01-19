// Database types
export interface Customer {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
}

export interface Product {
  id: string;
  category_id: string;
  name: string;
  description: string | null;
  price: number;
  cost_price: number;
  stock_quantity: number;
  created_at: string;
  updated_at: string;
}

export interface PaymentMethod {
  id: string;
  name: string;
  requires_installments: boolean;
  created_at: string;
}

export interface Sale {
  id: string;
  customer_id: string;
  payment_method_id: string;
  total_amount: number;
  payment_status: 'pending' | 'paid' | 'cancelled';
  due_date: string | null;
  created_at: string;
  updated_at: string;
}

export interface SaleItem {
  id: string;
  sale_id: string;
  product_id: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  created_at: string;
}

export interface Installment {
  id: string;
  sale_id: string;
  amount: number;
  due_date: string;
  status: 'pending' | 'paid' | 'cancelled';
  created_at: string;
  updated_at: string;
}