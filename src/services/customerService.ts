import { supabase } from './supabase';
import { Customer } from '../types/database.types';

export const customerService = {
  async getAllCustomers(): Promise<Customer[]> {
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .order('last_name', { ascending: true });
    
    if (error) {
      console.error('Error fetching customers:', error);
      throw error;
    }
    
    return data || [];
  },
  
  async getCustomerById(id: string): Promise<Customer | null> {
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error(`Error fetching customer with id ${id}:`, error);
      throw error;
    }
    
    return data;
  },
  
  async createCustomer(customer: Omit<Customer, 'id' | 'created_at'>): Promise<Customer> {
    const { data, error } = await supabase
      .from('customers')
      .insert(customer)
      .select()
      .single();
    
    if (error) {
      console.error('Error creating customer:', error);
      throw error;
    }
    
    return data;
  },
  
  async updateCustomer(id: string, updates: Partial<Omit<Customer, 'id' | 'created_at'>>): Promise<Customer> {
    const { data, error } = await supabase
      .from('customers')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error(`Error updating customer with id ${id}:`, error);
      throw error;
    }
    
    return data;
  },
  
  async deleteCustomer(id: string): Promise<void> {
    const { error } = await supabase
      .from('customers')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error(`Error deleting customer with id ${id}:`, error);
      throw error;
    }
  },
  
  async searchCustomers(query: string): Promise<Customer[]> {
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .or(`first_name.ilike.%${query}%,last_name.ilike.%${query}%,mobile_number.ilike.%${query}%`)
      .order('last_name', { ascending: true });
    
    if (error) {
      console.error('Error searching customers:', error);
      throw error;
    }
    
    return data || [];
  }
}; 