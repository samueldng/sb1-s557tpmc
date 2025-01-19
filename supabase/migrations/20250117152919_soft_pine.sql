/*
  # Initial Sales Management System Schema

  1. New Tables
    - `customers`
      - Basic customer information
    - `categories`
      - Product categories
    - `products`
      - Product information including stock and pricing
    - `payment_methods`
      - Available payment methods
    - `sales`
      - Sales transactions
    - `sale_items`
      - Individual items in each sale
    - `installments`
      - Payment installments for credit sales

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create customers table
CREATE TABLE IF NOT EXISTS customers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text,
  phone text,
  address text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  created_at timestamptz DEFAULT now()
);

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid REFERENCES categories(id),
  name text NOT NULL,
  description text,
  price decimal(10,2) NOT NULL,
  cost_price decimal(10,2) NOT NULL,
  stock_quantity integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create payment_methods table
CREATE TABLE IF NOT EXISTS payment_methods (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  requires_installments boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Insert default payment methods
INSERT INTO payment_methods (name, requires_installments) VALUES
  ('Cash', false),
  ('PIX', false),
  ('Credit Card', false),
  ('Credit', true);

-- Create sales table
CREATE TABLE IF NOT EXISTS sales (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid REFERENCES customers(id),
  payment_method_id uuid REFERENCES payment_methods(id),
  total_amount decimal(10,2) NOT NULL,
  payment_status text DEFAULT 'pending',
  due_date timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create sale_items table
CREATE TABLE IF NOT EXISTS sale_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sale_id uuid REFERENCES sales(id),
  product_id uuid REFERENCES products(id),
  quantity integer NOT NULL,
  unit_price decimal(10,2) NOT NULL,
  total_price decimal(10,2) NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create installments table
CREATE TABLE IF NOT EXISTS installments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sale_id uuid REFERENCES sales(id),
  amount decimal(10,2) NOT NULL,
  due_date timestamptz NOT NULL,
  status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE sale_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE installments ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow all access to authenticated users" ON customers
  FOR ALL TO authenticated USING (true);

CREATE POLICY "Allow all access to authenticated users" ON categories
  FOR ALL TO authenticated USING (true);

CREATE POLICY "Allow all access to authenticated users" ON products
  FOR ALL TO authenticated USING (true);

CREATE POLICY "Allow all access to authenticated users" ON payment_methods
  FOR ALL TO authenticated USING (true);

CREATE POLICY "Allow all access to authenticated users" ON sales
  FOR ALL TO authenticated USING (true);

CREATE POLICY "Allow all access to authenticated users" ON sale_items
  FOR ALL TO authenticated USING (true);

CREATE POLICY "Allow all access to authenticated users" ON installments
  FOR ALL TO authenticated USING (true);

-- Create functions
CREATE OR REPLACE FUNCTION get_total_receivables()
RETURNS decimal
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN COALESCE(
    (SELECT SUM(total_amount)
     FROM sales
     WHERE payment_status = 'pending'),
    0
  );
END;
$$;

CREATE OR REPLACE FUNCTION get_total_profit()
RETURNS decimal
LANGUAGE plpgsql
AS $$
DECLARE
  total decimal;
BEGIN
  SELECT COALESCE(SUM(
    (si.unit_price - p.cost_price) * si.quantity
  ), 0) INTO total
  FROM sale_items si
  JOIN products p ON p.id = si.product_id;
  
  RETURN total;
END;
$$;