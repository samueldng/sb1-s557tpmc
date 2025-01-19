import { supabase } from '../lib/supabase';
import type { Sale, SaleItem, Installment } from '../lib/types';

export const salesService = {
  async getAll() {
    const { data, error } = await supabase
      .from('sales')
      .select(`
        *,
        customers (
          id,
          name
        ),
        payment_methods (
          id,
          name
        )
      `)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data as (Sale & {
      customers: { id: string; name: string };
      payment_methods: { id: string; name: string };
    })[];
  },

  async getById(id: string) {
    const { data: sale, error: saleError } = await supabase
      .from('sales')
      .select(`
        *,
        customers (
          id,
          name
        ),
        payment_methods (
          id,
          name
        )
      `)
      .eq('id', id)
      .single();
    
    if (saleError) throw saleError;

    const { data: items, error: itemsError } = await supabase
      .from('sale_items')
      .select(`
        *,
        products (
          id,
          name,
          price
        )
      `)
      .eq('sale_id', id);
    
    if (itemsError) throw itemsError;

    const { data: installments, error: installmentsError } = await supabase
      .from('installments')
      .select('*')
      .eq('sale_id', id);
    
    if (installmentsError) throw installmentsError;

    return {
      ...sale,
      items,
      installments
    };
  },

  async create(
    sale: Omit<Sale, 'id' | 'created_at' | 'updated_at'>,
    items: Omit<SaleItem, 'id' | 'sale_id' | 'created_at'>[],
    installments?: Omit<Installment, 'id' | 'sale_id' | 'created_at' | 'updated_at'>[]
  ) {
    const { data: saleData, error: saleError } = await supabase
      .from('sales')
      .insert([sale])
      .select()
      .single();
    
    if (saleError) throw saleError;

    const saleItems = items.map(item => ({
      ...item,
      sale_id: saleData.id
    }));

    const { error: itemsError } = await supabase
      .from('sale_items')
      .insert(saleItems);
    
    if (itemsError) throw itemsError;

    if (installments && installments.length > 0) {
      const saleInstallments = installments.map(installment => ({
        ...installment,
        sale_id: saleData.id
      }));

      const { error: installmentsError } = await supabase
        .from('installments')
        .insert(saleInstallments);
      
      if (installmentsError) throw installmentsError;
    }

    return saleData as Sale;
  },

  async updatePaymentStatus(id: string, status: Sale['payment_status']) {
    const { data, error } = await supabase
      .from('sales')
      .update({ payment_status: status })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data as Sale;
  },

  async updateInstallmentStatus(id: string, status: Installment['status']) {
    const { data, error } = await supabase
      .from('installments')
      .update({ status })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data as Installment;
  }
};