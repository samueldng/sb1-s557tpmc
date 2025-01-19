import { supabase } from '../lib/supabase';
import type { PaymentMethod } from '../lib/types';

export const paymentMethodsService = {
  async getAll() {
    const { data, error } = await supabase
      .from('payment_methods')
      .select('*')
      .order('name');
    
    if (error) throw error;
    return data as PaymentMethod[];
  }
};