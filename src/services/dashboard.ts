import { supabase } from '../lib/supabase';

export const dashboardService = {
  async getTotalSales() {
    const { data, error } = await supabase
      .from('sales')
      .select('total_amount')
      .eq('payment_status', 'paid');
    
    if (error) throw error;
    return data.reduce((acc, curr) => acc + curr.total_amount, 0);
  },

  async getTotalProfit() {
    const { data, error } = await supabase.rpc('get_total_profit');
    
    if (error) throw error;
    return data;
  },

  async getTotalProducts() {
    const { count, error } = await supabase
      .from('sale_items')
      .select('*', { count: 'exact', head: true });
    
    if (error) throw error;
    return count || 0;
  },

  async getTotalReceivables() {
    const { data, error } = await supabase.rpc('get_total_receivables');
    
    if (error) throw error;
    return data;
  },

  async getRecentSales(limit = 3) {
    const { data, error } = await supabase
      .from('sales')
      .select(`
        *,
        customers (
          name
        )
      `)
      .order('created_at', { ascending: false })
      .limit(limit);
    
    if (error) throw error;
    return data;
  },

  async getTopProducts(limit = 3) {
    const { data, error } = await supabase
      .from('sale_items')
      .select(`
        quantity,
        total_price,
        products (
          name
        )
      `)
      .order('quantity', { ascending: false })
      .limit(limit);
    
    if (error) throw error;
    return data;
  }
};