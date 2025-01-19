/*
  # Atualizar políticas de segurança RLS

  1. Alterações
    - Atualiza as políticas de segurança para permitir acesso anônimo às tabelas
    - Mantém a segurança básica para evitar modificações não autorizadas

  2. Segurança
    - Permite leitura anônima para todas as tabelas
    - Mantém restrições de escrita apenas para usuários autenticados
*/

-- Customers
DROP POLICY IF EXISTS "Allow all access to authenticated users" ON customers;
CREATE POLICY "Allow select for anonymous users" ON customers
  FOR SELECT USING (true);
CREATE POLICY "Allow insert/update/delete for authenticated users" ON customers
  FOR ALL USING (auth.role() = 'authenticated');

-- Categories
DROP POLICY IF EXISTS "Allow all access to authenticated users" ON categories;
CREATE POLICY "Allow select for anonymous users" ON categories
  FOR SELECT USING (true);
CREATE POLICY "Allow insert/update/delete for authenticated users" ON categories
  FOR ALL USING (auth.role() = 'authenticated');

-- Products
DROP POLICY IF EXISTS "Allow all access to authenticated users" ON products;
CREATE POLICY "Allow select for anonymous users" ON products
  FOR SELECT USING (true);
CREATE POLICY "Allow insert/update/delete for authenticated users" ON products
  FOR ALL USING (auth.role() = 'authenticated');

-- Payment Methods
DROP POLICY IF EXISTS "Allow all access to authenticated users" ON payment_methods;
CREATE POLICY "Allow select for anonymous users" ON payment_methods
  FOR SELECT USING (true);
CREATE POLICY "Allow insert/update/delete for authenticated users" ON payment_methods
  FOR ALL USING (auth.role() = 'authenticated');

-- Sales
DROP POLICY IF EXISTS "Allow all access to authenticated users" ON sales;
CREATE POLICY "Allow select for anonymous users" ON sales
  FOR SELECT USING (true);
CREATE POLICY "Allow insert/update/delete for authenticated users" ON sales
  FOR ALL USING (auth.role() = 'authenticated');

-- Sale Items
DROP POLICY IF EXISTS "Allow all access to authenticated users" ON sale_items;
CREATE POLICY "Allow select for anonymous users" ON sale_items
  FOR SELECT USING (true);
CREATE POLICY "Allow insert/update/delete for authenticated users" ON sale_items
  FOR ALL USING (auth.role() = 'authenticated');

-- Installments
DROP POLICY IF EXISTS "Allow all access to authenticated users" ON installments;
CREATE POLICY "Allow select for anonymous users" ON installments
  FOR SELECT USING (true);
CREATE POLICY "Allow insert/update/delete for authenticated users" ON installments
  FOR ALL USING (auth.role() = 'authenticated');