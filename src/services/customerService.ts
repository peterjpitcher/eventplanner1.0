import { supabase, isMockMode } from './supabase';
import { Customer } from '../types/database.types';

// Mock data handler for development without Supabase connection
class MockCustomerData {
  private customers: Customer[] = [];
  private nextId: number = 1;
  
  constructor() {
    // Generate initial mock customers
    this.generateMockCustomers();
  }
  
  private generateMockCustomers(): void {
    // Clear existing data
    this.customers = [];
    
    // Generate 15 mock customers
    const firstNames = ['John', 'Jane', 'Michael', 'Emily', 'David', 'Sarah', 'Robert', 'Linda', 'William', 'Patricia', 'James', 'Barbara', 'Mary', 'Richard', 'Susan'];
    const lastNames = ['Smith', 'Johnson', 'Williams', 'Jones', 'Brown', 'Davis', 'Miller', 'Wilson', 'Moore', 'Taylor', 'Anderson', 'Thomas', 'Jackson', 'White', 'Harris'];
    
    for (let i = 0; i < 15; i++) {
      const id = this.nextId++;
      this.customers.push({
        id: id.toString(),
        first_name: firstNames[i % firstNames.length],
        last_name: lastNames[i % lastNames.length],
        mobile_number: `+1${Math.floor(Math.random() * 1000000000 + 1000000000)}`,
        notes: i % 3 === 0 ? 'VIP customer' : i % 3 === 1 ? 'Prefers email contact' : '',
        created_at: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toISOString()
      });
    }
  }
  
  getAllCustomers(): Customer[] {
    return [...this.customers].sort((a, b) => a.last_name.localeCompare(b.last_name));
  }
  
  getCustomerById(id: string): Customer | null {
    return this.customers.find(customer => customer.id === id) || null;
  }
  
  createCustomer(customer: Omit<Customer, 'id' | 'created_at'>): Customer {
    const newCustomer: Customer = {
      ...customer,
      id: this.nextId.toString(),
      created_at: new Date().toISOString()
    };
    
    this.nextId++;
    this.customers.push(newCustomer);
    return newCustomer;
  }
  
  updateCustomer(id: string, updates: Partial<Omit<Customer, 'id' | 'created_at'>>): Customer {
    const index = this.customers.findIndex(customer => customer.id === id);
    
    if (index === -1) {
      throw new Error(`Customer with id ${id} not found`);
    }
    
    const updatedCustomer = {
      ...this.customers[index],
      ...updates
    };
    
    this.customers[index] = updatedCustomer;
    return updatedCustomer;
  }
  
  deleteCustomer(id: string): void {
    const index = this.customers.findIndex(customer => customer.id === id);
    
    if (index !== -1) {
      this.customers.splice(index, 1);
    }
  }
  
  searchCustomers(query: string): Customer[] {
    if (!query) {
      return this.getAllCustomers();
    }
    
    const lowerQuery = query.toLowerCase();
    return this.customers.filter(customer => {
      return customer.first_name.toLowerCase().includes(lowerQuery) ||
             customer.last_name.toLowerCase().includes(lowerQuery) ||
             customer.mobile_number.includes(query);
    }).sort((a, b) => a.last_name.localeCompare(b.last_name));
  }
}

// Create a single instance of the mock data handler
const mockCustomerData = new MockCustomerData();

export const customerService = {
  async getAllCustomers(): Promise<Customer[]> {
    if (isMockMode) {
      console.info('Using mock customer data instead of Supabase');
      return mockCustomerData.getAllCustomers();
    }
    
    try {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .order('last_name', { ascending: true });
      
      if (error) {
        console.error('Error fetching customers from Supabase:', error);
        console.info('Falling back to mock customer data');
        return mockCustomerData.getAllCustomers();
      }
      
      return data || [];
    } catch (err) {
      console.error('Exception fetching customers from Supabase:', err);
      console.info('Falling back to mock customer data');
      return mockCustomerData.getAllCustomers();
    }
  },
  
  async getCustomerById(id: string): Promise<Customer | null> {
    if (isMockMode) {
      console.info(`Using mock data to get customer with id ${id}`);
      return mockCustomerData.getCustomerById(id);
    }
    
    try {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) {
        console.error(`Error fetching customer with id ${id} from Supabase:`, error);
        console.info('Falling back to mock customer data');
        return mockCustomerData.getCustomerById(id);
      }
      
      return data;
    } catch (err) {
      console.error(`Exception fetching customer with id ${id} from Supabase:`, err);
      console.info('Falling back to mock customer data');
      return mockCustomerData.getCustomerById(id);
    }
  },
  
  async createCustomer(customer: Omit<Customer, 'id' | 'created_at'>): Promise<Customer> {
    if (isMockMode) {
      console.info('Using mock data to create customer');
      return mockCustomerData.createCustomer(customer);
    }
    
    try {
      const { data, error } = await supabase
        .from('customers')
        .insert(customer)
        .select()
        .single();
      
      if (error) {
        console.error('Error creating customer in Supabase:', error);
        console.info('Falling back to mock customer data');
        return mockCustomerData.createCustomer(customer);
      }
      
      return data;
    } catch (err) {
      console.error('Exception creating customer in Supabase:', err);
      console.info('Falling back to mock customer data');
      return mockCustomerData.createCustomer(customer);
    }
  },
  
  async updateCustomer(id: string, updates: Partial<Omit<Customer, 'id' | 'created_at'>>): Promise<Customer> {
    if (isMockMode) {
      console.info(`Using mock data to update customer with id ${id}`);
      return mockCustomerData.updateCustomer(id, updates);
    }
    
    try {
      const { data, error } = await supabase
        .from('customers')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        console.error(`Error updating customer with id ${id} in Supabase:`, error);
        console.info('Falling back to mock customer data');
        return mockCustomerData.updateCustomer(id, updates);
      }
      
      return data;
    } catch (err) {
      console.error(`Exception updating customer with id ${id} in Supabase:`, err);
      console.info('Falling back to mock customer data');
      return mockCustomerData.updateCustomer(id, updates);
    }
  },
  
  async deleteCustomer(id: string): Promise<void> {
    if (isMockMode) {
      console.info(`Using mock data to delete customer with id ${id}`);
      mockCustomerData.deleteCustomer(id);
      return;
    }
    
    try {
      const { error } = await supabase
        .from('customers')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error(`Error deleting customer with id ${id} from Supabase:`, error);
        console.info('Falling back to mock customer data');
        mockCustomerData.deleteCustomer(id);
      }
    } catch (err) {
      console.error(`Exception deleting customer with id ${id} from Supabase:`, err);
      console.info('Falling back to mock customer data');
      mockCustomerData.deleteCustomer(id);
    }
  },
  
  async searchCustomers(query: string): Promise<Customer[]> {
    if (isMockMode) {
      console.info('Using mock data to search customers');
      return mockCustomerData.searchCustomers(query);
    }
    
    try {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .or(`first_name.ilike.%${query}%,last_name.ilike.%${query}%,mobile_number.ilike.%${query}%`)
        .order('last_name', { ascending: true });
      
      if (error) {
        console.error('Error searching customers in Supabase:', error);
        console.info('Falling back to mock customer data');
        return mockCustomerData.searchCustomers(query);
      }
      
      return data || [];
    } catch (err) {
      console.error('Exception searching customers in Supabase:', err);
      console.info('Falling back to mock customer data');
      return mockCustomerData.searchCustomers(query);
    }
  }
}; 